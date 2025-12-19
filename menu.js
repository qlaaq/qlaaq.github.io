// menu.js — лёгкий, доступный контроллер бургер-меню.
// Ждёт появления элементов (если a.js трансформирует шаблон) и инициализирует управление.

(function () {
  'use strict';

  // Ищем элементы; если их нет — ставим наблюдатель инициализаию
  function findElements() {
    const burger = document.querySelector('.burger');
    const panel = document.getElementById('nav-panel');
    const overlay = document.querySelector('.nav-overlay');
    return { burger, panel, overlay };
  }

  function setup(burger, panel, overlay) {
    if (!burger || !panel || !overlay) return;
    // Toggle
    function open() {
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      overlay.classList.add('visible');
      overlay.dataset.hidden = 'false';
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('visible');
      overlay.dataset.hidden = 'true';
      document.documentElement.style.overflow = '';
    }
    function toggle() {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      if (expanded) close(); else open();
    }

    burger.addEventListener('click', function (ev) {
      ev.stopPropagation();
      toggle();
    });

    overlay.addEventListener('click', function () {
      close();
    });

    // Закрыть при клике по ссылке внутри панели
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    // Клавиша Escape — закрыть меню
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        if (expanded) close();
      }
    });

    // Клик вне панели — закрыть (для безопасности)
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !burger.contains(e.target)) {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        if (expanded) close();
      }
    });
  }

  // Попытаться инициализировать прямо сейчас; если не удалось — наблюдатель
  function init() {
    const { burger, panel, overlay } = findElements();
    if (burger && panel && overlay) {
      setup(burger, panel, overlay);
      return;
    }

    const observer = new MutationObserver(function (mutations, obs) {
      const { burger, panel, overlay } = findElements();
      if (burger && panel && overlay) {
        setup(burger, panel, overlay);
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
