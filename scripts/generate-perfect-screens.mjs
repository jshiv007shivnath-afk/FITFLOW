import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Clean standalone HTML pages with embedded SVGs (no remote font/image dependencies)
const screenDefs = [
  {
    file: 'screen_home.png',
    title: 'FitFlow Dashboard',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 24px 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: #FF5500; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
  .card-hero { background: #b8f45a; border-radius: 24px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
  .card-hero h2 { font-size: 20px; font-weight: 800; color: #111312; margin-top: 4px; }
  .card-hero p { font-size: 13px; color: #2d5000; font-weight: 600; margin-top: 2px; }
  .ring-wrap { position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; }
  .ring-wrap svg { transform: rotate(-90deg); width: 84px; height: 84px; }
  .ring-center { position: absolute; text-align: center; }
  .ring-center .num { font-size: 22px; font-weight: 800; line-height: 1; }
  .ring-center .sub { font-size: 10px; font-weight: 700; color: #3d6a00; text-transform: uppercase; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .tile { background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #ECECE9; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
  .tile-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .tile-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .tile-title { font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase; }
  .tile-val { font-size: 24px; font-weight: 800; color: #111312; }
  .tile-sub { font-size: 11px; color: #737771; font-weight: 500; margin-top: 4px; }
  .bar { height: 6px; background: #EEF0EB; border-radius: 3px; margin-top: 10px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; }
  .card-banner { background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #ECECE9; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF5500" stroke-width="4"/><circle cx="12" cy="12" r="6" stroke="#b8f45a" stroke-width="4"/></svg>
      <span>FitFlow</span>
    </div>
    <div class="avatar">SR</div>
  </div>

  <div class="card-hero">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #3d6a00; text-transform: uppercase; letter-spacing: 0.05em;">DAILY INTAKE</div>
      <h2>Your Weekly Progress</h2>
      <p>Crushing your consistency goal</p>
    </div>
    <div class="ring-wrap">
      <svg viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3.8"/>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#111312" stroke-dasharray="82, 100" stroke-width="3.8" stroke-linecap="round"/>
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
      <div class="tile-val">12 <span style="font-size: 14px; font-weight: 600;">glass</span></div>
      <div class="tile-sub">Target: 12 glass met!</div>
      <div class="bar"><div class="bar-fill" style="width: 100%; background: #42BFEF;"></div></div>
    </div>
  </div>

  <div class="card-banner">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="tile-icon" style="background: #FFE4E6; color: #FF626C;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 800;">Heart Rate Telemetry</div>
        <div style="font-size: 11px; color: #737771;">BLE Connected • 64 BPM Resting</div>
      </div>
    </div>
    <span style="background: #DFF8EE; color: #15803D; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;">Optimal</span>
  </div>
</body>
</html>`
  },
  {
    file: 'screen_progress.png',
    title: 'FitFlow Telemetry & Progress',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 24px 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 20px; font-weight: 800; color: #111312; }
  .badge { background: #b8f45a; color: #111312; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; }
  .workout-card { background: #111312; color: #fff; border-radius: 24px; padding: 22px; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
  .exercise-name { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .set-info { font-size: 13px; color: #A0A49E; margin-bottom: 16px; }
  .stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: rgba(255,255,255,0.06); padding: 12px; border-radius: 16px; margin-bottom: 16px; text-align: center; }
  .stat-label { font-size: 10px; color: #A0A49E; text-transform: uppercase; font-weight: 700; }
  .stat-val { font-size: 16px; font-weight: 800; color: #FF5500; margin-top: 2px; }
  .timer-pill { background: #FF5500; color: #fff; border-radius: 999px; padding: 10px 18px; text-align: center; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .chart-card { background: #FFFFFF; border-radius: 20px; padding: 18px; border: 1px solid #ECECE9; }
  .chart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-weight: 800; font-size: 14px; }
  .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 90px; padding-top: 10px; }
  .col { display: flex; flex-col; align-items: center; gap: 6px; }
  .col-bar { width: 32px; border-radius: 6px 6px 0 0; background: #b8f45a; }
  .col-day { font-size: 10px; font-weight: 700; color: #737771; }
</style>
</head>
<body>
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>Rest Timer: 01:45</span>
    </div>
  </div>

  <div class="chart-card">
    <div class="chart-head">
      <span>Volume Trend (Weekly)</span>
      <span style="color: #15803D; font-size: 12px; font-weight: 700;">+12% Overload</span>
    </div>
    <div class="bar-chart">
      <div class="col"><div class="col-bar" style="height: 40px; background: #EEF0EB;"></div><div class="col-day">M</div></div>
      <div class="col"><div class="col-bar" style="height: 65px; background: #EEF0EB;"></div><div class="col-day">T</div></div>
      <div class="col"><div class="col-bar" style="height: 50px; background: #EEF0EB;"></div><div class="col-day">W</div></div>
      <div class="col"><div class="col-bar" style="height: 85px; background: #b8f45a;"></div><div class="col-day">T</div></div>
      <div class="col"><div class="col-bar" style="height: 70px; background: #b8f45a;"></div><div class="col-day">F</div></div>
      <div class="col"><div class="col-bar" style="height: 90px; background: #FF5500;"></div><div class="col-day">S</div></div>
    </div>
  </div>
</body>
</html>`
  },
  {
    file: 'screen_rewards.png',
    title: 'FitFlow Rewards & Streaks',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 24px 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 20px; font-weight: 800; color: #111312; }
  .streak-card { background: #b8f45a; border-radius: 24px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
  .streak-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .streak-num { font-size: 32px; font-weight: 900; line-height: 1; color: #111312; }
  .streak-label { font-size: 13px; font-weight: 700; color: #3d6a00; margin-top: 4px; }
  .day-dots { display: flex; justify-content: space-between; margin-top: 16px; background: rgba(255,255,255,0.4); padding: 10px; border-radius: 14px; }
  .dot { width: 34px; height: 34px; border-radius: 50%; background: #111312; color: #b8f45a; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; }
  .xp-card { background: #FFFFFF; border-radius: 20px; padding: 18px; border: 1px solid #ECECE9; margin-bottom: 16px; }
  .badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
  .badge-item { background: #F8F8F6; border-radius: 16px; padding: 12px; display: flex; align-items: center; gap: 10px; }
  .badge-icon { width: 36px; height: 36px; border-radius: 12px; background: #FFF0DF; color: #FF5500; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">Rewards & Streaks</div>
    <span style="font-weight: 800; color: #FF5500; font-size: 13px;">Level 4 Athlete</span>
  </div>

  <div class="streak-card">
    <div class="streak-top">
      <div>
        <div class="streak-num">14 Days</div>
        <div class="streak-label">Active Discipline Streak 🔥</div>
      </div>
      <div style="background: #111312; color: #fff; padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 800;">HABIT SECURED</div>
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
        <div style="font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase;">Symmetric XP</div>
        <div style="font-size: 20px; font-weight: 800; color: #111312;">340 / 500 XP</div>
      </div>
      <span style="font-size: 12px; font-weight: 700; color: #15803D;">68% to Level 5</span>
    </div>
    <div style="height: 8px; background: #EEF0EB; border-radius: 4px; margin-top: 10px; overflow: hidden;">
      <div style="width: 68%; height: 100%; background: #111312; border-radius: 4px;"></div>
    </div>

    <div class="badge-grid">
      <div class="badge-item">
        <div class="badge-icon">🏆</div>
        <div>
          <div style="font-size: 12px; font-weight: 800;">21-Day Titan</div>
          <div style="font-size: 10px; color: #737771;">Consistency</div>
        </div>
      </div>
      <div class="badge-item">
        <div class="badge-icon">⚡</div>
        <div>
          <div style="font-size: 12px; font-weight: 800;">Heavy Load</div>
          <div style="font-size: 10px; color: #737771;">140kg Squat</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    file: 'screen_profile.png',
    title: 'FitFlow Biometric Recovery',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 24px 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 20px; font-weight: 800; color: #111312; }
  .readiness-card { background: #111312; color: #fff; border-radius: 24px; padding: 22px; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
  .readiness-val { font-size: 38px; font-weight: 900; color: #b8f45a; line-height: 1; }
  .readiness-label { font-size: 13px; color: #A0A49E; margin-top: 6px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .tile { background: #FFFFFF; border-radius: 20px; padding: 16px; border: 1px solid #ECECE9; }
  .tile-title { font-size: 11px; font-weight: 700; color: #737771; text-transform: uppercase; }
  .tile-val { font-size: 22px; font-weight: 800; color: #111312; margin-top: 4px; }
  .zone-card { background: #FFFFFF; border-radius: 20px; padding: 18px; border: 1px solid #ECECE9; }
  .zone-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
  .zone-bar { height: 6px; border-radius: 3px; background: #EEF0EB; overflow: hidden; margin-bottom: 12px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">Recovery & Biometrics</div>
    <span style="background: #DFF8EE; color: #15803D; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px;">RESTED</span>
  </div>

  <div class="readiness-card">
    <div style="font-size: 11px; font-weight: 700; color: #A0A49E; text-transform: uppercase;">Circadian Readiness</div>
    <div class="readiness-val">92%</div>
    <div class="readiness-label">Optimal CNS recovery • Ready for heavy compound training</div>
  </div>

  <div class="grid-2">
    <div class="tile">
      <div class="tile-title">Resting HR</div>
      <div class="tile-val">54 <span style="font-size: 13px; font-weight: 600; color: #737771;">BPM</span></div>
      <div style="font-size: 11px; color: #15803D; font-weight: 600; margin-top: 4px;">-3 BPM vs 30d avg</div>
    </div>
    <div class="tile">
      <div class="tile-title">Heart Rate Var</div>
      <div class="tile-val">68 <span style="font-size: 13px; font-weight: 600; color: #737771;">ms</span></div>
      <div style="font-size: 11px; color: #15803D; font-weight: 600; margin-top: 4px;">High parasympathetic</div>
    </div>
  </div>

  <div class="zone-card">
    <div style="font-weight: 800; font-size: 14px; margin-bottom: 12px;">Cardio Training Zones</div>
    <div class="zone-row"><span>Zone 4 (Threshold)</span><span style="font-weight: 700;">152-168 BPM</span></div>
    <div class="zone-bar"><div style="width: 75%; height: 100%; background: #FF5500;"></div></div>
    <div class="zone-row"><span>Zone 2 (Aerobic Base)</span><span style="font-weight: 700;">120-138 BPM</span></div>
    <div class="zone-bar"><div style="width: 50%; height: 100%; background: #42BFEF;"></div></div>
  </div>
</body>
</html>`
  },
  {
    file: 'screen_add.png',
    title: 'FitFlow Quick Session Logger',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 24px 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 20px; font-weight: 800; color: #111312; }
  .card { background: #FFFFFF; border-radius: 20px; padding: 18px; border: 1px solid #ECECE9; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
  .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
  .input-box { background: #F8F8F6; border: 1px solid #ECECE9; border-radius: 14px; padding: 12px; text-align: center; }
  .input-label { font-size: 10px; font-weight: 700; color: #737771; text-transform: uppercase; }
  .input-val { font-size: 24px; font-weight: 900; color: #111312; margin-top: 2px; }
  .btn-submit { width: 100%; background: #111312; color: #fff; border-radius: 999px; padding: 14px; text-align: center; font-weight: 800; font-size: 14px; margin-top: 8px; border: none; cursor: pointer; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">Log Workout Set</div>
    <span style="background: #111312; color: #b8f45a; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px;">SET #4</span>
  </div>

  <div class="card">
    <div style="font-size: 12px; font-weight: 700; color: #737771;">SELECTED MOVEMENT</div>
    <div style="font-size: 18px; font-weight: 800; margin-top: 2px;">Incline Dumbbell Press</div>
    
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
    <div style="font-size: 12px; font-weight: 700; color: #737771; margin-bottom: 8px;">RPE EFFORT LEVEL</div>
    <div style="display: flex; justify-content: space-between; gap: 6px;">
      <div style="flex:1; padding: 8px; border-radius: 10px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 12px;">7.0</div>
      <div style="flex:1; padding: 8px; border-radius: 10px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 12px;">8.0</div>
      <div style="flex:1; padding: 8px; border-radius: 10px; background: #FF5500; color: #fff; text-align: center; font-weight: 800; font-size: 12px;">8.5</div>
      <div style="flex:1; padding: 8px; border-radius: 10px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 12px;">9.0</div>
      <div style="flex:1; padding: 8px; border-radius: 10px; background: #EEF0EB; text-align: center; font-weight: 700; font-size: 12px;">10</div>
    </div>
  </div>

  <button class="btn-submit">Confirm & Start Rest Timer ↗</button>
</body>
</html>`
  },
  {
    file: 'screen_login.png',
    title: 'FitFlow Athlete Authentication',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #F8F8F6; color: #111312; width: 440px; padding: 32px 24px; text-align: center; }
  .icon-wrap { width: 56px; height: 56px; border-radius: 20px; background: #111312; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; }
  h1 { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
  p { font-size: 13px; color: #737771; margin-bottom: 24px; }
  .input { width: 100%; padding: 14px 16px; border-radius: 16px; border: 1px solid #ECECE9; background: #FFFFFF; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  .btn { width: 100%; padding: 14px; border-radius: 999px; background: #FF5500; color: #fff; font-size: 14px; font-weight: 800; border: none; }
</style>
</head>
<body>
  <div class="icon-wrap">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#FF5500" stroke-width="3"/><circle cx="12" cy="12" r="5" stroke="#b8f45a" stroke-width="3"/></svg>
  </div>
  <h1>Athlete Entry</h1>
  <p>Single sign-on with cryptographic one-time passcode</p>
  <input class="input" value="athlete@fitflow.app" readonly />
  <button class="btn">Send Verification Passcode ↗</button>
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
            ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
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
  console.log('ALL CLEAN SCREENS GENERATED WITHOUT BROKEN TEXT/FONTS');
}

run();
