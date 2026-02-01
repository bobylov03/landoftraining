// DOM готов
document.addEventListener('DOMContentLoaded', function() {
    console.time('Site Load Time');
    
    try {
        // Инициализация всех функций в правильном порядке
        initLanguageSwitcher(); // Первым - язык
        initUtilities(); // Вторым - утилиты (год и т.д.)
        initMobileMenu();
        initSmoothScroll();
        initAnimations();
        initHeaderScroll();
        initWhatsAppButtons();
        initMapFunctions();
        initGalleryLightbox();
        initFormValidation();
        initPriceCalculator();
        initBackToTop();
        
        // Запускаем ленивую загрузку изображений
        initLazyLoading();
        
        // Уведомляем пользователя о готовности
        console.log('✅ THE LAND OF TRAINING сайт успешно загружен!');
        console.timeEnd('Site Load Time');
        
        // Показываем плавную анимацию загрузки для пользователя
        document.body.classList.add('loaded');
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке сайта:', error);
        // Все равно показываем контент пользователю
        document.body.classList.add('loaded');
    }
});

// 1. Мобильное меню (УЛУЧШЕННЫЙ)
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('Элементы меню не найдены');
        return;
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Функция для открытия/закрытия меню
    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Блокировка скролла с лучшей поддержкой
        if (isActive) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            // Фокус на первом элементе меню для доступности
            setTimeout(() => {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    };
    
    // Функция для закрытия меню
    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };
    
    // Обработчики событий
    hamburger.addEventListener('click', toggleMenu);
    
    // Добавляем aria-атрибуты для доступности
    hamburger.setAttribute('aria-label', 'Меню навигации');
    hamburger.setAttribute('aria-controls', 'nav-menu');
    hamburger.setAttribute('aria-expanded', 'false');
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
        
        // Добавляем поддержку клавиатуры
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                closeMenu();
            }
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = navMenu.contains(e.target) || hamburger.contains(e.target);
        const isMenuActive = navMenu.classList.contains('active');
        
        if (!isClickInsideMenu && isMenuActive) {
            closeMenu();
        }
    });
    
    // Закрытие меню по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });
    
    // Закрытие меню при изменении ориентации устройства
    window.addEventListener('orientationchange', closeMenu);
    
    // Автоматическое закрытие меню при ресайзе
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
}

// 2. Переключение языка (УЛУЧШЕННЫЙ)
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const body = document.body;
    const htmlElement = document.documentElement;
    
    if (langButtons.length === 0) {
        console.warn('Кнопки переключения языка не найдены');
        return;
    }
    
    // Функция переключения языка
    function switchLanguage(lang) {
        try {
            // Проверяем валидность языка
            if (!['tr', 'en'].includes(lang)) {
                console.warn(`Неподдерживаемый язык: ${lang}`);
                lang = 'tr'; // По умолчанию турецкий
            }
            
            console.log(`Переключаем язык на: ${lang}`);
            
            // Удаляем активный класс у всех кнопок
            langButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Добавляем активный класс к выбранной кнопке
            const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.setAttribute('aria-pressed', 'true');
            }
            
            // Устанавливаем соответствующий класс на body
            if (lang === 'en') {
                body.classList.add('lang-en');
                htmlElement.lang = 'en';
                htmlElement.dir = 'ltr';
            } else {
                body.classList.remove('lang-en');
                htmlElement.lang = 'tr';
                htmlElement.dir = 'ltr';
            }
            
            // Обновляем все динамические тексты (WhatsApp сообщения и т.д.)
            updateDynamicContent(lang);
            
            // Сохраняем выбор языка в localStorage
            try {
                localStorage.setItem('selectedLang', lang);
            } catch (e) {
                console.warn('Не удалось сохранить язык в localStorage:', e);
            }
            
            // Отправляем событие о смене языка
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { 
                    lang,
                    timestamp: Date.now()
                } 
            }));
            
        } catch (error) {
            console.error('Ошибка при переключении языка:', error);
        }
    }
    
    // Обновление динамического контента
    function updateDynamicContent(lang) {
        // Здесь можно обновлять динамические тексты
        // Например, обновлять сообщения WhatsApp при смене языка
        updateWhatsAppLinks(lang);
    }
    
    // Обновление WhatsApp ссылок
    function updateWhatsAppLinks(lang) {
        const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
        if (whatsappLinks.length === 0) return;
        
        const messages = {
            tr: "Merhaba, THE LAND OF TRAINING spor salonu hakkında bilgi almak istiyorum.",
            en: "Hello, I would like to get information about THE LAND OF TRAINING gym."
        };
        
        const message = messages[lang] || messages.tr;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '+905078294704';
        
        whatsappLinks.forEach(link => {
            if (link.href.includes('whatsapp.com')) {
                link.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            }
        });
    }
    
    // Обработчик клика на кнопки языка
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            switchLanguage(selectedLang);
            
            // Анимация нажатия кнопки
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Добавляем поддержку клавиатуры
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Проверка сохраненного языка при загрузке
    function getInitialLanguage() {
        let savedLang;
        try {
            savedLang = localStorage.getItem('selectedLang');
        } catch (e) {
            console.warn('Не удалось прочитать язык из localStorage:', e);
        }
        
        const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
        
        // Приоритеты: сохраненный язык > язык браузера > турецкий по умолчанию
        if (savedLang && ['tr', 'en'].includes(savedLang)) {
            return savedLang;
        } else if (browserLang === 'en') {
            return 'en';
        } else {
            return 'tr';
        }
    }
    
    // Инициализация языка при загрузке с небольшой задержкой
    setTimeout(() => {
        const initialLang = getInitialLanguage();
        switchLanguage(initialLang);
    }, 50);
}

// 3. Плавная прокрутка (УЛУЧШЕННЫЙ)
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (links.length === 0) return;
    
    // Предзагрузка целевых элементов для быстрого доступа
    const targetCache = new Map();
    
    // Функция для получения целевого элемента с кэшированием
    function getTargetElement(href) {
        if (targetCache.has(href)) {
            return targetCache.get(href);
        }
        
        const element = document.querySelector(href);
        if (element) {
            targetCache.set(href, element);
        }
        
        return element;
    }
    
    // Функция плавной прокрутки
    function smoothScrollTo(targetElement, offset = 0) {
        if (!targetElement) return;
        
        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(800, Math.max(400, Math.abs(distance) / 2));
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Используем easing-функцию для более плавной анимации
            const easeInOutCubic = t => t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Уведомляем о завершении скролла
                targetElement.dispatchEvent(new CustomEvent('scrollCompleted', {
                    bubbles: true
                }));
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetElement = getTargetElement(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Рассчитываем отступ с учетом высоты хедера
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const additionalOffset = 20; // Дополнительный отступ
                
                // Закрываем мобильное меню если открыто
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.click();
                }
                
                // Обновляем URL
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Выполняем плавную прокрутку
                smoothScrollTo(targetElement, headerHeight + additionalOffset);
            }
        });
        
        // Добавляем индикатор активной секции
        link.addEventListener('scrollCompleted', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Обновление активных ссылок при скролле
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveLink();
        }, 100);
    });
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const targetElement = getTargetElement(href);
            
            if (targetElement) {
                const elementTop = targetElement.offsetTop;
                const elementBottom = elementTop + targetElement.offsetHeight;
                
                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
}

