(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('motion-enabled');

  const onReady = () => {
    if (!document.body) return;

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    document.body.prepend(progress);

    if (reducedMotion) {
      root.classList.add('page-entered');
      document.querySelectorAll('[data-motion-reveal]').forEach((element) => {
        element.classList.add('is-visible');
      });
      return;
    }

    const revealSelectors = [
      'main .section-head',
      'main .card',
      'main .split > *',
      'main .mini-grid > div',
      'main .link-grid > a',
      'main .callout > *',
      '.seo-footer > *',
    ];

    const revealElements = [...new Set(
      revealSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]),
    )];

    revealElements.forEach((element, index) => {
      element.dataset.motionReveal = '';
      element.style.setProperty('--reveal-order', String(index % 6));
    });

    document.querySelectorAll('.card-grid, .mini-grid, .link-grid').forEach((group) => {
      [...group.children].forEach((child, index) => {
        child.style.setProperty('--reveal-order', String(index));
      });
    });

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    });

    revealElements.forEach((element) => observer.observe(element));

    const progressBar = progress.querySelector('span');
    const heroImage = document.querySelector('.hero-image img');
    const canParallax = window.matchMedia('(min-width: 769px) and (pointer: fine)').matches;
    let frameRequested = false;

    const updateScrollMotion = () => {
      frameRequested = false;
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      progressBar.style.transform = `scaleX(${ratio})`;

      if (heroImage && canParallax) {
        const hero = heroImage.closest('.hero-static');
        const rect = hero.getBoundingClientRect();
        const viewportProgress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
        const offset = (viewportProgress - 0.5) * 34;
        heroImage.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      }
    };

    const requestScrollMotion = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateScrollMotion);
    };

    window.addEventListener('scroll', requestScrollMotion, { passive: true });
    window.addEventListener('resize', requestScrollMotion, { passive: true });
    updateScrollMotion();

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:')) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      event.preventDefault();
      root.classList.add('page-leaving');

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 360);
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.classList.add('page-entered'));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  window.addEventListener('pageshow', () => {
    root.classList.remove('page-leaving');
    window.requestAnimationFrame(() => root.classList.add('page-entered'));
  });
})();
