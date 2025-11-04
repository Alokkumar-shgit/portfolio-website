// Portfolio Website JavaScript

class PortfolioApp {
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

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');

        // Determine initial theme: saved preference -> data attribute -> system preference -> default 'light'
        let savedTheme = localStorage.getItem('theme');
        let initialTheme = savedTheme || document.documentElement.getAttribute('data-color-scheme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (!initialTheme) initialTheme = 'light';
        document.documentElement.setAttribute('data-color-scheme', initialTheme);

        // Icon: show sun when currently dark (meaning clicking will switch to light), moon when currently light
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(initialTheme === 'dark' ? 'fa-sun' : 'fa-moon');

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
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
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                // If Projects button is clicked, activate 'All' filter
                if (targetId === '#projects') {
                    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
                    if (allFilterBtn) {
                        allFilterBtn.click();
                    }
                }
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                this.closeMobileMenu();
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

    // Mobile Menu
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

    // Scroll Animations
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

        // Add scroll-animate class to elements that should animate
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

    // Project Filtering
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        card.style.display = 'block';
                        // Add fade in animation
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

    // Testimonials Carousel
    setupTestimonialsCarousel() {
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        const dots = document.querySelectorAll('.dot');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                this.showPreviousTestimonial();
            });

            nextBtn.addEventListener('click', () => {
                this.showNextTestimonial();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showTestimonial(index);
            });
        });

        // Auto-play carousel
        this.startCarouselAutoPlay();
    }

    showTestimonial(index) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        // Hide current slide
        if (slides[this.currentTestimonial]) {
            slides[this.currentTestimonial].classList.remove('active');
        }
        if (dots[this.currentTestimonial]) {
            dots[this.currentTestimonial].classList.remove('active');
        }

        // Show new slide
        this.currentTestimonial = index;
        if (slides[this.currentTestimonial]) {
            slides[this.currentTestimonial].classList.add('active');
        }
        if (dots[this.currentTestimonial]) {
            dots[this.currentTestimonial].classList.add('active');
        }
    }

    showNextTestimonial() {
        const nextIndex = (this.currentTestimonial + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex);
    }

    showPreviousTestimonial() {
        const prevIndex = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
        this.showTestimonial(prevIndex);
    }

    startCarouselAutoPlay() {
        setInterval(() => {
            this.showNextTestimonial();
        }, 5000); // Change slide every 5 seconds
    }

    // Contact Form Validation and Submission
    setupContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Form submission
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

        switch (fieldName) {
            case 'name':
                if (!fieldValue) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (fieldValue.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!fieldValue) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(fieldValue)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'subject':
                if (!fieldValue) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (fieldValue.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;

            case 'message':
                if (!fieldValue) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (fieldValue.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            if (errorMessage) {
                errorElement.classList.add('show');
            } else {
                errorElement.classList.remove('show');
            }
        }

        // Add/remove error styling
        if (isValid) {
            field.classList.remove('error');
        } else {
            field.classList.add('error');
        }

        return isValid;
    }

    clearFieldError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement && field.value.trim()) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }

    handleFormSubmission(form, statusElement) {
        const inputs = form.querySelectorAll('input, textarea');
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormStatus(statusElement, 'Please fix the errors above before submitting.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Clear all error messages
            const errorElements = form.querySelectorAll('.error-message');
            errorElements.forEach(error => {
                error.classList.remove('show');
                error.textContent = '';
            });
            
            // Remove error styling from inputs
            inputs.forEach(input => {
                input.classList.remove('error');
            });
            
            // Show success message
            this.showFormStatus(statusElement, 'Thank you! Your message has been sent successfully.', 'success');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                statusElement.classList.remove('show', 'success', 'error');
                statusElement.textContent = '';
            }, 5000);
        }, 2000);
    }

    showFormStatus(element, message, type) {
        element.textContent = message;
        element.className = `form-status ${type} show`;
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation to buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') && !e.target.disabled) {
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.style.transform.includes('translateY')) {
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.style.transform.includes('translateY(-5px)')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
});

// Performance optimization: Lazy load animations
const observeElements = () => {
    const elements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
};

// Initialize observers after DOM load
document.addEventListener('DOMContentLoaded', observeElements);

// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    const app = window.portfolioApp;
    if (app && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const testimonialSection = document.querySelector('#testimonials');
        const rect = testimonialSection.getBoundingClientRect();
        
        // Only handle arrow keys when testimonials section is visible
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') {
                app.showPreviousTestimonial();
            } else if (e.key === 'ArrowRight') {
                app.showNextTestimonial();
            }
        }
    }
});

// Store app instance globally for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});