// 4. Анимации при скролле (УЛУЧШЕННЫЙ)
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .gallery-item, .info-item, .about-text, .about-image, .map-placeholder'
    );
    
    if (animatedElements.length === 0) return;
    
    // Создаем Intersection Observer с улучшенными настройками
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс для анимации с задержкой
                const delay = entry.target.dataset.animationDelay || 
                             (entry.target.classList.contains('featured') ? '0.2s' : '0s');
                
                entry.target.style.animationDelay = delay;
                entry.target.classList.add('animate');
                
                // Прекращаем наблюдение после появления
                observer.unobserve(entry.target);
                
                // Запускаем дополнительные эффекты
                if (entry.target.classList.contains('service-card')) {
                    entry.target.addEventListener('mouseenter', () => {
                        entry.target.style.transform = 'translateY(-10px)';
                    });
                    
                    entry.target.addEventListener('mouseleave', () => {
                        entry.target.style.transform = '';
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Начинаем наблюдение за элементами
    animatedElements.forEach((el, index) => {
        // Устанавливаем кастомную задержку для элементов
        el.dataset.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Анимация при загрузке страницы
    window.addEventListener('load', () => {
        animatedElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('animate');
            }
        });
    });
    
    // Вспомогательная функция для проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9
        );
    }
}

// 5. Изменение шапки при скролле (УЛУЧШЕННЫЙ)
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const langSwitcher = document.querySelector('.lang-switcher');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        
        // Изменение фона шапки
        if (scrollTop > 50) {
            const opacity = Math.min(0.98, 0.95 + (scrollTop - 50) / 500);
            header.style.backgroundColor = `rgba(10, 10, 10, ${opacity})`;
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
            
            // Прячем языковой переключатель при быстром скролле вниз
            if (scrollDelta > 10 && scrollTop > 200 && langSwitcher) {
                langSwitcher.style.transform = 'translateY(-100px)';
                langSwitcher.style.opacity = '0';
                langSwitcher.style.pointerEvents = 'none';
                langSwitcher.style.transition = 'all 0.3s ease';
            } else if (scrollDelta < -5 && langSwitcher) {
                // Показываем при скролле вверх
                langSwitcher.style.transform = 'translateY(0)';
                langSwitcher.style.opacity = '1';
                langSwitcher.style.pointerEvents = 'all';
            }
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
            
            if (langSwitcher) {
                langSwitcher.style.transform = 'translateY(0)';
                langSwitcher.style.opacity = '1';
                langSwitcher.style.pointerEvents = 'all';
            }
        }
        
        // Эффект "скрытия" шапки при скролле вниз
        if (scrollDelta > 0 && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Сбрасываем трансформацию при наведении
    header.addEventListener('mouseenter', () => {
        header.style.transform = 'translateY(0)';
    });
    
    // Инициализация при загрузке
    updateHeader();
}

// 6. WhatsApp кнопки и функционал (УЛУЧШЕННЫЙ)
function initWhatsAppButtons() {
    const phoneNumber = '+905078294704';
    
    // Кэш сообщений
    const messageCache = {
        tr: "Merhaba, THE LAND OF TRAINING spor salonu hakkında bilgi almak istiyorum.",
        en: "Hello, I would like to get information about THE LAND OF TRAINING gym."
    };
    
    // Функция получения сообщения
    function getWhatsAppMessage(lang = null) {
        if (!lang) {
            lang = document.body.classList.contains('lang-en') ? 'en' : 'tr';
        }
        return messageCache[lang] || messageCache.tr;
    }
    
    // Инициализация всех WhatsApp кнопок
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"], .whatsapp-btn');
    
    if (whatsappButtons.length === 0) return;
    
    // Функция обновления ссылок WhatsApp
    function updateWhatsAppLinks(lang) {
        const message = getWhatsAppMessage(lang);
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        whatsappButtons.forEach(btn => {
            if (btn.href.includes('whatsapp.com')) {
                btn.href = url;
            }
            // Добавляем параметры безопасности
            btn.setAttribute('rel', 'noopener noreferrer');
            btn.setAttribute('target', '_blank');
        });
    }
    
    // Инициализация ссылок
    updateWhatsAppLinks();
    
    // Слушаем событие смены языка
    document.addEventListener('languageChanged', (e) => {
        updateWhatsAppLinks(e.detail.lang);
    });
    
    // Добавляем счетчик кликов с улучшенной обработкой
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Не прерываем стандартное поведение
            // Просто логируем
            
            try {
                let clicks = parseInt(localStorage.getItem('whatsappClicks') || '0');
                clicks++;
                localStorage.setItem('whatsappClicks', clicks.toString());
                
                // Отправляем событие в аналитику
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_click', {
                        'event_category': 'engagement',
                        'event_label': 'whatsapp_contact',
                        'value': clicks
                    });
                }
                
                // Можно добавить отправку на свой сервер
                // sendAnalyticsEvent('whatsapp_click', { clicks });
                
                console.log(`📱 WhatsApp clicked ${clicks} times`);
                
            } catch (error) {
                console.warn('Не удалось сохранить статистику кликов:', error);
            }
        });
    });
    
    // Плавающая кнопка WhatsApp
    const floatBtn = document.querySelector('.whatsapp-float');
    if (floatBtn) {
        // Добавляем улучшенную анимацию пульсации
        let pulseAnimation;
        
        function startPulseAnimation() {
            floatBtn.style.animation = 'pulse 2s infinite';
        }
        
        function stopPulseAnimation() {
            floatBtn.style.animation = 'none';
        }
        
        // Запускаем анимацию
        startPulseAnimation();
        
        // Создаем tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'whatsapp-tooltip';
        tooltip.setAttribute('aria-hidden', 'true');
        
        function updateTooltipText() {
            const isEnglish = document.body.classList.contains('lang-en');
            tooltip.textContent = isEnglish 
                ? 'Contact us on WhatsApp' 
                : 'Bize WhatsApp\'tan ulaşın';
        }
        
        updateTooltipText();
        
        // Стили для tooltip
        Object.assign(tooltip.style, {
            position: 'absolute',
            right: 'calc(100% + 15px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#25D366',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            opacity: '0',
            transition: 'opacity 0.3s, transform 0.3s',
            pointerEvents: 'none',
            zIndex: '1001',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transformOrigin: 'right center'
        });
        
        floatBtn.appendChild(tooltip);
        
        // Обработчики для tooltip
        floatBtn.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) scale(1)';
            stopPulseAnimation();
        });
        
        floatBtn.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-50%) scale(0.9)';
            startPulseAnimation();
        });
        
        // Добавляем focus для доступности
        floatBtn.addEventListener('focus', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-50%) scale(1)';
        });
        
        floatBtn.addEventListener('blur', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-50%) scale(0.9)';
        });
        
        // Обновляем tooltip при смене языка
        document.addEventListener('languageChanged', updateTooltipText);
        
        // Добавляем атрибуты доступности
        floatBtn.setAttribute('aria-label', 'Contact on WhatsApp');
        
        // Адаптация для мобильных устройств
        window.addEventListener('touchstart', () => {
            // На мобильных устройствах показываем tooltip при тапе
            floatBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(-50%) scale(1)';
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(-50%) scale(0.9)';
                }, 2000);
            }, { passive: false });
        });
    }
}

