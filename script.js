// Portfolio Website JavaScript

class PortfolioApp {
    constructor() {
        this.currentTestimonial = 0;
        this.testimonials = document.querySelectorAll('.testimonial-slide');
        this.typingText = document.getElementById('typing-text');
        this.roles = ['Web Developer', 'Software Engineer', 'Frontend Specialist'];
        this.roleIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTypingAnimation();
        this.setupScrollAnimations();
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupProjectFilters();
        this.setupProjectCardClicks();
        this.setupTestimonialsCarousel();
        this.setupContactForm();
        this.updateActiveNavLink();
    }

    setupEventListeners() {
        // Scroll event for navbar and animations
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });

        // Resize event
        window.addEventListener('resize', () => {
            this.closeMobileMenu();
        });
    }

    // Make project cards clickable
    setupProjectCardClicks() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent double navigation if clicking a link inside the card
                if (e.target.closest('a')) return;
                const liveDemo = card.querySelector('.project-link[href*="http"]');
                const github = card.querySelector('.project-link[href*="github"]');
                if (liveDemo) {
                    window.open(liveDemo.href, '_blank');
                } else if (github) {
                    window.open(github.href, '_blank');
                }
            });
        });
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');

        // Determine initial theme
        let savedTheme = localStorage.getItem('theme');
        let initialTheme = savedTheme || document.documentElement.getAttribute('data-color-scheme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-color-scheme', initialTheme);

        // Icon management
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(initialTheme === 'dark' ? 'fa-sun' : 'fa-moon');
        }

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (icon) {
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
            }
        });
    }

    // Typing Animation
    startTypingAnimation() {
        if (!this.typingText) return;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenRoles = 2000;

        const type = () => {
            const currentRole = this.roles[this.roleIndex];

            if (this.isDeleting) {
                this.typingText.textContent = currentRole.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                this.typingText.textContent = currentRole.substring(0, this.charIndex + 1);
                this.charIndex++;
            }

            let nextDelay = this.isDeleting ? deleteSpeed : typeSpeed;

            if (!this.isDeleting && this.charIndex === currentRole.length) {
                nextDelay = delayBetweenRoles;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.roleIndex = (this.roleIndex + 1) % this.roles.length;
            }

            setTimeout(type, nextDelay);
        };

        type();
    }

    // Navigation Functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetId === '#projects') {
                        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
                        if (allFilterBtn) allFilterBtn.click();
                    }
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    this.closeMobileMenu();
                }
            });
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll(
            '.timeline-item, .education-card, .project-card, .service-card, .skill-item'
        );

        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-sm)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupTestimonialsCarousel() {
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        const dots = document.querySelectorAll('.dot');

        if (prevBtn) prevBtn.addEventListener('click', () => this.showPreviousTestimonial());
        if (nextBtn) nextBtn.addEventListener('click', () => this.showNextTestimonial());

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showTestimonial(index));
        });

        this.startCarouselAutoPlay();
    }

    showTestimonial(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        if (slides[this.currentTestimonial]) slides[this.currentTestimonial].classList.remove('active');
        if (dots[this.currentTestimonial]) dots[this.currentTestimonial].classList.remove('active');

        this.currentTestimonial = index;

        if (slides[this.currentTestimonial]) slides[this.currentTestimonial].classList.add('active');
        if (dots[this.currentTestimonial]) dots[this.currentTestimonial].classList.add('active');
    }

    showNextTestimonial() {
        if (this.testimonials.length === 0) return;
        const nextIndex = (this.currentTestimonial + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex);
    }

    showPreviousTestimonial() {
        if (this.testimonials.length === 0) return;
        const prevIndex = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
        this.showTestimonial(prevIndex);
    }

    startCarouselAutoPlay() {
        setInterval(() => this.showNextTestimonial(), 5000);
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form, formStatus);
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;
        let errorMessage = '';

        if (fieldName === 'name') {
            if (!fieldValue) { errorMessage = 'Name is required'; isValid = false; }
            else if (fieldValue.length < 2) { errorMessage = 'Name must be at least 2 characters'; isValid = false; }
        } else if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!fieldValue) { errorMessage = 'Email is required'; isValid = false; }
            else if (!emailRegex.test(fieldValue)) { errorMessage = 'Please enter a valid email'; isValid = false; }
        } else if (fieldName === 'subject') {
            if (!fieldValue) { errorMessage = 'Subject is required'; isValid = false; }
        } else if (fieldName === 'message') {
            if (fieldValue.length < 10) { errorMessage = 'Message must be at least 10 characters'; isValid = false; }
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorMessage ? errorElement.classList.add('show') : errorElement.classList.remove('show');
        }
        isValid ? field.classList.remove('error') : field.classList.add('error');
        return isValid;
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement && field.value.trim()) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }

    handleFormSubmission(form, statusElement) {
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;
        inputs.forEach(input => { if (!this.validateField(input)) isFormValid = false; });

        if (!isFormValid) {
            this.showFormStatus(statusElement, 'Please fix errors.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.reset();
            this.showFormStatus(statusElement, 'Message sent successfully!', 'success');
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 2000);
    }

    showFormStatus(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `form-status ${type} show`;
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();

    // Hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        const testimonialSection = document.querySelector('#testimonials');
        if (!testimonialSection) return;
        const rect = testimonialSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (e.key === 'ArrowLeft') window.portfolioApp.showPreviousTestimonial();
            if (e.key === 'ArrowRight') window.portfolioApp.showNextTestimonial();
        }
    });
});
