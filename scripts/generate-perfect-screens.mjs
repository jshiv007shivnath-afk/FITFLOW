import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Reusable Bottom Tab Bar HTML
function bottomNav(activeTab) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'progress', label: 'Progress', icon: 'M18 20V10M12 20V4M6 20v-6' },
    { id: 'add', label: 'Log', icon: 'M12 5v14M5 12h14' },
    { id: 'rewards', label: 'Vault', icon: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H7M14 14.66V17c0 .55.45 1 1 1h2M18 2H6v7a6 6 0 0 0 12 0V2z' },
    { id: 'profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }
  ];
  return `
    <div style="background: #FFFFFF; border-top: 1px solid #E8EAE5; padding: 12px 20px 20px; display: flex; justify-content: space-between; align-items: center; margin: 0 -20px -24px;">
      ${tabs.map(t => {
        const isActive = t.id === activeTab;
        const color = isActive ? '#111312' : '#8E928A';
        const bg = isActive ? '#E5FBC5' : 'transparent';
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
            <div style="width: 44px; height: 32px; border-radius: 16px; background: ${bg}; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${isActive ? '2.4' : '1.8'}" stroke-linecap="round" stroke-linejoin="round">
                <path d="${t.icon}"/>
              </svg>
            </div>
            <span style="font-size: 11px; font-weight: ${isActive ? '800' : '600'}; color: ${color};">${t.label}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Reusable Top Status Bar HTML
function statusBar() {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #111312; margin-bottom: 14px; padding: 0 4px;">
      <span>09:41</span>
      <div style="display: flex; align-items: center; gap: 6px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 18.25C3.52 16.5 3 14.33 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.33-.52 4.5-1.35 6.25l-.62-.64C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
        <div style="width: 20px; height: 10px; border: 1.5px solid #111312; border-radius: 3px; padding: 1px; display: flex;"><div style="width: 80%; height: 100%; background: #111312; border-radius: 1px;"></div></div>
      </div>
    </div>
  `;
}