// 7. Функции карты и местоположения (УЛУЧШЕННЫЙ)
function initMapFunctions() {
    const address = "Altıntaş, Kardeş Kentler Cd. No:50, 07122, 07112 Aksu/Antalya";
    
    // Функция открытия Google Maps
    function openGoogleMaps(locationAddress = address) {
        try {
            const encodedAddress = encodeURIComponent(locationAddress);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
            
            // Логирование для аналитики
            console.log('🗺️ Opening Google Maps:', locationAddress);
            
        } catch (error) {
            console.error('Ошибка при открытии карты:', error);
            // Резервный вариант - просто показываем адрес
            alert(`Адрес: ${locationAddress}`);
        }
    }
    
    // Инициализация кликабельных адресов
    const locationLinks = document.querySelectorAll('.location-link');
    
    if (locationLinks.length > 0) {
        locationLinks.forEach(link => {
            // Добавляем стили и атрибуты
            Object.assign(link.style, {
                cursor: 'pointer',
                transition: 'color 0.3s ease'
            });
            
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
            link.setAttribute('aria-label', 'Open location in Google Maps');
            
            // Обработчик клика
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const locationAddress = this.getAttribute('data-location') || 
                                       this.textContent.trim();
                openGoogleMaps(locationAddress);
                
                // Анимация нажатия
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
            
            // Обработчик клавиатуры
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Эффекты при наведении
            link.addEventListener('mouseenter', function() {
                this.style.color = '#d32f2f';
                this.style.textDecoration = 'underline';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.color = '';
                this.style.textDecoration = '';
            });
        });
    }
    
    // Обработчики для кнопок карты
    const mapButtons = document.querySelectorAll('.map-btn, #openMapBtn');
    mapButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openGoogleMaps();
        });
    });
    
    // Обработчик для карты-заглушки
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        // Делаем карту интерактивной
        Object.assign(mapPlaceholder.style, {
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });
        
        mapPlaceholder.addEventListener('click', function(e) {
            if (e.target === this || e.target.closest('.map-overlay')) {
                openGoogleMaps();
                
                // Анимация нажатия
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        // Эффекты при наведении
        mapPlaceholder.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.map-overlay');
            if (overlay) {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                overlay.style.transform = 'scale(1.02)';
            }
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.7)';
        });
        
        mapPlaceholder.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.map-overlay');
            if (overlay) {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                overlay.style.transform = 'scale(1)';
            }
            this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.5)';
        });
    }
    
    // Определение местоположения пользователя
    if ('geolocation' in navigator) {
        const locationBtn = document.createElement('button');
        locationBtn.className = 'btn location-btn';
        locationBtn.innerHTML = `
            <i class="fas fa-location-arrow"></i> 
            <span class="tr-lang">Bana Nasıl Gidilir?</span>
            <span class="en-lang">Get Directions</span>
        `;
        
        Object.assign(locationBtn.style, {
            marginTop: '15px',
            backgroundColor: '#4285f4',
            fontSize: '14px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: 'white',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600'
        });
        
        // Эффекты при наведении
        locationBtn.addEventListener('mouseenter', () => {
            locationBtn.style.backgroundColor = '#3367d6';
            locationBtn.style.transform = 'translateY(-2px)';
        });
        
        locationBtn.addEventListener('mouseleave', () => {
            locationBtn.style.backgroundColor = '#4285f4';
            locationBtn.style.transform = '';
        });
        
        // Обработчик клика
        locationBtn.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            const isEnglish = document.body.classList.contains('lang-en');
            
            this.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i> 
                ${isEnglish ? 'Getting location...' : 'Konum alınıyor...'}
            `;
            this.disabled = true;
            this.style.opacity = '0.7';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodeURIComponent(address)}`;
                    
                    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                    
                    // Восстанавливаем кнопку
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                        this.style.opacity = '1';
                    }, 1000);
                },
                (error) => {
                    console.warn('Ошибка получения геолокации:', error);
                    
                    const errorMessage = isEnglish
                        ? 'Unable to get your location. Please check your browser settings or enable location services.'
                        : 'Konumunuz alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin veya konum servislerini etkinleştirin.';
                    
                    alert(errorMessage);
                    
                    // Восстанавливаем кнопку
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    this.style.opacity = '1';
                },
                { 
                    timeout: 10000,
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        });
        
        // Добавляем кнопку в карту
        const mapOverlay = document.querySelector('.map-overlay');
        if (mapOverlay) {
            mapOverlay.appendChild(locationBtn);
        }
    }
}

