// KioskoPay Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initScrollAnimations();
    initFormValidation();
    initSmoothScrolling();
    initPerformanceTracking();
});

// Función para tracking de clics en botones de descarga
function trackDownload(store) {
    // Tracking del evento de descarga
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_click', {
            'event_category': 'app_download',
            'event_label': store,
            'value': 1
        });
    }
    
    // Mostrar modal de próximamente disponible
    showComingSoonModal(store);
}

// Función para mostrar modal de "próximamente disponible"
function showComingSoonModal(store) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'coming-soon-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 0 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    const storeName = store.includes('google') ? 'Google Play' : 'App Store';
    
    modalContent.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 1rem;">📱</div>
        <h3 style="color: #682c86; margin-bottom: 1rem;">¡Próximamente en ${storeName}!</h3>
        <p style="margin-bottom: 1.5rem; color: #666;">KioskoPay estará disponible muy pronto. Regístrate abajo para ser notificado del lanzamiento.</p>
        <button onclick="this.closest('.coming-soon-modal').remove(); scrollToForm()" 
                style="background: #ef4526; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-right: 10px;">
            Notificarme del Lanzamiento
        </button>
        <button onclick="this.closest('.coming-soon-modal').remove()" 
                style="background: transparent; color: #682c86; border: 2px solid #682c86; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Cerrar
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Función para scroll suave hacia el formulario
function scrollToForm() {
    const formSection = document.getElementById('conversion');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Tracking del evento CTA click
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'engagement',
                'event_label': 'scroll_to_form'
            });
        }
    }
}

// Animaciones al hacer scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Tracking de scroll depth
                const sectionId = entry.target.id;
                if (sectionId && typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_to_section', {
                        'event_category': 'engagement',
                        'event_label': sectionId
                    });
                }
            }
        });
    }, observerOptions);

    // Observar todas las secciones principales
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observar elementos específicos para animaciones
    const animatedElements = document.querySelectorAll('.feature-card, .pain-point, .testimonial, .business-type');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Validación y manejo del formulario
function initFormValidation() {
    const form = document.getElementById('notification-form') || document.getElementById('demo-form');
    if (!form) return;

    const submitButton = form.querySelector('.form-submit');
    const inputs = form.querySelectorAll('input[required], select[required]');

    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', handleFormSubmit);

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remover errores previos
        clearFieldError(field);

        // Validaciones específicas
        if (!value) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }

        switch (field.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Por favor ingresa un email válido');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Por favor ingresa un teléfono válido (10 dígitos)');
                    return false;
                }
                break;
            case 'text':
                if (field.name === 'nombre' && value.length < 2) {
                    showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                    return false;
                }
                if (field.name === 'negocio' && value.length < 2) {
                    showFieldError(field, 'El nombre del negocio debe tener al menos 2 caracteres');
                    return false;
                }
                break;
        }

        // Validación para select
        if (field.tagName === 'SELECT' && !value) {
            showFieldError(field, 'Por favor selecciona una opción');
            return false;
        }

        return true;
    }

    function clearErrors(e) {
        clearFieldError(e.target);
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#ef4526';
        
        // Remover mensaje de error previo
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Crear nuevo mensaje de error
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4526';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '4px';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        const digitsOnly = phone.replace(/\D/g, '');
        return phoneRegex.test(phone) && digitsOnly.length >= 10;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        // Validar todos los campos
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Mostrar estado de carga
        showLoadingState(submitButton);

        // Recopilar datos del formulario
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            negocio: formData.get('negocio'),
            tipo_negocio: formData.get('tipo_negocio'),
            timestamp: new Date().toISOString(),
            source: 'landing_page',
            form_type: form.id === 'notification-form' ? 'waitlist' : 'demo'
        };

        try {
            // Simulación de envío (reemplazar con endpoint real)
            await simulateFormSubmission(data);
            
            // Tracking de conversión
            if (typeof gtag !== 'undefined') {
                const eventLabel = data.form_type === 'waitlist' ? 'waitlist_signup' : 'demo_request';
                gtag('event', 'conversion', {
                    'event_category': 'lead_generation',
                    'event_label': eventLabel,
                    'value': 1
                });
            }

            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Resetear formulario
            form.reset();

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showErrorMessage();
        } finally {
            hideLoadingState(submitButton);
        }
    }

    function showLoadingState(button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }

    function hideLoadingState(button) {
        button.disabled = false;
        const isWaitlist = document.getElementById('notification-form');
        const buttonText = isWaitlist ? 
            '<i class="fas fa-bell"></i> Notificarme del Lanzamiento' : 
            '<i class="fas fa-rocket"></i> Quiero mi Demo';
        button.innerHTML = buttonText;
    }

    function showSuccessMessage() {
        const form = document.getElementById('notification-form') || document.getElementById('demo-form');
        const isWaitlist = document.getElementById('notification-form');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
        `;
        
        const successMessage = isWaitlist ? 
            `<i class="fas fa-check-circle"></i>
            <strong>¡Te has unido a la lista de espera!</strong><br>
            Te notificaremos tan pronto como KioskoPay esté disponible para descarga. Serás uno de los primeros en acceder.` :
            `<i class="fas fa-check-circle"></i>
            <strong>¡Gracias por tu interés!</strong><br>
            Nos pondremos en contacto contigo dentro de las próximas 24 horas para agendar tu demo personalizada.`;
            
        successDiv.innerHTML = successMessage;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Remover mensaje después de 10 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }

    function showErrorMessage() {
        const form = document.getElementById('demo-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-global';
        errorDiv.style.cssText = `
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error al enviar</strong><br>
            Por favor, intenta nuevamente o contáctanos directamente.
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        // Remover mensaje después de 8 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 8000);
    }

    async function simulateFormSubmission(data) {
        // Simulación de llamada a API (reemplazar con endpoint real)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular 95% de éxito
                if (Math.random() > 0.05) {
                    console.log('Lead enviado:', data);
                    resolve(data);
                } else {
                    reject(new Error('Error de simulación'));
                }
            }, 2000);
        });
    }
}

