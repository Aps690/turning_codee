document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Greeting
    const updateGreeting = () => {
        const greetingElement = document.getElementById('dynamic-greeting');
        if (!greetingElement) return;

        const hour = new Date().getHours();
        let greeting = 'Selamat pagi';
        let icon = '🌅';

        if (hour >= 12 && hour < 15) {
            greeting = 'Selamat siang';
            icon = '☀️';
        } else if (hour >= 15 && hour < 18) {
            greeting = 'Selamat sore';
            icon = '🌇';
        } else if (hour >= 18 || hour < 4) {
            greeting = 'Selamat malam';
            icon = '🌙';
        }

        // Preserve the username span
        const usernameSpan = greetingElement.querySelector('.text-gradient');
        const username = usernameSpan ? usernameSpan.outerHTML : '<span class="text-gradient">Andika P.S</span>';

        greetingElement.innerHTML = `${greeting}, ${username}! ${icon}`;
    };

    updateGreeting();

    // 2. Animate SVG Progress Rings
    const animateProgressRings = () => {
        const rings = document.querySelectorAll('.progress-ring');
        rings.forEach(ring => {
            const perc = ring.getAttribute('data-perc');
            const circle = ring.querySelector('.fill-ring');
            if (circle && perc) {
                // Circumference is approx 163.36 (2 * pi * 26)
                // We want to offset by the remaining percentage
                const offset = 163.36 - (163.36 * (perc / 100));

                // Reset first for animation effect
                circle.style.strokeDashoffset = '163.36';

                // Trigger reflow to ensure the transition plays when changing the value
                void circle.offsetWidth;

                // Set to target
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 100); // slight delay makes it feel dynamic on load
            }
        });
    };

    // 3. Simple Tooltip Handling
    const initTooltips = () => {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const tooltipText = el.getAttribute('data-tooltip');
                if (!tooltipText) return;

                const tooltipDiv = document.createElement('div');
                tooltipDiv.className = 'custom-tooltip';
                tooltipDiv.innerText = tooltipText;
                document.body.appendChild(tooltipDiv);

                const rect = el.getBoundingClientRect();

                // Position above the element
                tooltipDiv.style.left = `${rect.left + (rect.width / 2) - (tooltipDiv.offsetWidth / 2)}px`;
                tooltipDiv.style.top = `${rect.top - tooltipDiv.offsetHeight - 10}px`;
                tooltipDiv.style.opacity = '1';

                // Attach to element so we can remove it
                el._tooltipNode = tooltipDiv;
            });

            el.addEventListener('mouseleave', () => {
                if (el._tooltipNode) {
                    el._tooltipNode.remove();
                    el._tooltipNode = null;
                }
            });
        });
    };

    initTooltips();

    /* ---------- NAVIGATION ACTIVE STATE ---------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page, .section'); // Handle both pages and sections

    // Function to set active link based on scroll position or current page
    function setActiveLink() {
        let current = '';

        // Find which section/page is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) || link.dataset.page === current) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events to update active link
    window.addEventListener('scroll', setActiveLink);
    // Initial call to set active link on load
    setActiveLink();


    /* ---------- SMOOTH SCROLL FOR IN-PAGE ANCHORS ---------- */
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal anchor links
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Close mobile menu if it's open
                    if (navMenu && navMenu.classList.contains('open')) {
                        navMenu.classList.remove('open');
                        hamburger.classList.remove('active');
                    }

                    // Add active class to new link
                    navLinks.forEach(navLink => navLink.classList.remove('active')); // Remove from all
                    link.classList.add('active'); // Add to clicked link

                    // Remove active path if needed (assuming activePath is defined elsewhere or this is new logic)
                    // This part of the snippet seems to be missing context for 'activePath'
                    // and 'targetPageId'. Assuming 'targetPageId' is 'targetId' here.
                    const activePath = document.querySelector('.active-path'); // Assuming this element exists
                    const targetPageId = targetId; // Using targetId from the href

                    if (activePath) {
                        const targetPage = document.getElementById(targetPageId);
                        const isSection = targetPage && targetPage.classList.contains('section');

                        // If the target is a page (like dashboard or auth), hide the active path
                        if (!isSection) {
                            activePath.style.display = 'none';
                        } else {
                            activePath.style.display = ''; // Ensure it's visible for sections
                        }
                    }

                    // If navigating to dashboard, trigger animations
                    if (targetPageId === 'dashboard' && typeof animateProgressRings === 'function') {
                        // Small delay to allow CSS reveal to happen
                        setTimeout(animateProgressRings, 300);
                    }

                    // Scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjust for navbar height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    /* ---------- MOBILE MENU TOGGLE ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }

    /* ---------- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---------- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before the element fully enters viewport
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Add logic to trigger initial reveal on load for elements already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('visible');
            }
        });
    }, 100);

});