// 8. Галерея с лайтбоксом (УЛУЧШЕННЫЙ)
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) {
        console.log('Элементы галереи не найдены');
        return;
    }
    
    console.log(`Найдено ${galleryItems.length} элементов галереи`);
    
    // Создаем лайтбокс только если есть элементы
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image gallery');
    
    Object.assign(lightbox.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '2000',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        backdropFilter: 'blur(5px)'
    });
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    Object.assign(lightboxContent.style, {
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });
    
    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-image';
    lightboxImg.setAttribute('alt', '');
    lightboxImg.setAttribute('loading', 'lazy');
    
    Object.assign(lightboxImg.style, {
        maxWidth: '100%',
        maxHeight: '90vh',
        objectFit: 'contain',
        borderRadius: '8px',
        transform: 'scale(0.9)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
    });
    
    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close gallery');
    
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        border: 'none',
        color: 'white',
        fontSize: '40px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '2001',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        fontWeight: '300'
    });
    
    // Кнопка "назад"
    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-prev';
    prevBtn.innerHTML = '❮';
    prevBtn.setAttribute('aria-label', 'Previous image');
    
    Object.assign(prevBtn.style, {
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        border: 'none',
        color: 'white',
        fontSize: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '2001',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease'
    });
    
    // Кнопка "вперед"
    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-next';
    nextBtn.innerHTML = '❯';
    nextBtn.setAttribute('aria-label', 'Next image');
    
    Object.assign(nextBtn.style, {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        border: 'none',
        color: 'white',
        fontSize: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '2001',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease'
    });
    
    // Счетчик изображений
    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    
    Object.assign(counter.style, {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: '600',
        backdropFilter: 'blur(5px)'
    });
    
    // Эффекты при наведении на кнопки
    [closeBtn, prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(211, 47, 47, 0.9)';
            btn.style.transform = btn === closeBtn ? '' : 'translateY(-50%) scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            btn.style.transform = btn === closeBtn ? '' : 'translateY(-50%) scale(1)';
        });
    });
    
    // Собираем лайтбокс
    lightboxContent.appendChild(lightboxImg);
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);
    lightbox.appendChild(counter);
    document.body.appendChild(lightbox);
    
    // Данные галереи
    let currentIndex = 0;
    const images = Array.from(galleryItems).map((item, index) => ({
        src: item.querySelector('img')?.src || '',
        alt: item.querySelector('img')?.alt || `Image ${index + 1}`,
        title: item.querySelector('.gallery-overlay')?.textContent || ''
    })).filter(img => img.src); // Фильтруем только с валидными src
    
    if (images.length === 0) {
        console.warn('Не найдено изображений для галереи');
        lightbox.remove();
        return;
    }
    
    // Открытие лайтбокса
    function openLightbox(index) {
        if (index < 0 || index >= images.length) return;
        
        currentIndex = index;
        updateLightboxImage();
        
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 10);
        
        // Блокировка скролла
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Фокус на кнопке закрытия для доступности
        setTimeout(() => closeBtn.focus(), 100);
        
        // Логирование для аналитики
        console.log(`📸 Открыто изображение ${currentIndex + 1} из ${images.length}`);
    }
    
    // Обновление изображения в лайтбоксе
    function updateLightboxImage() {
        const image = images[currentIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxImg.title = image.title;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    // Закрытие лайтбокса
    function closeLightbox() {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
        
        // Возвращаем фокус на элемент, который открыл лайтбокс
        const galleryItem = galleryItems[currentIndex];
        if (galleryItem) {
            setTimeout(() => galleryItem.focus(), 100);
        }
    }
    
    // Переход к следующему изображению
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
        animateImageTransition('right');
    }
    
    // Переход к предыдущему изображению
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
        animateImageTransition('left');
    }
    
    // Анимация перехода между изображениями
    function animateImageTransition(direction) {
        lightboxImg.style.transform = `translateX(${direction === 'right' ? '20px' : '-20px'}) scale(0.9)`;
        lightboxImg.style.opacity = '0.5';
        
        setTimeout(() => {
            lightboxImg.style.transform = 'translateX(0) scale(1)';
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transition = 'all 0.3s ease';
        }, 10);
    }
    
    // Добавляем обработчики для элементов галереи
    galleryItems.forEach((item, index) => {
        // Пропускаем элементы без изображений
        if (!item.querySelector('img')?.src) return;
        
        Object.assign(item.style, {
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
        });
        
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Open image ${index + 1}`);
        
        // Обработчик клика
        item.addEventListener('click', () => openLightbox(index));
        
        // Обработчик клавиатуры
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        
        // Эффект при наведении
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
    
    // Обработчики для кнопок лайтбокса
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Закрытие по клику на фон
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContent) {
            closeLightbox();
        }
    });
    
    // Управление клавиатурой
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            e.preventDefault();
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case ' ':
                    // Пауза/продолжение анимации, если будет
                    break;
            }
        }
    });
    
    // Свайпы для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Свайп влево - следующее изображение
                nextImage();
            } else {
                // Свайп вправо - предыдущее изображение
                prevImage();
            }
        }
    }
    
    // Предзагрузка изображений для быстрой навигации
    function preloadImages() {
        console.log('⏳ Предзагрузка изображений галереи...');
        
        images.forEach((img, index) => {
            const image = new Image();
            image.src = img.src;
            image.onload = () => {
                if (index === 0) {
                    console.log('✅ Изображения предзагружены');
                }
            };
            image.onerror = () => {
                console.warn(`Не удалось загрузить изображение: ${img.src}`);
            };
        });
    }
    
    // Предзагружаем изображения после загрузки страницы
    window.addEventListener('load', preloadImages);
    
    // Ленивая загрузка для ускорения начальной загрузки
    setTimeout(preloadImages, 2000);
}

// 9. Валидация форм (для будущих форм)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    if (forms.length === 0) {
        return; // Нет форм на странице
    }
    
    forms.forEach(form => {
        // Улучшенная валидация с поддержкой разных типов полей
        const validateForm = (e) => {
            e.preventDefault();
            
            let isValid = true;
            const errorFields = [];
            const inputs = form.querySelectorAll('input, textarea, select');
            
            // Сбрасываем предыдущие ошибки
            form.querySelectorAll('.form-error').forEach(error => error.remove());
            inputs.forEach(input => {
                input.classList.remove('error');
                input.style.borderColor = '';
            });
            
            // Проверяем каждое поле
            inputs.forEach(input => {
                const value = input.value.trim();
                const isRequired = input.hasAttribute('required');
                const type = input.type || input.tagName.toLowerCase();
                
                // Проверка обязательных полей
                if (isRequired && !value) {
                    markFieldAsInvalid(input, getErrorMessage('required'));
                    isValid = false;
                    errorFields.push(input);
                }
                
                // Проверка email
                if (type === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        markFieldAsInvalid(input, getErrorMessage('email'));
                        isValid = false;
                        errorFields.push(input);
                    }
                }
                
                // Проверка телефона
                if ((input.name.includes('phone') || input.type === 'tel') && value) {
                    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                        markFieldAsInvalid(input, getErrorMessage('phone'));
                        isValid = false;
                        errorFields.push(input);
                    }
                }
                
                // Проверка минимальной длины
                const minLength = input.getAttribute('minlength');
                if (minLength && value.length < parseInt(minLength)) {
                    markFieldAsInvalid(input, getErrorMessage('minlength', minLength));
                    isValid = false;
                    errorFields.push(input);
                }
            });
            
            if (isValid) {
                showFormSuccess(form);
                // Здесь можно добавить отправку формы
                // simulateFormSubmit(form);
            } else {
                showFormError(form, errorFields);
                // Фокус на первом поле с ошибкой
                if (errorFields[0]) {
                    errorFields[0].focus();
                }
            }
        };
        
        form.addEventListener('submit', validateForm);
        
        // Валидация при потере фокуса
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Сброс ошибки при вводе
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    input.style.borderColor = '';
                    
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('form-error')) {
                        errorMsg.remove();
                    }
                }
            });
        });
    });
    
    // Вспомогательные функции
    function markFieldAsInvalid(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#d32f2f';
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error';
        errorMsg.textContent = message;
        errorMsg.style.cssText = `
            color: #d32f2f;
            font-size: 12px;
            margin-top: 5px;
            animation: fadeIn 0.3s;
        `;
        
        // Удаляем предыдущую ошибку для этого поля
        const existingError = input.nextElementSibling;
        if (existingError && existingError.classList.contains('form-error')) {
            existingError.remove();
        }
        
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }
    
    function validateField(input) {
        const value = input.value.trim();
        let error = null;
        
        if (input.hasAttribute('required') && !value) {
            error = getErrorMessage('required');
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = getErrorMessage('email');
            }
        }
        
        if (error) {
            markFieldAsInvalid(input, error);
        } else if (input.classList.contains('error')) {
            input.classList.remove('error');
            input.style.borderColor = '';
            
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('form-error')) {
                errorMsg.remove();
            }
        }
    }
    
    function getErrorMessage(type, param = null) {
        const isEnglish = document.body.classList.contains('lang-en');
        
        const messages = {
            required: isEnglish ? 'This field is required' : 'Bu alan zorunludur',
            email: isEnglish ? 'Please enter a valid email address' : 'Lütfen geçerli bir e-posta adresi girin',
            phone: isEnglish ? 'Please enter a valid phone number' : 'Lütfen geçerli bir telefon numarası girin',
            minlength: isEnglish ? `Minimum ${param} characters required` : `En az ${param} karakter gerekli`
        };
        
        return messages[type] || messages.required;
    }
    
    function showFormSuccess(form) {
        const isEnglish = document.body.classList.contains('lang-en');
        
        // Удаляем предыдущие сообщения
        form.querySelectorAll('.form-message').forEach(msg => msg.remove());
        
        const successMsg = document.createElement('div');
        successMsg.className = 'form-message success';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${isEnglish ? 'Thank you! Your message has been sent successfully.' : 'Teşekkürler! Mesajınız başarıyla gönderildi.'}</span>
        `;
        
        successMsg.style.cssText = `
            background-color: #4caf50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            animation: fadeIn 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
        
        form.appendChild(successMsg);
        
        // Очищаем форму через 3 секунды
        setTimeout(() => {
            successMsg.style.opacity = '0';
            successMsg.style.transform = 'translateY(-10px)';
            successMsg.style.transition = 'all 0.3s';
            
            setTimeout(() => {
                form.reset();
                successMsg.remove();
            }, 300);
        }, 3000);
    }
    
    function showFormError(form, errorFields) {
        const isEnglish = document.body.classList.contains('lang-en');
        
        // Удаляем предыдущие общие сообщения об ошибках
        form.querySelectorAll('.form-message.error').forEach(msg => msg.remove());
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-message error';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${isEnglish ? 'Please correct the errors below.' : 'Lütfen aşağıdaki hataları düzeltin.'}</span>
        `;
        
        errorMsg.style.cssText = `
            background-color: #d32f2f;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            animation: fadeIn 0.5s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
        
        form.insertBefore(errorMsg, form.firstChild);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            errorMsg.style.opacity = '0';
            errorMsg.style.transform = 'translateY(-10px)';
            errorMsg.style.transition = 'all 0.3s';
            
            setTimeout(() => {
                errorMsg.remove();
            }, 300);
        }, 5000);
    }
    
    // Симуляция отправки формы (для демонстрации)
    function simulateFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('📤 Form submission simulated:', data);
        
        // Здесь будет реальная отправка на сервер
        // return fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    }
}

// 10. Калькулятор цен (УЛУЧШЕННЫЙ)
function initPriceCalculator() {
    // Проверяем, нужно ли показывать калькулятор
    const shouldShowCalculator = document.querySelector('.pricing-card') !== null;
    if (!shouldShowCalculator) return;
    
    // Создаем кнопку калькулятора
    const calculatorBtn = document.createElement('button');
    calculatorBtn.className = 'calculator-btn';
    calculatorBtn.setAttribute('aria-label', 'Price Calculator');
    calculatorBtn.setAttribute('title', 'Calculate your price');
    calculatorBtn.innerHTML = '<i class="fas fa-calculator"></i>';
    
    Object.assign(calculatorBtn.style, {
        position: 'fixed',
        bottom: '160px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#ff9800',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
        transition: 'all 0.3s ease',
        outline: 'none'
    });
    
    document.body.appendChild(calculatorBtn);
    
    // Эффекты при наведении
    calculatorBtn.addEventListener('mouseenter', () => {
        calculatorBtn.style.transform = 'scale(1.1) rotate(5deg)';
        calculatorBtn.style.backgroundColor = '#f57c00';
        calculatorBtn.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
    });
    
    calculatorBtn.addEventListener('mouseleave', () => {
        calculatorBtn.style.transform = 'scale(1) rotate(0)';
        calculatorBtn.style.backgroundColor = '#ff9800';
        calculatorBtn.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.3)';
    });
    
    // Анимация привлечения внимания
    let attentionInterval;
    
    function startAttentionAnimation() {
        attentionInterval = setInterval(() => {
            calculatorBtn.style.transform = 'scale(1.1)';
            calculatorBtn.style.boxShadow = '0 0 0 10px rgba(255, 152, 0, 0.1)';
            
            setTimeout(() => {
                calculatorBtn.style.transform = 'scale(1)';
                calculatorBtn.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.3)';
            }, 600);
        }, 5000);
    }
    
    function stopAttentionAnimation() {
        clearInterval(attentionInterval);
    }
    
    // Запускаем анимацию через 10 секунд после загрузки
    setTimeout(startAttentionAnimation, 10000);
    
    // Останавливаем при наведении
    calculatorBtn.addEventListener('mouseenter', stopAttentionAnimation);
    calculatorBtn.addEventListener('mouseleave', () => {
        setTimeout(startAttentionAnimation, 30000); // Перезапускаем через 30 секунд
    });
    
    // Данные цен
    const priceData = {
        group: {
            name: { tr: 'Grup Dersleri', en: 'Group Classes' },
            basePrice: 4000,
            discounts: {
                3: { total: 9000, monthly: 3000, discount: 25 },
                6: { total: 16200, monthly: 2700, discount: 32.5 },
                12: { total: 28800, monthly: 2400, discount: 40 }
            }
        },
        weight: {
            name: { tr: 'Kilo Kontrolü', en: 'Weight Control' },
            basePrice: 5000,
            discounts: {
                3: { total: 13500, monthly: 4500, discount: 10 },
                6: { total: 24000, monthly: 4000, discount: 20 },
                12: { total: 42000, monthly: 3500, discount: 30 }
            }
        }
    };
    
    // Функция расчета цены
    function calculatePrice(serviceType, months) {
        const service = priceData[serviceType];
        if (!service) return { total: 0, monthly: 0, discount: 0 };
        
        if (service.discounts[months]) {
            return service.discounts[months];
        }
        
        // Расчет для других периодов
        let bestDiscount = { months: 1, discount: 0 };
        
        for (const discountMonths in service.discounts) {
            if (months >= discountMonths && service.discounts[discountMonths].discount > bestDiscount.discount) {
                bestDiscount = { 
                    months: parseInt(discountMonths), 
                    discount: service.discounts[discountMonths].discount 
                };
            }
        }
        
        if (bestDiscount.months === 1) {
            // Нет подходящей скидки
            const total = service.basePrice * months;
            return {
                total: total,
                monthly: service.basePrice,
                discount: 0
            };
        } else {
            // Применяем лучшую скидку
            const discountPackage = service.discounts[bestDiscount.months];
            const remainingMonths = months - bestDiscount.months;
            const remainingCost = remainingMonths * discountPackage.monthly;
            const total = discountPackage.total + remainingCost;
            
            return {
                total: Math.round(total),
                monthly: Math.round(total / months),
                discount: bestDiscount.discount
            };
        }
    }
    
    // Создание модального окна калькулятора
    function createCalculatorModal() {
        const isEnglish = document.body.classList.contains('lang-en');
        
        // Проверяем, не открыт ли уже калькулятор
        if (document.querySelector('.calculator-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'calculator-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Price Calculator');
        
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '3000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            padding: '20px',
            boxSizing: 'border-box',
            backdropFilter: 'blur(5px)'
        });
        
        const modalContent = document.createElement('div');
        modalContent.className = 'calculator-content';
        
        Object.assign(modalContent.style, {
            background: '#1a1a1a',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            transform: 'scale(0.9)',
            transition: 'transform 0.3s ease',
            border: '3px solid #d32f2f',
            color: 'white',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
        });
        
        // Заголовок и кнопка закрытия
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                <div>
                    <h2 style="margin: 0; color: #d32f2f; font-size: 28px; font-weight: 800;">${isEnglish ? 'PRICE CALCULATOR' : 'FİYAT HESAPLAMA'}</h2>
                    <p style="margin: 10px 0 0; color: #aaa; font-size: 14px;">${isEnglish ? 'Get an instant estimate for your training' : 'Antrenmanınız için anlık tahmin alın'}</p>
                </div>
                <button class="close-calculator" aria-label="Close calculator" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border-radius: 50%; background: rgba(255,255,255,0.1);">
                    &times;
                </button>
            </div>
            
            <div class="calculator-form">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 15px; color: #e0e0e0; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-dumbbell" style="margin-right: 10px;"></i>
                        ${isEnglish ? 'Service Type' : 'Hizmet Türü'}
                    </label>
                    <select id="serviceType" style="width: 100%; padding: 15px; background: #2a2a2a; color: white; border: 2px solid #444; border-radius: 10px; font-size: 16px; outline: none; cursor: pointer; transition: all 0.3s;">
                        <option value="group">${isEnglish ? 'Group Classes (Wrestling/Crossfit)' : 'Grup Dersleri (Güreş/Crossfit)'}</option>
                        <option value="weight">${isEnglish ? 'Weight Control Program' : 'Kilo Kontrolü Programı'}</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 20px; color: #e0e0e0; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-calendar-alt" style="margin-right: 10px;"></i>
                        ${isEnglish ? 'Number of Months' : 'Ay Sayısı'}
                    </label>
                    <div style="position: relative;">
                        <input type="range" id="months" min="1" max="12" value="1" step="1" style="width: 100%; height: 10px; -webkit-appearance: none; background: linear-gradient(90deg, #d32f2f 0%, #ff9800 100%); border-radius: 5px; outline: none;">
                        <div style="display: flex; justify-content: space-between; color: #aaa; font-size: 14px; margin-top: 10px;">
                            <span>1</span>
                            <span style="color: #ff9800; font-weight: bold;">6</span>
                            <span>12</span>
                        </div>
                        <div id="monthsValue" style="position: absolute; top: -40px; left: 0; transform: translateX(-50%); background: #ff9800; color: white; padding: 8px 12px; border-radius: 5px; font-weight: bold; font-size: 18px; min-width: 40px; text-align: center;">
                            1
                        </div>
                    </div>
                </div>
                
                <div class="calculator-result" style="background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 30px; border-radius: 15px; margin: 40px 0; text-align: center; border: 2px solid #444; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: rgba(255, 152, 0, 0.1); border-radius: 0 0 0 100px;"></div>
                    <h3 style="color: #e0e0e0; margin-bottom: 20px; font-size: 20px; position: relative;">
                        <i class="fas fa-receipt" style="margin-right: 10px;"></i>
                        ${isEnglish ? 'ESTIMATED COST' : 'TAHSİMAT'}
                    </h3>
                    <div id="priceResult" style="font-size: 3.5rem; color: #d32f2f; font-weight: 800; line-height: 1; margin: 20px 0; text-shadow: 0 2px 10px rgba(211, 47, 47, 0.3);">4.000 ₺</div>
                    <div id="monthlyResult" style="color: #aaa; margin: 10px 0; font-size: 18px;">${isEnglish ? 'Monthly: 4.000 ₺' : 'Aylık: 4.000 ₺'}</div>
                    <div id="savings" style="color: #4caf50; margin: 15px 0; font-size: 16px; display: none;">
                        <i class="fas fa-piggy-bank"></i> 
                        <span>${isEnglish ? 'You save:' : 'Tasarruf:'}</span> 
                        <span id="savingsAmount" style="font-weight: bold;">0 ₺</span>
                        <span id="savingsPercent" style="margin-left: 10px;">(0%)</span>
                    </div>
                    <div id="recommendation" style="color: #ff9800; margin-top: 20px; font-size: 14px; font-style: italic; display: none;">
                        <i class="fas fa-lightbulb"></i> 
                        <span id="recommendationText"></span>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 30px;">
                    <button class="close-calculator-btn" style="background: #444; color: white; border: none; padding: 18px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-size: 16px;">
                        <i class="fas fa-times" style="margin-right: 10px;"></i>
                        ${isEnglish ? 'Close' : 'Kapat'}
                    </button>
                    <a href="https://wa.me/905078294704" target="_blank" rel="noopener noreferrer" class="whatsapp-calculator-btn" style="background: #25D366; color: white; text-decoration: none; padding: 18px; border-radius: 10px; text-align: center; font-weight: 600; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 15px; font-size: 16px;">
                        <i class="fab fa-whatsapp"></i> 
                        ${isEnglish ? 'Ask on WhatsApp' : 'WhatsApp\'tan Sor'}
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #aaa; font-size: 12px; text-align: center;">
                    <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                    ${isEnglish ? 'Prices include VAT. First trial is free.' : 'Fiyatlara KDV dahildir. İlk deneme ücretsizdir.'}
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Показываем модальное окно с анимацией
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Обновление значения ползунка
        const monthsInput = document.getElementById('months');
        const monthsValue = document.getElementById('monthsValue');
        
        function updateSliderValue() {
            const value = monthsInput.value;
            monthsValue.textContent = value;
            
            // Позиционирование значения над ползунком
            const percent = (value - 1) / (12 - 1) * 100;
            monthsValue.style.left = `${percent}%`;
            
            updateCalculation();
        }
        
        // Функция обновления расчета
        function updateCalculation() {
            const serviceType = document.getElementById('serviceType').value;
            const months = parseInt(monthsInput.value);
            const result = calculatePrice(serviceType, months);
            
            const serviceName = priceData[serviceType].name[isEnglish ? 'en' : 'tr'];
            const basePrice = priceData[serviceType].basePrice * months;
            
            // Обновляем отображение
            document.getElementById('priceResult').textContent = `${result.total.toLocaleString()} ₺`;
            document.getElementById('monthlyResult').textContent = 
                `${isEnglish ? 'Monthly' : 'Aylık'}: ${result.monthly.toLocaleString()} ₺`;
            
            // Показываем экономию
            const savingsElement = document.getElementById('savings');
            const savingsAmount = document.getElementById('savingsAmount');
            const savingsPercent = document.getElementById('savingsPercent');
            const recommendationElement = document.getElementById('recommendation');
            const recommendationText = document.getElementById('recommendationText');
            
            if (result.discount > 0) {
                const savings = basePrice - result.total;
                savingsAmount.textContent = `${savings.toLocaleString()} ₺`;
                savingsPercent.textContent = `(${result.discount}%)`;
                savingsElement.style.display = 'block';
                
                // Рекомендация
                if (months < 3) {
                    recommendationText.textContent = isEnglish 
                        ? `Save ${result.discount}% with 3-month package!` 
                        : `3 aylık paketle %${result.discount} tasarruf edin!`;
                    recommendationElement.style.display = 'block';
                } else {
                    recommendationElement.style.display = 'none';
                }
            } else {
                savingsElement.style.display = 'none';
                recommendationElement.style.display = 'none';
            }
            
            // Обновляем сообщение для WhatsApp
            const whatsappBtn = document.querySelector('.whatsapp-calculator-btn');
            if (whatsappBtn) {
                const message = isEnglish 
                    ? `Hello! I'm interested in ${serviceName} for ${months} month(s). The estimated price is ${result.total.toLocaleString()} TRY (${result.monthly.toLocaleString()} TRY/month). Can you give me more information?`
                    : `Merhaba! ${months} ay için ${serviceName} ile ilgileniyorum. Tahmini fiyat ${result.total.toLocaleString()} TL (${result.monthly.toLocaleString()} TL/ay). Daha fazla bilgi verebilir misiniz?`;
                
                const encodedMessage = encodeURIComponent(message);
                whatsappBtn.href = `https://wa.me/905078294704?text=${encodedMessage}`;
            }
        }
        
        // Инициализация событий
        monthsInput.addEventListener('input', updateSliderValue);
        monthsInput.addEventListener('change', updateSliderValue);
        
        document.getElementById('serviceType').addEventListener('change', updateCalculation);
        
        // Обработчики закрытия
        const closeButtons = modal.querySelectorAll('.close-calculator, .close-calculator-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeCalculator);
        });
        
        function closeCalculator() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modal.remove();
                // Возвращаем фокус на кнопку калькулятора
                calculatorBtn.focus();
            }, 300);
        }
        
        // Закрытие по клику вне окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCalculator();
            }
        });
        
        // Закрытие по ESC
        function handleEscapeKey(e) {
            if (e.key === 'Escape' && modal.parentNode) {
                closeCalculator();
                document.removeEventListener('keydown', handleEscapeKey);
            }
        }
        
        document.addEventListener('keydown', handleEscapeKey);
        
        // Фокус на первом элементе для доступности
        setTimeout(() => document.getElementById('serviceType').focus(), 100);
        
        // Инициализируем расчет
        updateSliderValue();
        updateCalculation();
        
        // Запоминаем, что калькулятор был открыт
        try {
            localStorage.setItem('calculatorOpened', 'true');
        } catch (e) {
            console.warn('Не удалось сохранить состояние калькулятора');
        }
    }
    
    // Обработчик клика на кнопку калькулятора
    calculatorBtn.addEventListener('click', createCalculatorModal);
    
    // Добавляем tooltip для кнопки калькулятора
    const tooltip = document.createElement('div');
    tooltip.className = 'calculator-tooltip';
    
    function updateCalculatorTooltip() {
        const isEnglish = document.body.classList.contains('lang-en');
        tooltip.textContent = isEnglish ? 'Price Calculator' : 'Fiyat Hesaplayıcı';
    }
    
    updateCalculatorTooltip();
    
    Object.assign(tooltip.style, {
        position: 'absolute',
        right: 'calc(100% + 15px)',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#ff9800',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        opacity: '0',
        transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: 'none',
        zIndex: '1000',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transformOrigin: 'right center'
    });
    
    calculatorBtn.appendChild(tooltip);
    
    // Обновляем tooltip при смене языка
    document.addEventListener('languageChanged', updateCalculatorTooltip);
    
    // Показываем tooltip при наведении
    calculatorBtn.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(-50%) scale(1)';
        stopAttentionAnimation();
    });
    
    calculatorBtn.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-50%) scale(0.9)';
    });
    
    // Проверяем, был ли калькулятор уже открыт
    try {
        const calculatorOpened = localStorage.getItem('calculatorOpened');
        if (!calculatorOpened) {
            // Показываем подсказку для новых пользователей
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(-50%) scale(1)';
                
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(-50%) scale(0.9)';
                }, 3000);
            }, 5000);
        }
    } catch (e) {
        console.warn('Не удалось проверить состояние калькулятора');
    }
}

