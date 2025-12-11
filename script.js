document.addEventListener('DOMContentLoaded', () => {
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

        // Smart Autoplay: Try to play with sound
        const tryUnmute = async () => {
            video.muted = false;
            try {
                await video.play();
                icon.className = 'fas fa-volume-up';
            } catch (err) {
                console.log('Autoplay with sound failed, fallback to muted');
                video.muted = true;
                icon.className = 'fas fa-volume-mute';
                // Ensure it's playing
                video.play();
            }
        };

        // Try immediately
        tryUnmute();

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
});
