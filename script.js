// Google Ads Global Site Tag
(function () {
    var script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-16710459015";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'AW-16710459015');
})();

document.addEventListener('DOMContentLoaded', () => {
    // Top Info Bar Injection (Desktop)
    // Top Info Bar Injection (All Devices)
    const topBar = document.createElement('div');
    topBar.className = 'top-info-bar';
    topBar.innerHTML = `
        <div class="social-icons-top">
            <a href="https://www.facebook.com/luxvipchartersperth" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/lux.vip.charters.perth/" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
        </div>
        <div class="contact-info-top">
            <a href="tel:+61406454436"><i class="fas fa-phone-alt"></i> +61 406 454 436</a>
            <a href="mailto:luxchartersperth@outlook.com"><i class="fas fa-envelope"></i> luxchartersperth@outlook.com</a>
            <span class="timing"><i class="fas fa-clock"></i> Mon - Sun: 24 Hours</span>
        </div>
    `;
    document.body.prepend(topBar);
    document.body.classList.add('has-top-bar');

    // Dynamic Header Adjustment for Mobile Top Bar wrapping
    function adjustHeaderTop() {
        const height = topBar.offsetHeight;
        document.documentElement.style.setProperty('--top-bar-height', `${height}px`);
    }

    // Run initially and on resize
    adjustHeaderTop();
    window.addEventListener('resize', adjustHeaderTop);

    // Google Ads Call Tracking
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="tel:"]');
        if (link) {
            gtag('event', 'call_click', {
                'event_category': 'Contact',
                'event_label': link.getAttribute('href')
            });
        }
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const dropdown = document.querySelector('.dropdown');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Close mobile menu when a link is clicked
    // BUT: don't close when clicking the main "Services" dropdown link on mobile
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 768;
            const parent = link.parentElement;
            const isDropdownMainLink = parent && parent.classList.contains('dropdown');

            if (isMobile && isDropdownMainLink) {
                // This is the "Services" main link on mobile → let dropdown toggle handle it
                return;
            }

            // All other nav links behave normally: close menu
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    // Mobile Dropdown Toggle
    if (dropdown) {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Only prevent default if clicking the main link, not sub-links
                if (e.target.closest('.dropdown > .nav-link')) {
                    e.preventDefault();
                    e.stopPropagation(); // stop bubbling into other handlers
                    dropdown.classList.toggle('active');
                }
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== "#") {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Fade Up Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document
        .querySelectorAll('.service-card, .fleet-item, .section-header, .hero-content, .contact-wrapper')
        .forEach(el => {
            el.classList.add('fade-up');
            observer.observe(el);
        });

    // Audio Control Logic
    const video = document.querySelector('.hero-video');
    const audioBtn = document.getElementById('audio-control');
    const icon = audioBtn?.querySelector('i');

    if (video && audioBtn && icon) {
        // Toggle function
        function toggleAudio() {
            if (video.muted) {
                video.muted = false;
                icon.className = 'fas fa-volume-up';
            } else {
                video.muted = true;
                icon.className = 'fas fa-volume-mute';
            }
        }

        // Button click
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from triggering immediately after
            toggleAudio();
        });

        // Smart Autoplay: Ensure video plays (muted by default to satisfy browser policies)
        const ensurePlay = async () => {
            // Always start muted for best autoplay success rate
            video.muted = true;
            try {
                await video.play();
                icon.className = 'fas fa-volume-mute';
            } catch (err) {
                console.log('Autoplay failed:', err);
            }
        };

        // Try immediately
        ensurePlay();

        // Also unmute on first interaction with the document
        const unmuteOnInteract = () => {
            if (video.muted) {
                video.muted = false;
                icon.className = 'fas fa-volume-up';
            }
            document.removeEventListener('click', unmuteOnInteract);
            document.removeEventListener('scroll', unmuteOnInteract);
            document.removeEventListener('keydown', unmuteOnInteract);
        };

        document.addEventListener('click', unmuteOnInteract);
        document.addEventListener('scroll', unmuteOnInteract);
        document.addEventListener('keydown', unmuteOnInteract);
    }
    // Floating Call Button (Desktop Only)
    // Injected dynamically to avoid editing all HTML files
    // Floating Call Button (All Devices - Bottom Right)
    // Injected dynamically to avoid editing all HTML files
    const callBtn = document.createElement('a');
    callBtn.href = 'tel:+61406454436';
    callBtn.className = 'floating-call-btn';
    callBtn.innerHTML = '<i class="fas fa-phone-alt"></i>';
    callBtn.title = 'Call Now';
    document.body.appendChild(callBtn);

    // Floating Booking Button (All Devices - Bottom Left)
    const bookBtn = document.createElement('a');
    bookBtn.href = '/booking/';
    bookBtn.className = 'floating-book-btn';
    bookBtn.innerHTML = '<i class="far fa-calendar-alt"></i>'; // Changed to outline style for cleaner look, or fas for solid
    bookBtn.title = 'Book Now';
    document.body.appendChild(bookBtn);
});