// 11. Кнопка "Наверх" (УЛУЧШЕННЫЙ)
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Scroll to top');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        width: '56px',
        height: '56px',
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '22px',
        fontWeight: 'bold',
        zIndex: '998',
        boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: '0',
        transform: 'translateY(20px) scale(0.8)',
        outline: 'none'
    });
    
    document.body.appendChild(backToTopBtn);
    
    // Функция показа/скрытия кнопки
    function toggleBackToTopButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        if (scrollTop > 300) {
            backToTopBtn.style.display = 'flex';
            
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0) scale(1)';
                
                // Показываем прогресс на кнопке (опционально)
                if (scrollPercent > 10) {
                    backToTopBtn.style.background = `conic-gradient(#d32f2f ${scrollPercent}%, #333 ${scrollPercent}%)`;
                    backToTopBtn.style.background = '#d32f2f'; // Простая версия
                }
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px) scale(0.8)';
            
            setTimeout(() => {
                if (parseFloat(backToTopBtn.style.opacity) === 0) {
                    backToTopBtn.style.display = 'none';
                }
            }, 400);
        }
    }
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Плавный скролл наверх с улучшенной анимацией
    backToTopBtn.addEventListener('click', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        function scrollStep() {
            if (scrollTop > 0) {
                window.scrollTo(0, scrollTop - scrollTop / 8);
                requestAnimationFrame(scrollStep);
            }
        }
        
        // Альтернативный вариант с smooth behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Анимация нажатия кнопки
        backToTopBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            backToTopBtn.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Эффект при наведении
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.backgroundColor = '#b71c1c';
        backToTopBtn.style.transform = 'translateY(-8px) scale(1.1)';
        backToTopBtn.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.6)';
        
        // Анимация иконки
        backToTopBtn.style.fontSize = '24px';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.backgroundColor = '#d32f2f';
        backToTopBtn.style.transform = 'translateY(0) scale(1)';
        backToTopBtn.style.boxShadow = '0 4px 20px rgba(211, 47, 47, 0.4)';
        backToTopBtn.style.fontSize = '22px';
    });
    
    // Анимация появления при загрузке
    setTimeout(toggleBackToTopButton, 500);
    
    // Адаптация для мобильных устройств
    if ('ontouchstart' in window) {
        backToTopBtn.style.width = '64px';
        backToTopBtn.style.height = '64px';
        backToTopBtn.style.bottom = '25px';
        backToTopBtn.style.left = '25px';
    }
}