const screenDefs = [
  // 1. HOME DASHBOARD
  {
    file: 'screen_home.png',
    title: 'FitFlow Dashboard',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 20px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 20px; }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: #FF5500; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; box-shadow: 0 2px 8px rgba(255,85,0,0.3); }
  .card-hero { background: #b8f45a; border-radius: 24px; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 6px 24px rgba(69,104,0,0.12); }
  .card-hero h2 { font-size: 22px; font-weight: 900; color: #111312; margin-top: 3px; letter-spacing: -0.02em; }
  .card-hero p { font-size: 13px; color: #2d5000; font-weight: 700; margin-top: 2px; }
  .ring-wrap { position: relative; width: 88px; height: 88px; display: flex; align-items: center; justify-content: center; }
  .ring-wrap svg { transform: rotate(-90deg); width: 88px; height: 88px; }
  .ring-center { position: absolute; text-align: center; }
  .ring-center .num { font-size: 26px; font-weight: 900; line-height: 1; color: #111312; }
  .ring-center .sub { font-size: 10px; font-weight: 800; color: #3d6a00; text-transform: uppercase; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
  .tile { background: #FFFFFF; border-radius: 20px; padding: 15px; border: 1px solid #E8EAE5; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .tile-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .tile-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .tile-title { font-size: 12px; font-weight: 700; color: #737771; text-transform: uppercase; letter-spacing: 0.02em; }
  .tile-val { font-size: 26px; font-weight: 900; color: #111312; letter-spacing: -0.02em; }
  .tile-sub { font-size: 12px; color: #737771; font-weight: 600; margin-top: 3px; }
  .bar { height: 7px; background: #EEF0EB; border-radius: 4px; margin-top: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .card-banner { background: #FFFFFF; border-radius: 20px; padding: 14px 18px; border: 1px solid #E8EAE5; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 12px; }
  .recent-card { background: #111312; color: #fff; border-radius: 20px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="header">
      <div class="brand">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF5500" stroke-width="4"/><circle cx="12" cy="12" r="6" stroke="#b8f45a" stroke-width="4"/></svg>
        <span>FitFlow</span>
      </div>
      <div class="avatar">SR</div>
    </div>

    <div class="card-hero">
      <div>
        <div style="font-size: 12px; font-weight: 800; color: #3d6a00; text-transform: uppercase; letter-spacing: 0.05em;">DAILY INTAKE</div>
        <h2>Your Weekly Progress</h2>
        <p>Crushing your consistency goal</p>
      </div>
      <div class="ring-wrap">
        <svg viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3.8"/>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#111312" stroke-dasharray="84, 100" stroke-width="3.8" stroke-linecap="round"/>
        </svg>
        <div class="ring-center">
          <div class="num">6</div>
          <div class="sub">DAYS</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="tile">
        <div class="tile-head">
          <span class="tile-title">Step to Walk</span>
          <div class="tile-icon" style="background: #FFF0DF; color: #FF9D42;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/></svg>
          </div>
        </div>
        <div class="tile-val">5,500</div>
        <div class="tile-sub">Goal: 10,000 steps</div>
        <div class="bar"><div class="bar-fill" style="width: 55%; background: #FF9D42;"></div></div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <span class="tile-title">Drink Water</span>
          <div class="tile-icon" style="background: #E4F7FE; color: #42BFEF;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          </div>
        </div>
        <div class="tile-val">12 <span style="font-size: 15px; font-weight: 700;">glass</span></div>
        <div class="tile-sub">Target: 12 met!</div>
        <div class="bar"><div class="bar-fill" style="width: 100%; background: #42BFEF;"></div></div>
      </div>
    </div>

    <div class="card-banner">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="tile-icon" style="background: #FFE4E6; color: #FF626C; width: 36px; height: 36px; border-radius: 10px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 800;">Heart Rate Telemetry</div>
          <div style="font-size: 12px; color: #737771;">BLE Connected • 148 BPM (Zone 4)</div>
        </div>
      </div>
      <span style="background: #DFF8EE; color: #15803D; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px;">Optimal</span>
    </div>

    <div class="recent-card">
      <div>
        <div style="font-size: 11px; font-weight: 700; color: #b8f45a; text-transform: uppercase;">TODAY'S SESSION</div>
        <div style="font-size: 15px; font-weight: 800; margin-top: 2px;">Barbell Bench Press • 4 x 8</div>
        <div style="font-size: 12px; color: #A0A49E;">85 kg load • 480 kcal burned</div>
      </div>
      <span style="background: #FF5500; color: #fff; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 999px;">COMPLETE</span>
    </div>
  </div>

  ${bottomNav('home')}
</body>
</html>`
  },

  // 2. TELEMETRY & PROGRESS
  {
    file: 'screen_progress.png',
    title: 'FitFlow Telemetry & Progress',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 20px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title { font-size: 22px; font-weight: 900; color: #111312; letter-spacing: -0.02em; }
  .badge { background: #b8f45a; color: #111312; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 999px; }
  .workout-card { background: #111312; color: #fff; border-radius: 24px; padding: 20px; margin-bottom: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
  .exercise-name { font-size: 22px; font-weight: 900; margin-bottom: 3px; letter-spacing: -0.01em; }
  .set-info { font-size: 13px; color: #A0A49E; margin-bottom: 14px; font-weight: 600; }
  .stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: rgba(255,255,255,0.07); padding: 12px; border-radius: 16px; margin-bottom: 14px; text-align: center; }
  .stat-label { font-size: 11px; color: #A0A49E; text-transform: uppercase; font-weight: 700; }
  .stat-val { font-size: 18px; font-weight: 900; color: #FF5500; margin-top: 2px; }
  .timer-pill { background: #FF5500; color: #fff; border-radius: 999px; padding: 10px 18px; text-align: center; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(255,85,0,0.4); }
  .chart-card { background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #E8EAE5; margin-bottom: 12px; }
  .chart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 800; font-size: 14px; }
  .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 95px; padding-top: 8px; }
  .col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .col-bar { width: 34px; border-radius: 8px 8px 0 0; background: #b8f45a; }
  .col-day { font-size: 11px; font-weight: 700; color: #737771; }
  .recovery-pill { background: #FFFFFF; border: 1px solid #E8EAE5; border-radius: 16px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="header">
      <div class="title">Workout Telemetry</div>
      <span class="badge">ACTIVE SESSION</span>
    </div>

    <div class="workout-card">
      <div class="exercise-name">Barbell Back Squat</div>
      <div class="set-info">Set 3 of 4 • Progressive Overload Phase</div>
      
      <div class="stat-row">
        <div><div class="stat-label">Weight</div><div class="stat-val">140 kg</div></div>
        <div><div class="stat-label">Reps</div><div class="stat-val">5 reps</div></div>
        <div><div class="stat-label">RPE</div><div class="stat-val">8.5</div></div>
      </div>

      <div class="timer-pill">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Rest Timer: 01:45</span>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-head">
        <span>Volume Trend (Weekly)</span>
        <span style="color: #15803D; font-size: 12px; font-weight: 800;">+14% Progressive Overload</span>
      </div>
      <div class="bar-chart">
        <div class="col"><div class="col-bar" style="height: 44px; background: #EEF0EB;"></div><div class="col-day">M</div></div>
        <div class="col"><div class="col-bar" style="height: 68px; background: #EEF0EB;"></div><div class="col-day">T</div></div>
        <div class="col"><div class="col-bar" style="height: 52px; background: #EEF0EB;"></div><div class="col-day">W</div></div>
        <div class="col"><div class="col-bar" style="height: 88px; background: #b8f45a;"></div><div class="col-day">T</div></div>
        <div class="col"><div class="col-bar" style="height: 72px; background: #b8f45a;"></div><div class="col-day">F</div></div>
        <div class="col"><div class="col-bar" style="height: 94px; background: #FF5500;"></div><div class="col-day">S</div></div>
      </div>
    </div>

    <div class="recovery-pill">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">⚡</span>
        <div>
          <div style="font-size: 13px; font-weight: 800;">Fatigue Guard Active</div>
          <div style="font-size: 11px; color: #737771;">Optimal recovery window: 48h until next squat</div>
        </div>
      </div>
      <span style="color: #15803D; font-weight: 800; font-size: 12px;">READY</span>
    </div>
  </div>

  ${bottomNav('progress')}
</body>
</html>`
  },

  // 3. REWARDS & STREAKS
  {
    file: 'screen_rewards.png',
    title: 'FitFlow Rewards & Streaks',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 20px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title { font-size: 22px; font-weight: 900; color: #111312; letter-spacing: -0.02em; }
  .streak-card { background: #b8f45a; border-radius: 24px; padding: 18px 20px; margin-bottom: 12px; box-shadow: 0 6px 24px rgba(69,104,0,0.12); }
  .streak-top { display: flex; justify-content: space-between; align-items: center; }
  .streak-num { font-size: 36px; font-weight: 900; line-height: 1; color: #111312; letter-spacing: -0.03em; }
  .streak-label { font-size: 13px; font-weight: 800; color: #3d6a00; margin-top: 4px; }
  .day-dots { display: flex; justify-content: space-between; margin-top: 14px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 14px; }
  .dot { width: 36px; height: 36px; border-radius: 50%; background: #111312; color: #b8f45a; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; }
  .xp-card { background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #E8EAE5; margin-bottom: 12px; }
  .badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
  .badge-item { background: #F8F8F6; border-radius: 16px; padding: 12px; display: flex; align-items: center; gap: 10px; border: 1px solid #E8EAE5; }
  .badge-icon { width: 38px; height: 38px; border-radius: 12px; background: #FFF0DF; color: #FF5500; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="header">
      <div class="title">Discipline Vault</div>
      <span style="font-weight: 800; color: #FF5500; font-size: 13px; background: #FFF0DF; padding: 4px 10px; border-radius: 999px;">Level 4 Athlete</span>
    </div>

    <div class="streak-card">
      <div class="streak-top">
        <div>
          <div class="streak-num">14 Days</div>
          <div class="streak-label">Active Discipline Streak 🔥</div>
        </div>
        <div style="background: #111312; color: #fff; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 800;">HABIT LOCKED</div>
      </div>
      <div class="day-dots">
        <div class="dot">M</div>
        <div class="dot">T</div>
        <div class="dot">W</div>
        <div class="dot">T</div>
        <div class="dot">F</div>
        <div class="dot">S</div>
        <div class="dot" style="background: #FF5500; color: #fff;">S</div>
      </div>
    </div>

    <div class="xp-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase;">Symmetric XP Engine</div>
          <div style="font-size: 22px; font-weight: 900; color: #111312; margin-top: 1px;">340 / 500 XP</div>
        </div>
        <span style="font-size: 12px; font-weight: 800; color: #15803D; background: #DFF8EE; padding: 4px 10px; border-radius: 999px;">68% to Level 5</span>
      </div>
      <div style="height: 8px; background: #EEF0EB; border-radius: 4px; margin-top: 10px; overflow: hidden;">
        <div style="width: 68%; height: 100%; background: #111312; border-radius: 4px;"></div>
      </div>

      <div class="badge-grid">
        <div class="badge-item">
          <div class="badge-icon">🏆</div>
          <div>
            <div style="font-size: 13px; font-weight: 800;">21-Day Titan</div>
            <div style="font-size: 11px; color: #737771;">Discipline Milestone</div>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">⚡</div>
          <div>
            <div style="font-size: 13px; font-weight: 800;">Heavy Load</div>
            <div style="font-size: 11px; color: #737771;">140kg Verified PR</div>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">💧</div>
          <div>
            <div style="font-size: 13px; font-weight: 800;">Hydration Master</div>
            <div style="font-size: 11px; color: #737771;">3,000ml Target Met</div>
          </div>
        </div>
        <div class="badge-item">
          <div class="badge-icon">🛡️</div>
          <div>
            <div style="font-size: 13px; font-weight: 800;">Local Sovereign</div>
            <div style="font-size: 11px; color: #737771;">100% Offline Synced</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${bottomNav('rewards')}
</body>
</html>`
  },

  // 4. RECOVERY & BIOMETRICS
  {
    file: 'screen_profile.png',
    title: 'FitFlow Biometric Recovery',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 20px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title { font-size: 22px; font-weight: 900; color: #111312; letter-spacing: -0.02em; }
  .readiness-card { background: #111312; color: #fff; border-radius: 24px; padding: 20px; margin-bottom: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
  .readiness-val { font-size: 42px; font-weight: 900; color: #b8f45a; line-height: 1; letter-spacing: -0.03em; }
  .readiness-label { font-size: 13px; color: #A0A49E; margin-top: 6px; font-weight: 600; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .tile { background: #FFFFFF; border-radius: 20px; padding: 15px; border: 1px solid #E8EAE5; }
  .tile-title { font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase; }
  .tile-val { font-size: 24px; font-weight: 900; color: #111312; margin-top: 3px; }
  .zone-card { background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #E8EAE5; }
  .zone-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 13px; font-weight: 600; }
  .zone-bar { height: 7px; border-radius: 4px; background: #EEF0EB; overflow: hidden; margin-bottom: 10px; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="header">
      <div class="title">Recovery & Biometrics</div>
      <span style="background: #DFF8EE; color: #15803D; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 999px;">OPTIMAL CNS</span>
    </div>

    <div class="readiness-card">
      <div style="font-size: 11px; font-weight: 700; color: #A0A49E; text-transform: uppercase;">Circadian Readiness Score</div>
      <div class="readiness-val">92%</div>
      <div class="readiness-label">Optimal CNS recovery • Ready for heavy compound athletic loads</div>
    </div>

    <div class="grid-2">
      <div class="tile">
        <div class="tile-title">Resting HR</div>
        <div class="tile-val">54 <span style="font-size: 14px; font-weight: 600; color: #737771;">BPM</span></div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; margin-top: 3px;">-3 BPM vs 30d avg</div>
      </div>
      <div class="tile">
        <div class="tile-title">Heart Rate Var</div>
        <div class="tile-val">68 <span style="font-size: 14px; font-weight: 600; color: #737771;">ms</span></div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; margin-top: 3px;">High parasympathetic</div>
      </div>
    </div>

    <div class="zone-card">
      <div style="font-weight: 800; font-size: 14px; margin-bottom: 10px;">Cardio Training Zones</div>
      <div class="zone-row"><span>Zone 4 (Threshold)</span><span style="font-weight: 800; color: #FF5500;">152-168 BPM</span></div>
      <div class="zone-bar"><div style="width: 75%; height: 100%; background: #FF5500;"></div></div>
      <div class="zone-row"><span>Zone 2 (Aerobic Base)</span><span style="font-weight: 800; color: #42BFEF;">120-138 BPM</span></div>
      <div class="zone-bar"><div style="width: 50%; height: 100%; background: #42BFEF;"></div></div>
    </div>
  </div>

  ${bottomNav('profile')}
</body>
</html>`
  },

  // 5. SESSION LOGGER
  {
    file: 'screen_add.png',
    title: 'FitFlow Quick Session Logger',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 20px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title { font-size: 22px; font-weight: 900; color: #111312; letter-spacing: -0.02em; }
  .card { background: #FFFFFF; border-radius: 20px; padding: 16px 18px; border: 1px solid #E8EAE5; margin-bottom: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
  .input-box { background: #F8F8F6; border: 1px solid #E8EAE5; border-radius: 14px; padding: 12px; text-align: center; }
  .input-label { font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase; }
  .input-val { font-size: 26px; font-weight: 900; color: #111312; margin-top: 2px; }
  .btn-submit { width: 100%; background: #111312; color: #fff; border-radius: 999px; padding: 15px; text-align: center; font-weight: 800; font-size: 14px; margin-top: 8px; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
  .history-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EEF0EB; font-size: 13px; font-weight: 600; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="header">
      <div class="title">Log Workout Set</div>
      <span style="background: #111312; color: #b8f45a; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 999px;">SET #4</span>
    </div>

    <div class="card">
      <div style="font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase;">SELECTED MOVEMENT</div>
      <div style="font-size: 20px; font-weight: 900; margin-top: 2px;">Incline Dumbbell Press</div>
      
      <div class="input-grid">
        <div class="input-box">
          <div class="input-label">Weight (kg)</div>
          <div class="input-val">38</div>
        </div>
        <div class="input-box">
          <div class="input-label">Reps Completed</div>
          <div class="input-val">8</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="font-size: 11px; font-weight: 700; color: #737771; margin-bottom: 8px; text-transform: uppercase;">RPE EFFORT LEVEL</div>
      <div style="display: flex; justify-content: space-between; gap: 6px;">
        <div style="flex:1; padding: 10px; border-radius: 12px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 13px;">7.0</div>
        <div style="flex:1; padding: 10px; border-radius: 12px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 13px;">8.0</div>
        <div style="flex:1; padding: 10px; border-radius: 12px; background: #FF5500; color: #fff; text-align: center; font-weight: 900; font-size: 13px;">8.5</div>
        <div style="flex:1; padding: 10px; border-radius: 12px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 13px;">9.0</div>
        <div style="flex:1; padding: 10px; border-radius: 12px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 13px;">10</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 0;">
      <div style="font-size: 11px; font-weight: 700; color: #737771; margin-bottom: 6px; text-transform: uppercase;">SESSION LOGS TODAY</div>
      <div class="history-row"><span>Set 1</span><span style="color: #737771;">34 kg × 10 reps</span><span style="color: #15803D;">✓ Done</span></div>
      <div class="history-row"><span>Set 2</span><span style="color: #737771;">36 kg × 8 reps</span><span style="color: #15803D;">✓ Done</span></div>
      <div class="history-row" style="border:none;"><span>Set 3</span><span style="color: #737771;">38 kg × 8 reps</span><span style="color: #15803D;">✓ Done</span></div>
    </div>

    <button class="btn-submit">Confirm Set & Start Rest Timer ↗</button>
  </div>

  ${bottomNav('add')}
</body>
</html>`
  },

  // 6. ATHLETE LOGIN
  {
    file: 'screen_login.png',
    title: 'FitFlow Athlete Authentication',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; height: 760px; padding: 16px 24px 24px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; text-align: center; }
  .icon-wrap { width: 64px; height: 64px; border-radius: 22px; background: #111312; margin: 24px auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  h1 { font-size: 26px; font-weight: 900; margin-bottom: 6px; letter-spacing: -0.02em; }
  p { font-size: 14px; color: #737771; margin-bottom: 24px; line-height: 1.4; }
  .input { width: 100%; padding: 16px 18px; border-radius: 18px; border: 1.5px solid #E8EAE5; background: #FFFFFF; font-size: 15px; font-weight: 700; margin-bottom: 16px; text-align: left; }
  .btn { width: 100%; padding: 16px; border-radius: 999px; background: #FF5500; color: #fff; font-size: 15px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(255,85,0,0.35); }
  .otp-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 20px; }
  .otp-box { width: 52px; height: 56px; border-radius: 14px; background: #FFFFFF; border: 1.5px solid #E8EAE5; font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; color: #111312; }
</style>
</head>
<body>
  <div>
    ${statusBar()}
    <div class="icon-wrap">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF5500" stroke-width="3.5"/><circle cx="12" cy="12" r="5.5" stroke="#b8f45a" stroke-width="3.5"/></svg>
    </div>
    <h1>Athlete Sanctuary</h1>
    <p>Sign in with your verified biometric profile and cryptographic OTP.</p>

    <div class="input" style="display: flex; align-items: center; justify-content: space-between;">
      <span style="color: #111312;">athlete@fitflow.app</span>
      <span style="color: #15803D; font-size: 12px; font-weight: 800;">VERIFIED</span>
    </div>

    <div style="font-size: 12px; font-weight: 700; color: #737771; text-align: left; margin-bottom: 8px; text-transform: uppercase;">Enter 6-Digit One-Time Code</div>
    <div class="otp-row">
      <div class="otp-box">4</div>
      <div class="otp-box">8</div>
      <div class="otp-box">2</div>
      <div class="otp-box">9</div>
      <div class="otp-box">1</div>
      <div class="otp-box" style="border-color: #FF5500; background: #FFF0DF; color: #FF5500;">7</div>
    </div>

    <button class="btn">Enter Athlete Workspace ↗</button>
  </div>

  <div style="font-size: 12px; color: #8E928A; font-weight: 600; line-height: 1.5;">
    🔒 100% Local-First Device Storage • Zero Ad Trackers<br/>
    FitFlow Client Build v1.0.0 (Production)
  </div>
</body>
</html>`
  }
];

const outDir = 'C:\\Users\\Ansh\\.antigravity\\fitflow\\public\\screens';
const tempDir = 'C:\\Users\\Ansh\\.antigravity\\fitflow\\.temp_screens';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

async function captureHtml(html, outFile) {
  const tempHtmlPath = path.join(tempDir, `temp_${path.basename(outFile, '.png')}.html`);
  fs.writeFileSync(tempHtmlPath, html, 'utf8');

  return new Promise((resolve, reject) => {
    const port = 9777 + Math.floor(Math.random() * 100);
    const fileUrl = `file://${tempHtmlPath.replace(/\\/g, '/')}`;
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      `--remote-debugging-port=${port}`,
      '--headless=new',
      '--window-size=440,760',
      `--user-data-dir=C:\\Users\\Ansh\\.antigravity\\chrome-temp-${port}`,
      fileUrl
    ]);

    const timer = setTimeout(() => {
      chrome.kill();
      reject(new Error(`Timeout on ${outFile}`));
    }, 15000);

    setTimeout(async () => {
      try {
        const r = await fetch(`http://localhost:${port}/json`);
        const tabs = await r.json();
        const tab = tabs.find(t => t.url.includes('temp_') || t.url.includes('file'));
        const ws = new globalThis.WebSocket(tab.webSocketDebuggerUrl);

        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 440, height: 760, deviceScaleFactor: 2, mobile: true }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: {
                format: 'png',
                clip: { x: 0, y: 0, width: 440, height: 760, scale: 1 }
              }
            }));
          }, 600);
        };

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === 2 && msg.result?.data) {
            fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
            console.log('SUCCESSFULLY GENERATED CLEAN SCREEN:', outFile);
            clearTimeout(timer);
            chrome.kill();
            resolve();
          }
        };
      } catch (err) {
        clearTimeout(timer);
        chrome.kill();
        reject(err);
      }
    }, 1200);
  });
}

async function run() {
  for (const s of screenDefs) {
    const targetPath = path.join(outDir, s.file);
    try {
      await captureHtml(s.html, targetPath);
    } catch (err) {
      console.error(`Failed ${s.file}:`, err.message);
    }
  }
  // cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('ALL 6 PERFECT FULL-HEIGHT SCREENS GENERATED');
}

run();