// Scroll suave para enlaces internos
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Tracking de performance y engagement
function initPerformanceTracking() {
    // Tracking de tiempo en página
    let startTime = Date.now();
    let hasScrolledToFeatures = false;

    // Tracking de scroll depth
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Tracking de scroll a características principales
        const solutionSection = document.getElementById('solution');
        if (solutionSection && !hasScrolledToFeatures) {
            const rect = solutionSection.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                hasScrolledToFeatures = true;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_to_features', {
                        'event_category': 'engagement',
                        'event_label': 'features_section_viewed'
                    });
                }
            }
        }

        // Tracking de profundidad de scroll cada 25%
        if (scrollPercent > 25 && !window.tracked25) {
            window.tracked25 = true;
            trackScrollDepth(25);
        }
        if (scrollPercent > 50 && !window.tracked50) {
            window.tracked50 = true;
            trackScrollDepth(50);
        }
        if (scrollPercent > 75 && !window.tracked75) {
            window.tracked75 = true;
            trackScrollDepth(75);
        }
        if (scrollPercent > 90 && !window.tracked90) {
            window.tracked90 = true;
            trackScrollDepth(90);
        }
    }, 100));

    // Tracking de tiempo de sesión al salir
    window.addEventListener('beforeunload', () => {
        const sessionTime = Date.now() - startTime;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'session_time', {
                'event_category': 'engagement',
                'event_label': 'time_on_page',
                'value': Math.round(sessionTime / 1000) // en segundos
            });
        }
    });

    function trackScrollDepth(percent) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                'event_category': 'engagement',
                'event_label': `${percent}%`,
                'value': percent
            });
        }
    }
}

// Utilidad de throttling para eventos de scroll
function throttle(func, wait) {
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

// Funciones adicionales para mejora de UX
document.addEventListener('DOMContentLoaded', function() {
    // Auto-formateo de teléfono
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
            }
            e.target.value = value;
        });
    }

    // Mejora de accesibilidad - navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });

    // Lazy loading simulado para imágenes (si se añaden en el futuro)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Funciones para hacer visibles en el scope global (para onClick en HTML)
window.scrollToForm = scrollToForm;
window.trackDownload = trackDownload;