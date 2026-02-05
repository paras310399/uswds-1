/* =========================================================
   Custom JS (USWDS-light friendly)
   - Accessible mobile nav
   - Mega-menu toggle for mobile + keyboard
   - Swiper init moved here (no inline scripts)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.getElementById('navToggle');
    var siteNav = document.getElementById('siteNav');
    var navClose = document.getElementById('navClose');

    // Sticky header shadow on scroll
    var header = document.querySelector('.site-header');
    function onScrollHeader() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 6);
    }
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    // Mobile nav open/close
    function closeNav() {
        if (!siteNav || !navToggle) return;
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
    }
    function openNav() {
        if (!siteNav || !navToggle) return;
        siteNav.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        siteNav.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-open');
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = siteNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            siteNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    if (navClose) {
        navClose.addEventListener('click', function () {
            closeNav();
        });
    }

    // Close nav on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeNav();
            // close mega menus too
            document.querySelectorAll('.nav-dropdown.open').forEach(function (el) {
                el.classList.remove('open');
                var toggle = el.querySelector('.nav-dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                var menu = el.querySelector('.mega-menu');
                if (menu) menu.setAttribute('aria-hidden', 'true');
            });
        }
    });

    // Close nav when resizing to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 991) {
            closeNav();
        }
    });

    // AOS
    if (window.AOS) {
        AOS.init({ duration: 800, once: true, offset: 80 });
    }

    // Mega-menu mobile toggles + keyboard support
    var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(function (btn) {

        // Click = toggle only on mobile drawer
        btn.addEventListener('click', function () {
            if (window.innerWidth <= 991) {
                var li = btn.closest('.nav-dropdown');
                if (!li) return;

                var isOpen = li.classList.toggle('open');
                btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

                var menu = li.querySelector('.mega-menu');
                if (menu) menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            }
        });

        // Keyboard: open on Enter/Space (desktop + mobile)
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });

        // Desktop: open on focus for accessibility
        btn.addEventListener('focus', function () {
            if (window.innerWidth > 991) {
                var li = btn.closest('.nav-dropdown');
                if (!li) return;
                li.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                var menu = li.querySelector('.mega-menu');
                if (menu) menu.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // Close open mega menus when clicking outside (desktop)
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 991) return;
        var isDropdown = e.target.closest('.nav-dropdown');
        if (!isDropdown) {
            document.querySelectorAll('.nav-dropdown.open').forEach(function (el) {
                el.classList.remove('open');
                var toggle = el.querySelector('.nav-dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                var menu = el.querySelector('.mega-menu');
                if (menu) menu.setAttribute('aria-hidden', 'true');
            });
        }
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href.length <= 1) return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeNav();
            }
        });
    });

    // Swiper: Hero
    if (window.Swiper) {
        new Swiper(".heroSwiper", {
            loop: true,
            autoplay: { delay: 4500, disableOnInteraction: false },
            effect: "fade",
            fadeEffect: { crossFade: true },
            speed: 900,
            on: {
                slideChangeTransitionStart: function () {
                    if (window.AOS) AOS.refresh();
                }
            }
        });

        // Swiper: Industries
        new Swiper(".industries-swiper", {
            slidesPerView: 4,
            spaceBetween: 24,
            autoplay: true,
            loop: true,
            speed: 700,
            navigation: {
                nextEl: ".industries-section .swiper-button-next",
                prevEl: ".industries-section .swiper-button-prev"
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 4 }
            }
        });
    }
});

// hide loader once all resources are loaded
window.addEventListener('load', function () {
    var loader = document.getElementById('siteLoader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(function () {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 450);
});

// Categories panel open/close
(function () {
    var openBtn = document.getElementById('openCategories');
    var closeBtn = document.getElementById('closeCategories');
    var panel = document.getElementById('categoriesPanel');
    if (!panel) return;

    function openPanel() {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); closePanel(); });

    panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });

    panel.querySelectorAll('.category-item').forEach(function (item) {
        item.addEventListener('click', function () {
            panel.querySelectorAll('.category-item').forEach(function (i) { i.classList.remove('active'); });
            item.classList.add('active');
        });
    });
})();