// 12. Дополнительные утилиты (УЛУЧШЕННЫЙ)
function initUtilities() {
    console.log('🛠️ Инициализация утилит...');
    
    try {
        // 1. Обновляем год в футере
        const yearElements = document.querySelectorAll('#currentYear');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            if (el) {
                el.textContent = currentYear;
                console.log(`✅ Обновлен год: ${currentYear}`);
            }
        });
        
        // 2. Добавляем атрибуты для доступности
        document.querySelectorAll('img:not([alt])').forEach(img => {
            if (!img.hasAttribute('alt')) {
                const parentText = img.closest('.gallery-item, .service-card, .about-image')?.textContent || '';
                const altText = parentText.trim() || 
                              img.getAttribute('title') || 
                              'THE LAND OF TRAINING - Fitness Gym';
                img.setAttribute('alt', altText);
            }
        });
        
        // 3. Улучшаем доступность кнопок
        document.querySelectorAll('button:not([type])').forEach(btn => {
            if (!btn.hasAttribute('type')) {
                btn.setAttribute('type', 'button');
            }
        });
        
        // 4. Добавляем обработчик для всех внешних ссылок
        document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.host + '"])').forEach(link => {
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
        
        // 5. Оптимизация изображений
        optimizeImages();
        
        // 6. Аналитика кликов (только для отладки)
        setupClickAnalytics();
        
        // 7. Проверка производительности
        monitorPerformance();
        
        // 8. Обработка ошибок изображений
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                console.warn('⚠️ Image failed to load:', this.src);
                this.style.opacity = '0.5';
                
                // Показываем placeholder для сломанных изображений
                if (!this.hasAttribute('data-error-handled')) {
                    this.setAttribute('data-error-handled', 'true');
                    this.style.backgroundColor = '#2a2a2a';
                    this.style.padding = '20px';
                    
                    const altText = this.alt || 'Image not available';
                    this.title = `Failed to load: ${altText}`;
                }
            });
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                console.log(`✅ Image loaded: ${this.src}`);
            });
        });
        
        // 9. Оптимизация для мобильных устройств
        optimizeForMobile();
        
        // 10. Сохранение позиции скролла
        saveScrollPosition();
        
        console.log('✅ Утилиты инициализированы');
        
    } catch (error) {
        console.error('❌ Ошибка в утилитах:', error);
    }
}

