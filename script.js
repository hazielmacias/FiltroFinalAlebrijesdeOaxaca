/* ============================================
   FILTRO FINAL - Landing Page JavaScript
   Professional Football Scouting Event
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initCopyToClipboard();
    initBackToTop();
    initAnimations();
});

/* ============================================
   NAVIGATION FUNCTIONALITY
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add scrolled class to navbar on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================
   SMOOTH SCROLL FUNCTIONALITY
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   SCROLL EFFECTS & ANIMATIONS
   ============================================ */
function initScrollEffects() {
    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();
}

/* ============================================
   COPY TO CLIPBOARD FUNCTIONALITY
   ============================================ */
function initCopyToClipboard() {
    // Make copyToClipboard available globally
    window.copyToClipboard = function (text, element) {
        // Remove spaces from the text for clean copying
        const cleanText = text.replace(/\s/g, '');

        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(cleanText).then(() => {
                showCopyFeedback(element);
            }).catch(err => {
                fallbackCopy(cleanText, element);
            });
        } else {
            fallbackCopy(cleanText, element);
        }
    };
}

function fallbackCopy(text, element) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopyFeedback(element);
    } catch (err) {
        console.error('Error copying text: ', err);
    }

    document.body.removeChild(textArea);
}

function showCopyFeedback(element) {
    // Add copied class for visual feedback
    element.classList.add('copied');

    // Change button icon temporarily
    const copyBtn = element.querySelector('.copy-btn');
    if (copyBtn) {
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            element.classList.remove('copied');
        }, 2000);
    }

    // Show toast notification
    showToast('¡Copiado al portapapeles!');
}

function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    // Show toast
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Hide toast after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // Apply staggered delays for grid items
                    const delay = entry.target.getAttribute('data-aos-delay');
                    if (delay) {
                        entry.target.style.animationDelay = `${delay}ms`;
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-init');
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers - just show all elements
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('animated');
        });
    }
}

// Add CSS for animations dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* AOS Animation Styles */
    [data-aos].aos-init {
        opacity: 0;
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    [data-aos="fade-up"].aos-init {
        transform: translateY(30px);
    }
    
    [data-aos="fade-down"].aos-init {
        transform: translateY(-30px);
    }
    
    [data-aos="fade-right"].aos-init {
        transform: translateX(-30px);
    }
    
    [data-aos="fade-left"].aos-init {
        transform: translateX(30px);
    }
    
    [data-aos="zoom-in"].aos-init {
        transform: scale(0.9);
    }
    
    [data-aos].animated {
        opacity: 1;
        transform: translateY(0) translateX(0) scale(1);
    }
    
    /* Active nav link style */
    .nav-link.active {
        color: var(--primary-orange-light);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(animationStyles);

/* ============================================
   PARTICLE EFFECT (Optional Enhancement)
   ============================================ */
function createParticles() {
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// Add floating animation for particles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles after DOM is loaded
document.addEventListener('DOMContentLoaded', createParticles);
