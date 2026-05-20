document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. THEME TOGGLE (LIGHT / DARK MODE)
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-moon';
    }
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        }
        
        // Trigger glow reactions
        const glows = document.querySelectorAll('.glow');
        glows.forEach(g => {
            g.style.opacity = '0.6';
            setTimeout(() => g.style.opacity = '0.35', 600);
        });
    });

    // ==========================================================================
    // 2. NAVBAR SCROLL EFFECT & ACTIVE STATE BINDINGS
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 220)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. INTERACTIVE BUDGET ESTIMATOR / CALCULATOR
    // ==========================================================================
    const checkboxes = document.querySelectorAll('.calc-option input[type="checkbox"]');
    const totalPriceVal = document.getElementById('total-price-value');
    const selectedSummary = document.getElementById('selected-summary');
    const requestQuoteBtn = document.getElementById('btn-request-quote');
    const contactServiceSelect = document.getElementById('c-service');
    
    function updateCalculator() {
        let total = 0;
        let selectedItems = [];
        
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const parent = cb.closest('.calc-option');
                const price = parseInt(parent.getAttribute('data-price'));
                const name = parent.querySelector('.option-name').textContent;
                
                total += price;
                selectedItems.push({ name, price, id: cb.id });
            }
        });
        
        if (selectedItems.length === 0) {
            selectedSummary.innerHTML = '<p class="text-muted">Ningún servicio seleccionado</p>';
            totalPriceVal.textContent = '0€';
            requestQuoteBtn.style.pointerEvents = 'none';
            requestQuoteBtn.style.opacity = '0.5';
        } else {
            requestQuoteBtn.style.pointerEvents = 'auto';
            requestQuoteBtn.style.opacity = '1';
            
            let summaryHTML = '';
            selectedItems.forEach(item => {
                summaryHTML += `
                    <div class="summary-item">
                        <span>• ${item.name}</span>
                        <span class="text-accent">${item.price}€</span>
                    </div>
                `;
            });
            selectedSummary.innerHTML = summaryHTML;
            totalPriceVal.textContent = total + '€';
        }
    }
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateCalculator);
    });
    
    updateCalculator();

    // ==========================================================================
    // 4. MICRO-INTERACTION: RESERVER BUDGET AUTO-FILLS CONTACT FORM
    // ==========================================================================
    requestQuoteBtn.addEventListener('click', (e) => {
        const selectedCbs = Array.from(checkboxes).filter(cb => cb.checked);
        
        if (selectedCbs.length > 0) {
            const firstSelectedId = selectedCbs[0].id;
            
            if (firstSelectedId === 'opt-maint') {
                contactServiceSelect.value = 'mantenimiento';
            } else if (firstSelectedId === 'opt-recovery') {
                contactServiceSelect.value = 'recuperacion';
            } else if (firstSelectedId === 'opt-format') {
                contactServiceSelect.value = 'formateo';
            } else if (firstSelectedId === 'opt-screen') {
                contactServiceSelect.value = 'moviles';
            } else if (firstSelectedId === 'opt-network') {
                contactServiceSelect.value = 'redes';
            }
            
            const messageArea = document.getElementById('c-message');
            const selectedNames = selectedCbs.map(cb => {
                return cb.closest('.calc-option').querySelector('.option-name').textContent;
            }).join(', ');
            
            messageArea.value = `Hola! Estoy interesado en contratar los siguientes servicios calculados en la web: ${selectedNames}. Quedo a la espera de confirmación comercial.`;
        }
    });

    // ==========================================================================
    // 5. OBSERVER REVEAL SCROLL ANIMATION
    // ==========================================================================
    const revealElements = document.querySelectorAll('.service-card, .calculator-box, .about-box, .contact-box');
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
});
