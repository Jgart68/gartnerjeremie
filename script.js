// ============================================================
// PORTFOLIO V2 - JÉRÉMIE GARTNER
// Interactions JavaScript
// ============================================================

// ── THEME TOGGLE (Mode Sombre) ──────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;
const themeIcon = document.querySelector('.theme-icon');
const themeIconMobile = themeToggleMobile?.querySelector('.material-symbols-outlined');

// Récupérer le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', savedTheme === 'dark');
updateThemeIcon(savedTheme);

// Toggle theme (desktop)
themeToggle?.addEventListener('click', () => {
    toggleTheme();
});

// Toggle theme (mobile)
themeToggleMobile?.addEventListener('click', () => {
    toggleTheme();
});

function toggleTheme() {
    const isDark = html.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const iconName = theme === 'dark' ? 'light_mode' : 'dark_mode';
    if (themeIcon) {
        themeIcon.textContent = iconName;
    }
    if (themeIconMobile) {
        themeIconMobile.textContent = iconName;
    }
}

// ── NAVIGATION ACTIVE ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

// Fonction pour mettre à jour les liens actifs
function setActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Desktop nav
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
            
            // Mobile nav
            mobileNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === sectionId) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Écouter le scroll
window.addEventListener('scroll', setActiveLink);

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', setActiveLink);

// ── SMOOTH SCROLL ───────────────────────────────────────────
// Déjà géré par CSS (scroll-behavior: smooth)
// Mais on peut améliorer pour mobile avec offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offset = window.innerWidth <= 768 ? 0 : 80;
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ── NAVBAR RESET ON RESIZE ──────────────────────────────────
// Fix pour le bug de resize entre mobile et desktop
let previousWidth = window.innerWidth;

window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    
    // Détecter changement de breakpoint (768px)
    if ((previousWidth <= 768 && currentWidth > 768) || 
        (previousWidth > 768 && currentWidth <= 768)) {
        // Nettoyer les styles inline
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.style.transform = '';
        }
        
        // Réinitialiser accordions sur desktop
        if (currentWidth > 768) {
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.style.maxHeight = '';
            });
        }
    }
    
    previousWidth = currentWidth;
});

// ── ACCORDIONS ───────────────────────────────────────────────
function initAccordions() {
    // Uniquement sur mobile
    if (window.innerWidth > 768) return;
    
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        // Supprimer les anciens listeners pour éviter les doublons
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
    });
    
    // Réattacher les listeners sur les nouveaux headers
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon, .accordion-icon-approche');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const accordionGroup = this.closest('.accordion-item').getAttribute('data-accordion');
            
            // Fermer tous les autres accordions du même groupe
            if (!isExpanded) {
                document.querySelectorAll(`[data-accordion="${accordionGroup}"] .accordion-header`).forEach(otherHeader => {
                    if (otherHeader !== this) {
                        const otherContent = otherHeader.nextElementSibling;
                        const otherIcon = otherHeader.querySelector('.accordion-icon, .accordion-icon-approche');
                        
                        otherContent.style.maxHeight = '0px';
                        otherHeader.setAttribute('aria-expanded', 'false');
                        if (otherIcon) otherIcon.textContent = 'expand_more';
                    }
                });
            }
            
            // Toggle current
            if (isExpanded) {
                // Fermer
                content.style.maxHeight = '0px';
                this.setAttribute('aria-expanded', 'false');
                if (icon) icon.textContent = 'expand_more';
            } else {
                // Ouvrir avec fit-content
                this.setAttribute('aria-expanded', 'true');
                if (icon) icon.textContent = 'expand_less';
                content.style.maxHeight = content.scrollHeight + 20 + 'px'; // +20px de marge de sécurité
            }
        });
    });
    
    // Ouvrir les premiers accordions (aria-expanded="true") au chargement
    document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(header => {
        const content = header.nextElementSibling;
        if (content) {
            content.style.maxHeight = content.scrollHeight + 20 + 'px';
        }
    });
}

// Init accordions au chargement
document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
});

// Réinit au resize avec debounce
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reset sur desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.style.maxHeight = '';
            });
        } else {
            initAccordions();
        }
    }, 250);
});

// ── ANIMATIONS AU SCROLL ────────────────────────────────────
// Observer pour animer les éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Éléments à observer
document.querySelectorAll('.stack-category, .projet-card, .approche-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Ajouter la classe visible pour l'animation
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ── STATISTIQUES ANIMÉES ────────────────────────────────────
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observer pour les stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target;
            const text = statNumber.textContent;
            const hasPercent = text.includes('%');
            const hasTilde = text.includes('~');
            const value = parseInt(text.replace(/[^0-9]/g, ''));
            
            statNumber.dataset.animated = 'true';
            
            if (hasPercent) {
                animateValue(statNumber, 0, value, 1500, '%');
            } else if (hasTilde) {
                animateValue(statNumber, 0, value, 1500, '~');
            } else {
                animateValue(statNumber, 0, value, 1500, '+');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ── CONSOLE MESSAGE ─────────────────────────────────────────
console.log(`
┌─────────────────────────────────────────┐
│  PORTFOLIO V2 - JÉRÉMIE GARTNER         │
│  Développeur Web Junior                 │
│                                         │
│  Vous cherchez un dev qui code propre   │
│  ET a du goût en design ?               │
│  contact@jeremiegartner.fr              │
└─────────────────────────────────────────┘
`);

// ── EASTER EGG ──────────────────────────────────────────────
let konami = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konami.push(e.key);
    konami = konami.slice(-konamiCode.length);
    
    if (konami.join('') === konamiCode.join('')) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