// Функция ленивой загрузки изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (lazyImages.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Загружаем изображение
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    
                    // Загружаем srcset если есть
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        delete img.dataset.srcset;
                    }
                    
                    observer.unobserve(img);
                    console.log(`🖼️ Lazy loaded: ${img.src}`);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        
        console.log(`🔍 Lazy loading initialized for ${lazyImages.length} images`);
    } else {
        // Fallback для старых браузеров
        console.log('⚠️ IntersectionObserver не поддерживается, отключаем lazy loading');
    }
}

// Оптимизация изображений
function optimizeImages() {
    // Можно добавить автоматическую оптимизацию изображений
    // Например, добавление webp формата, сжатие и т.д.
    console.log('🖼️ Оптимизация изображений...');
    
    // Добавляем blur-up эффект для больших изображений
    document.querySelectorAll('img[data-large]').forEach(img => {
        const smallSrc = img.src;
        const largeSrc = img.dataset.large;
        
        if (largeSrc) {
            const largeImage = new Image();
            largeImage.src = largeSrc;
            largeImage.onload = () => {
                img.src = largeSrc;
                img.style.filter = 'blur(0)';
                img.style.transition = 'filter 0.5s ease';
            };
            
            img.style.filter = 'blur(10px)';
        }
    });
}

// Аналитика кликов (для отладки)
function setupClickAnalytics() {
    const trackableSelectors = [
        '.service-card',
        '.pricing-card',
        '.gallery-item',
        '.btn',
        '.nav-link',
        '.lang-btn'
    ];
    
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        trackableSelectors.forEach(selector => {
            const element = target.closest(selector);
            if (element) {
                let elementName = selector.replace('.', '');
                
                if (element.classList.contains('service-card')) {
                    const title = element.querySelector('.service-title')?.textContent.trim() || 'Unknown Service';
                    console.log(`🖱️ Service clicked: ${title}`);
                } else if (element.classList.contains('pricing-card')) {
                    const title = element.querySelector('.pricing-title')?.textContent.trim() || 'Unknown Pricing';
                    console.log(`💰 Pricing clicked: ${title}`);
                } else if (element.classList.contains('btn')) {
                    const text = element.textContent.trim().substring(0, 30) || 'Button';
                    console.log(`🔘 Button clicked: ${text}...`);
                }
                
                // Можно отправлять на сервер для аналитики
                // sendClickEvent(elementName, element.textContent.trim());
            }
        });
    });
}

