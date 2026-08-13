// ============================================================
// DRCHEAT - GLOBAL JAVASCRIPT
// Safe to use across all website pages.
// ============================================================


// ============================================================
// NAVBAR
// ============================================================

const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle(
            'scrolled',
            window.scrollY > 40
        );
    }, { passive: true });
}


// ============================================================
// MOBILE NAVIGATION
// ============================================================

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {

    navToggle.addEventListener('click', () => {

        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');

    });

    navLinks.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            navToggle.classList.remove('active');
            navLinks.classList.remove('open');

        });

    });

}


// ============================================================
// FEATURE TABS
// Only exists on the homepage.
// ============================================================

const tabs = document.querySelectorAll('.feature-tab');
const panels = document.querySelectorAll('.feature-panel');

if (tabs.length > 0 && panels.length > 0) {

    tabs.forEach(tab => {

        tab.addEventListener('click', () => {

            const target = tab.dataset.tab;

            tabs.forEach(item => {
                item.classList.remove('active');
            });

            tab.classList.add('active');

            panels.forEach(panel => {

                panel.classList.remove('active');

                if (panel.dataset.panel === target) {
                    panel.classList.add('active');
                }

            });

        });

    });

}


// ============================================================
// PRICING TOGGLE
// Only exists on the homepage.
// ============================================================

const pricingToggle = document.getElementById('pricingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const annualLabel = document.getElementById('annualLabel');
const priceValues = document.querySelectorAll('.pricing-value');
const pricePeriods = document.querySelectorAll(
    '.pricing-period[data-annual-total]'
);

let isAnnual = false;

if (pricingToggle) {

    pricingToggle.addEventListener('click', () => {

        isAnnual = !isAnnual;

        pricingToggle.classList.toggle(
            'annual',
            isAnnual
        );

        if (monthlyLabel) {
            monthlyLabel.classList.toggle(
                'active',
                !isAnnual
            );
        }

        if (annualLabel) {
            annualLabel.classList.toggle(
                'active',
                isAnnual
            );
        }

        priceValues.forEach(el => {

            const newValue =
                el.dataset[isAnnual ? 'annual' : 'monthly'];

            if (!newValue || newValue === 'FREE') {
                return;
            }

            el.classList.add('changing');

            setTimeout(() => {

                el.textContent = newValue;
                el.classList.remove('changing');

            }, 180);

        });

        pricePeriods.forEach(el => {

            if (isAnnual) {

                const total = el.dataset.annualTotal;

                el.innerHTML =
                    'per month ' +
                    '<span class="period-yearly">' +
                    '($' +
                    total +
                    ' per year)' +
                    '</span>';

            } else {

                el.innerHTML = el.dataset.monthly;

            }

        });

    });

}


// ============================================================
// COUNTER ANIMATION
// Only affects elements that actually exist.
// ============================================================

function animateCounter(el) {

    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(
        el.dataset.decimal || '0',
        10
    );

    const useComma =
        el.dataset.comma === 'true';

    const duration = 1800;
    const start = performance.now();

    function tick(now) {

        const progress = Math.min(
            (now - start) / duration,
            1
        );

        const eased =
            1 - Math.pow(1 - progress, 3);

        let value = eased * target;

        value =
            decimals > 0
                ? value.toFixed(decimals)
                : Math.round(value);

        if (useComma) {
            value = Number(value).toLocaleString();
        }

        el.textContent =
            prefix +
            value +
            suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }

    }

    requestAnimationFrame(tick);

}


// ============================================================
// SCROLL REVEAL
// Safe across every page.
// ============================================================

const prefersReducedMotion =
    window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

const fadeElements =
    document.querySelectorAll('.fade-up');

if (!prefersReducedMotion) {

    if (fadeElements.length > 0) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const siblings =
                            entry.target.parentElement
                                ?.querySelectorAll(
                                    '.fade-up:not(.visible)'
                                ) || [];

                        const index =
                            Array.from(siblings)
                                .indexOf(entry.target);

                        setTimeout(() => {

                            entry.target
                                .classList
                                .add('visible');

                        }, Math.max(0, index) * 100);

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.15,
                    rootMargin:
                        '0px 0px -30px 0px'
                }
            );

        fadeElements.forEach(el => {
            observer.observe(el);
        });

    }


    // ========================================================
    // STAT COUNTERS
    // ========================================================

    const counterElements =
        document.querySelectorAll(
            '.stat-number[data-target]'
        );

    if (counterElements.length > 0) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        animateCounter(
                            entry.target
                        );

                        counterObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );

        counterElements.forEach(el => {
            counterObserver.observe(el);
        });

    }

} else {

    // Reduced motion:
    // Immediately show all animated content.

    fadeElements.forEach(el => {
        el.classList.add('visible');
    });

    const counterElements =
        document.querySelectorAll(
            '.stat-number[data-target]'
        );

    counterElements.forEach(el => {

        const target =
            parseFloat(el.dataset.target);

        const suffix =
            el.dataset.suffix || '';

        const prefix =
            el.dataset.prefix || '';

        const decimals =
            parseInt(
                el.dataset.decimal || '0',
                10
            );

        let value =
            decimals > 0
                ? target.toFixed(decimals)
                : target;

        if (el.dataset.comma === 'true') {
            value =
                Number(value).toLocaleString();
        }

        el.textContent =
            prefix +
            value +
            suffix;

    });

}


// ============================================================
// FOOTER YEAR
// Only exists on pages containing #currentYear.
// ============================================================

const currentYearElement =
    document.getElementById('currentYear');

if (currentYearElement) {

    const startYear = 2024;
    const currentYear =
        new Date().getFullYear();

    currentYearElement.textContent =
        startYear === currentYear
            ? currentYear
            : `${startYear}–${currentYear}`;

}