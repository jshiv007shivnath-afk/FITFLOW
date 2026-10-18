// FitFlow Stitch Screens Navigation Bridge
(function () {
  function sendParentMessage(screenKey) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'STITCH_NAVIGATE', screen: screenKey }, '*');
      }
    } catch (e) {
      // Ignore cross-origin error if any
    }
  }

  function initNav() {
    // 1. Navigation bar mapping
    const navItems = [
      { key: 'home', target: 'home.html', patterns: ['home', 'dashboard'] },
      { key: 'progress', target: 'progress.html', patterns: ['progress', 'stat', 'bar_chart'] },
      { key: 'rewards', target: 'rewards.html', patterns: ['reward', 'streak', 'military_tech'] },
      { key: 'profile', target: 'profile.html', patterns: ['profile', 'menu', 'account', 'person', 'grid_view'] },
    ];

    document.querySelectorAll('nav a').forEach((link) => {
      const label = (
        link.getAttribute('aria-label') ||
        link.getAttribute('data-path') ||
        link.textContent ||
        ''
      ).toLowerCase();

      for (const item of navItems) {
        if (item.patterns.some((p) => label.includes(p))) {
          link.setAttribute('href', item.target);
          link.onclick = (e) => {
            e.preventDefault();
            sendParentMessage(item.key);
            window.location.href = item.target;
          };
          break;
        }
      }
    });

    // 2. Header profile button / avatar
    document.querySelectorAll('header button, header a').forEach((btn) => {
      const img = btn.querySelector('img[alt*="Profile" i]');
      const icon = btn.querySelector('.material-symbols-outlined');
      const isProfile = img || (icon && icon.textContent.includes('person'));
      if (isProfile) {
        btn.onclick = (e) => {
          e.preventDefault();
          sendParentMessage('profile');
          window.location.href = 'profile.html';
        };
      }
    });

    // 3. Back buttons & Close buttons
    document.querySelectorAll('button').forEach((btn) => {
      const icon = btn.querySelector('.material-symbols-outlined');
      const label = (btn.getAttribute('aria-label') || '').toLowerCase();
      const isBack =
        (icon && (icon.textContent.includes('arrow_back') || icon.textContent.includes('chevron_left'))) ||
        label.includes('back');
      const isClose = (icon && icon.textContent.includes('close')) || label.includes('close');

      if (isBack || isClose) {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          sendParentMessage('home');
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = 'home.html';
          }
        };
      }
    });

    // 4. Onboarding specific actions
    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        sendParentMessage('home');
        window.location.href = 'home.html';
      });
    }

    const skipBtns = document.querySelectorAll('button');
    skipBtns.forEach((btn) => {
      if (btn.textContent.trim().toLowerCase() === 'skip') {
        btn.addEventListener('click', () => {
          sendParentMessage('home');
          window.location.href = 'home.html';
        });
      }
    });

    // 5. Login form redirect
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', () => {
        setTimeout(() => {
          sendParentMessage('home');
          window.location.href = 'home.html';
        }, 1200);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