// Мониторинг производительности
function monitorPerformance() {
    // Измеряем время загрузки различных частей страницы
    const perfData = {
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        pageLoad: performance.timing.loadEventEnd - performance.timing.navigationStart
    };
    
    console.log('📊 Performance metrics:', perfData);
    
    // Предупреждение о медленной загрузке
    if (perfData.pageLoad > 3000) {
        console.warn('⚠️ Page load time is slow:', perfData.pageLoad, 'ms');
        
        // Можно показать уведомление пользователю
        if (perfData.pageLoad > 5000) {
            setTimeout(() => {
                console.log('🐌 Site loaded slowly, consider optimizing images and scripts');
            }, 1000);
        }
    }
}

// Оптимизация для мобильных устройств
function optimizeForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('📱 Mobile device detected, applying optimizations');
        
        // Уменьшаем анимации для экономии батареи
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            console.log('🌀 Reduced motion enabled');
        }
        
        // Предотвращаем масштабирование при фокусе на input
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('focus', () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }
}

// Сохранение позиции скролла
function saveScrollPosition() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            try {
                sessionStorage.setItem('scrollPosition', window.pageYOffset);
            } catch (e) {
                console.warn('Не удалось сохранить позицию скролла');
            }
        }, 250);
    });
    
    // Восстановление позиции при возврате
    window.addEventListener('pageshow', () => {
        try {
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition));
                    sessionStorage.removeItem('scrollPosition');
                }, 100);
            }
        } catch (e) {
            console.warn('Не удалось восстановить позицию скролла');
        }
    });
}

// Экспорт функций для глобального доступа
window.gymApp = {
    // Переключение языка
    switchLanguage: function(lang) {
        const button = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (button) {
            button.click();
            return true;
        }
        return false;
    },
    
    // Открытие WhatsApp
    openWhatsApp: function(message = '') {
        const phone = '+905078294704';
        const defaultMessage = document.body.classList.contains('lang-en') 
            ? "Hello, I would like information about THE LAND OF TRAINING gym."
            : "Merhaba, THE LAND OF TRAINING spor salonu hakkında bilgi almak istiyorum.";
        
        const finalMessage = message || defaultMessage;
        const encodedMsg = encodeURIComponent(finalMessage);
        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank', 'noopener,noreferrer');
        
        console.log('📱 WhatsApp opened with message:', finalMessage);
    },
    
    // Открытие местоположения
    openLocation: function() {
        const address = "Altıntaş, Kardeş Kentler Cd. No:50, 07122, 07112 Aksu/Antalya";
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
        
        console.log('🗺️ Location opened');
    },
    
    // Калькулятор цен
    calculatePrice: function(serviceType, months) {
        const priceData = {
            group: {
                basePrice: 4000,
                discounts: {
                    3: { total: 9000, monthly: 3000, discount: 25 },
                    6: { total: 16200, monthly: 2700, discount: 32.5 },
                    12: { total: 28800, monthly: 2400, discount: 40 }
                }
            },
            weight: {
                basePrice: 5000,
                discounts: {
                    3: { total: 13500, monthly: 4500, discount: 10 },
                    6: { total: 24000, monthly: 4000, discount: 20 },
                    12: { total: 42000, monthly: 3500, discount: 30 }
                }
            }
        };
        
        const service = priceData[serviceType];
        if (!service) return null;
        
        if (service.discounts[months]) {
            return service.discounts[months];
        }
        
        // Расчет по базовой цене
        return {
            total: service.basePrice * months,
            monthly: service.basePrice,
            discount: 0
        };
    },
    
    // Открытие галереи
    openGallery: function(index = 0) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > index) {
            galleryItems[index].click();
            return true;
        }
        return false;
    },
    
    // Показать/скрыть калькулятор
    toggleCalculator: function() {
        const calculatorBtn = document.querySelector('.calculator-btn');
        if (calculatorBtn) {
            calculatorBtn.click();
            return true;
        }
        return false;
    },
    
    // Получение информации о сайте
    getSiteInfo: function() {
        return {
            name: 'THE LAND OF TRAINING',
            phone: '+90 507 829 4704',
            address: 'Altıntaş, Kardeş Kentler Cd. No:50, 07122, 07112 Aksu/Antalya',
            currentLanguage: document.body.classList.contains('lang-en') ? 'en' : 'tr',
            loadedAt: new Date().toISOString()
        };
    },
    
    // Сброс настроек
    resetSettings: function() {
        try {
            localStorage.removeItem('selectedLang');
            localStorage.removeItem('whatsappClicks');
            localStorage.removeItem('calculatorOpened');
            sessionStorage.clear();
            
            console.log('🔄 Settings reset');
            location.reload();
            
            return true;
        } catch (e) {
            console.error('Error resetting settings:', e);
            return false;
        }
    }
};

// Добавляем глобальный обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
    
    // Можно отправить ошибку на сервер для отслеживания
    // sendErrorToServer(e.error);
    
    // Показываем дружелюбное сообщение пользователю
    if (!document.querySelector('.error-notification')) {
        const errorNotification = document.createElement('div');
        errorNotification.className = 'error-notification';
        errorNotification.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: #d32f2f; color: white; padding: 15px; border-radius: 5px; z-index: 9999; max-width: 300px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <p style="margin: 0 0 10px; font-weight: bold;">
                    <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                    Something went wrong
                </p>
                <button onclick="this.parentElement.remove()" style="background: white; color: #d32f2f; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer; font-weight: bold;">
                    Dismiss
                </button>
            </div>
        `;
        document.body.appendChild(errorNotification);
        
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.remove();
            }
        }, 5000);
    }
});

// Добавляем стили для анимаций и улучшений
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    /* Анимация загрузки */
    body:not(.loaded) {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    /* Анимация fadeIn */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Анимация pulse для кнопок */
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
        100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
    }
    
    /* Анимация scale для элементов */
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    /* Стили для активных ссылок навигации */
    .nav-link.active {
        color: #d32f2f !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    /* Улучшенные стили для ошибок форм */
    .form-error {
        animation: fadeIn 0.3s ease !important;
    }
    
    input.error, textarea.error, select.error {
        animation: shake 0.5s ease !important;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    /* Стили для мобильных устройств */
    @media (max-width: 768px) {
        .whatsapp-tooltip, .calculator-tooltip {
            display: none !important;
        }
        
        .lightbox-prev, .lightbox-next {
            width: 50px !important;
            height: 50px !important;
            font-size: 24px !important;
        }
        
        .back-to-top {
            width: 50px !important;
            height: 50px !important;
            bottom: 20px !important;
            left: 20px !important;
        }
        
        .calculator-btn {
            width: 55px !important;
            height: 55px !important;
            bottom: 140px !important;
            right: 20px !important;
        }
    }
    
    /* Стили для touch-устройств */
    @media (hover: none) and (pointer: coarse) {
        .service-card:hover, 
        .pricing-card:hover, 
        .gallery-item:hover {
            transform: none !important;
        }
        
        .btn:hover {
            transform: none !important;
        }
    }
    
    /* Стили для prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .animate {
            opacity: 1 !important;
            transform: none !important;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Инициализация при загрузке
console.log('🚀 THE LAND OF TRAINING - Enhanced version loaded!');

// Добавляем метаданные для отладки
console.log('🔧 Debug info:', {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    online: navigator.onLine,
    cookies: navigator.cookieEnabled
});