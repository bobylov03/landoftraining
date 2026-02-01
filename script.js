// DOM готов
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initMobileMenu();
    initLanguageSwitcher();
    initSmoothScroll();
    initAnimations();
    initHeaderScroll();
    initWhatsAppButtons();
    initMapFunctions();
    initGalleryLightbox();
    initFormValidation();
    initPriceCalculator();
    initBackToTop();
    
    console.log('THE LAND OF TRAINING сайт успешно загружен!');
});

// 1. Мобильное меню
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // Открытие/закрытие меню
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Блокировка скролла при открытом меню
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = navMenu.contains(e.target) || hamburger.contains(e.target);
        const isMenuActive = navMenu.classList.contains('active');
        
        if (!isClickInsideMenu && isMenuActive) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// 2. Переключение языка
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const body = document.body;
    const htmlElement = document.documentElement;
    
    if (langButtons.length === 0) return;
    
    // Функция переключения языка
    function switchLanguage(lang) {
        // Удаляем активный класс у всех кнопок
        langButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс к выбранной кнопке
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
        
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
        
        // Сохраняем выбор языка в localStorage
        localStorage.setItem('selectedLang', lang);
        
        // Отправляем событие о смене языка
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
    
    // Обработчик клика на кнопки языка
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.getAttribute('data-lang');
            switchLanguage(selectedLang);
        });
    });
    
    // Проверка сохраненного языка при загрузке
    const savedLang = localStorage.getItem('selectedLang');
    const browserLang = navigator.language.substring(0, 2);
    
    if (savedLang) {
        switchLanguage(savedLang);
    } else if (browserLang === 'en') {
        // Если браузер на английском, переключаем на английский
        switchLanguage('en');
    } else {
        // По умолчанию турецкий
        switchLanguage('tr');
    }
}

// 3. Плавная прокрутка
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем пустые ссылки и якорь "#"
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Рассчитываем позицию с учетом высоты фиксированного хедера
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 10;
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, href);
            }
        });
    });
}

// 4. Анимации при скролле
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .gallery-item, .info-item, .about-text, .about-image, .map-placeholder'
    );
    
    if (animatedElements.length === 0) return;
    
    // Создаем Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс для анимации
                entry.target.classList.add('animate');
                
                // Если это карточка цен с featured классом, добавляем небольшую задержку
                if (entry.target.classList.contains('featured')) {
                    entry.target.style.transitionDelay = '0.2s';
                }
                
                // Прекращаем наблюдение после появления
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Начинаем наблюдение за элементами
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 5. Изменение шапки при скролле
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const langSwitcher = document.querySelector('.lang-switcher');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Изменение фона шапки
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
            
            // Прячем языковой переключатель при скролле вниз
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                if (langSwitcher) {
                    langSwitcher.style.transform = 'translateY(-100px)';
                    langSwitcher.style.opacity = '0';
                }
            } else {
                if (langSwitcher) {
                    langSwitcher.style.transform = 'translateY(0)';
                    langSwitcher.style.opacity = '1';
                }
            }
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
            
            if (langSwitcher) {
                langSwitcher.style.transform = 'translateY(0)';
                langSwitcher.style.opacity = '1';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// 6. WhatsApp кнопки и функционал
function initWhatsAppButtons() {
    const phoneNumber = '+905078294704';
    
    // Создаем сообщение по умолчанию
    function getDefaultMessage() {
        const isTurkish = document.body.classList.contains('lang-en') ? false : true;
        
        if (isTurkish) {
            return "Merhaba, THE LAND OF TRAINING spor salonu hakkında bilgi almak istiyorum.";
        } else {
            return "Hello, I would like to get information about THE LAND OF TRAINING gym.";
        }
    }
    
    // Обработчик для всех WhatsApp кнопок
    document.querySelectorAll('a[href*="whatsapp"], .whatsapp-btn').forEach(btn => {
        // Заменяем номер телефона, если он другой
        if (btn.href.includes('whatsapp.com')) {
            const encodedMessage = encodeURIComponent(getDefaultMessage());
            btn.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        }
        
        // Добавляем счетчик кликов
        btn.addEventListener('click', function(e) {
            // Сохраняем статистику кликов
            let whatsappClicks = localStorage.getItem('whatsappClicks') || 0;
            whatsappClicks = parseInt(whatsappClicks) + 1;
            localStorage.setItem('whatsappClicks', whatsappClicks);
            
            // Отправляем событие в Google Analytics (если есть)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': 'whatsapp_contact'
                });
            }
            
            console.log(`WhatsApp clicked ${whatsappClicks} times`);
        });
    });
    
    // Плавающая кнопка WhatsApp с анимацией
    const floatBtn = document.querySelector('.whatsapp-float');
    if (floatBtn) {
        // Добавляем эффект пульсации
        setInterval(() => {
            floatBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                floatBtn.style.transform = 'scale(1)';
            }, 300);
        }, 3000);
        
        // Добавляем tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'whatsapp-tooltip';
        tooltip.textContent = document.body.classList.contains('lang-en') 
            ? 'Contact us on WhatsApp' 
            : 'Bize WhatsApp\'tan ulaşın';
        tooltip.style.cssText = `
            position: absolute;
            right: 80px;
            top: 50%;
            transform: translateY(-50%);
            background: #25D366;
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 1001;
        `;
        
        floatBtn.parentNode.insertBefore(tooltip, floatBtn.nextSibling);
        
        // Показываем tooltip при наведении
        floatBtn.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        
        floatBtn.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }
}

// 7. Функции карты и местоположения
function initMapFunctions() {
    const address = "Altıntaş, Kardeş Kentler Cd. No:50, 07122, 07112 Aksu/Antalya";
    
    // Функция открытия Google Maps
    function openGoogleMaps(locationAddress = address) {
        const encodedAddress = encodeURIComponent(locationAddress);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        
        // Открываем в новой вкладке
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
        
        // Логируем открытие карты
        console.log('Opening Google Maps for address:', locationAddress);
    }
    
    // Обработчики для всех кликабельных адресов
    document.querySelectorAll('.location-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const locationAddress = this.getAttribute('data-location') || this.textContent.trim();
            openGoogleMaps(locationAddress);
        });
        
        // Добавляем указатель курсора
        link.style.cursor = 'pointer';
    });
    
    // Обработчик для кнопки карты
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
        mapPlaceholder.addEventListener('click', function(e) {
            e.preventDefault();
            openGoogleMaps();
        });
        
        // Добавляем интерактивные эффекты
        mapPlaceholder.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            const overlay = this.querySelector('.map-overlay');
            if (overlay) {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            }
        });
        
        mapPlaceholder.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.map-overlay');
            if (overlay) {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }
        });
    }
    
    // Определение местоположения пользователя (опционально)
    if (navigator.geolocation) {
        const locationBtn = document.createElement('button');
        locationBtn.className = 'btn location-btn';
        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> <span class="tr-lang">Konumumu Göster</span><span class="en-lang">Show My Location</span>';
        locationBtn.style.cssText = `
            margin-top: 15px;
            background-color: #4285f4;
            font-size: 14px;
            padding: 10px 20px;
        `;
        
        locationBtn.addEventListener('click', function() {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodeURIComponent(address)}`;
                    window.open(mapsUrl, '_blank');
                },
                (error) => {
                    alert(document.body.classList.contains('lang-en') 
                        ? 'Unable to get your location. Please check your browser settings.' 
                        : 'Konumunuz alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin.'
                    );
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

// 8. Галерея с лайтбоксом
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 5px;
        transform: scale(0.9);
        transition: transform 0.3s;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 2001;
    `;
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '❮';
    prevBtn.style.cssText = `
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 2001;
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '❯';
    nextBtn.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 2001;
    `;
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    
    // Открытие лайтбокса
    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.style.display = 'flex';
        
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 10);
        
        // Блокировка скролла
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие лайтбокса
    function closeLightbox() {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Переход к следующему изображению
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    }
    
    // Переход к предыдущему изображению
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    }
    
    // Добавляем обработчики для элементов галереи
    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Обработчики для кнопок лайтбокса
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Закрытие по клику на фон
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Управление клавиатурой
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
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
            }
        }
    });
}

// 9. Валидация форм (для будущих форм)
function initFormValidation() {
    // Если на сайте будут формы, можно добавить валидацию
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#d32f2f';
                    
                    // Убираем красную рамку при вводе
                    input.addEventListener('input', function() {
                        this.style.borderColor = '';
                    });
                }
            });
            
            if (isValid) {
                // Здесь можно добавить отправку формы
                console.log('Form submitted successfully');
                
                // Показываем сообщение об успехе
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.textContent = document.body.classList.contains('lang-en') 
                    ? 'Thank you! Your message has been sent.' 
                    : 'Teşekkürler! Mesajınız gönderildi.';
                successMsg.style.cssText = `
                    background-color: #4caf50;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 15px;
                    text-align: center;
                `;
                
                form.appendChild(successMsg);
                
                // Очищаем форму
                setTimeout(() => {
                    form.reset();
                    successMsg.remove();
                }, 3000);
            } else {
                // Показываем сообщение об ошибке
                const errorMsg = document.createElement('div');
                errorMsg.className = 'form-error';
                errorMsg.textContent = document.body.classList.contains('lang-en') 
                    ? 'Please fill in all required fields.' 
                    : 'Lütfen tüm gerekli alanları doldurun.';
                errorMsg.style.cssText = `
                    background-color: #d32f2f;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 15px;
                    text-align: center;
                `;
                
                // Удаляем предыдущие сообщения об ошибках
                const oldError = form.querySelector('.form-error');
                if (oldError) oldError.remove();
                
                form.appendChild(errorMsg);
                
                // Удаляем сообщение через 3 секунды
                setTimeout(() => {
                    errorMsg.remove();
                }, 3000);
            }
        });
    });
}

// 10. Калькулятор цен
function initPriceCalculator() {
    const calculatorBtn = document.createElement('button');
    calculatorBtn.className = 'btn calculator-btn';
    calculatorBtn.innerHTML = '<i class="fas fa-calculator"></i> <span class="tr-lang">Fiyat Hesapla</span><span class="en-lang">Calculate Price</span>';
    calculatorBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background-color: #ff9800;
        z-index: 999;
        padding: 12px 20px;
        box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
    `;
    
    document.body.appendChild(calculatorBtn);
    
    calculatorBtn.addEventListener('click', function() {
        // Создаем модальное окно калькулятора
        const modal = document.createElement('div');
        modal.className = 'calculator-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'calculator-content';
        modalContent.style.cssText = `
            background: var(--darker-color);
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s;
            border: 2px solid var(--primary-color);
        `;
        
        const isTurkish = !document.body.classList.contains('lang-en');
        
        modalContent.innerHTML = `
            <h2 style="margin-bottom: 20px; color: var(--light-color);">${isTurkish ? 'FİYAT HESAPLAMA' : 'PRICE CALCULATOR'}</h2>
            
            <div class="calculator-form">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-color);">
                        ${isTurkish ? 'Hizmet Türü' : 'Service Type'}
                    </label>
                    <select id="serviceType" style="width: 100%; padding: 10px; background: var(--gray-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 20px;">
                        <option value="group">${isTurkish ? 'Grup Dersleri (Güreş/Crossfit)' : 'Group Classes (Wrestling/Crossfit)'}</option>
                        <option value="weight">${isTurkish ? 'Kilo Kontrolü' : 'Weight Control'}</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-color);">
                        ${isTurkish ? 'Ay Sayısı' : 'Number of Months'}
                    </label>
                    <input type="range" id="months" min="1" max="12" value="1" style="width: 100%; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; color: var(--text-color);">
                        <span>1</span>
                        <span id="monthsValue">1</span>
                        <span>12</span>
                    </div>
                </div>
                
                <div class="result" style="background: var(--gray-color); padding: 20px; border-radius: 5px; margin-top: 20px; text-align: center;">
                    <h3 style="color: var(--light-color); margin-bottom: 10px;">${isTurkish ? 'TAHSİMAT' : 'ESTIMATE'}</h3>
                    <div id="priceResult" style="font-size: 2.5rem; color: var(--primary-color); font-weight: bold;">4.000 ₺</div>
                    <div id="monthlyResult" style="color: var(--text-color); margin-top: 10px;">${isTurkish ? 'Aylık: 4.000 ₺' : 'Monthly: 4.000 ₺'}</div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button id="closeCalculator" class="btn" style="flex: 1; background: var(--gray-color);">${isTurkish ? 'Kapat' : 'Close'}</button>
                    <a href="https://wa.me/905078294704" target="_blank" class="btn" style="flex: 1; background: #25D366; color: white; text-decoration: none; text-align: center;">
                        <i class="fab fa-whatsapp"></i> ${isTurkish ? 'WhatsApp\'tan Sor' : 'Ask on WhatsApp'}
                    </a>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Показываем модальное окно
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Функция расчета цены
        function calculatePrice() {
            const serviceType = document.getElementById('serviceType').value;
            const months = parseInt(document.getElementById('months').value);
            
            let price = 0;
            let monthlyPrice = 0;
            
            if (serviceType === 'group') {
                // Групповые занятия
                if (months === 1) {
                    price = 4000;
                    monthlyPrice = 4000;
                } else if (months === 3) {
                    price = 9000;
                    monthlyPrice = 3000;
                } else if (months === 6) {
                    price = 16200;
                    monthlyPrice = 2700;
                } else if (months === 12) {
                    price = 28800;
                    monthlyPrice = 2400;
                } else {
                    // Интерполяция для других значений
                    if (months < 3) {
                        price = 4000 * months;
                        monthlyPrice = 4000;
                    } else if (months < 6) {
                        price = 9000 + (months - 3) * 3000;
                        monthlyPrice = price / months;
                    } else if (months < 12) {
                        price = 16200 + (months - 6) * 2700;
                        monthlyPrice = price / months;
                    } else {
                        price = 28800 + (months - 12) * 2400;
                        monthlyPrice = price / months;
                    }
                }
            } else if (serviceType === 'weight') {
                // Контроль веса
                if (months === 1) {
                    price = 5000;
                    monthlyPrice = 5000;
                } else if (months === 3) {
                    price = 13500;
                    monthlyPrice = 4500;
                } else if (months === 6) {
                    price = 24000;
                    monthlyPrice = 4000;
                } else {
                    if (months < 3) {
                        price = 5000 * months;
                        monthlyPrice = 5000;
                    } else if (months < 6) {
                        price = 13500 + (months - 3) * 4500;
                        monthlyPrice = price / months;
                    } else {
                        price = 24000 + (months - 6) * 4000;
                        monthlyPrice = price / months;
                    }
                }
            }
            
            // Обновляем отображение
            document.getElementById('priceResult').textContent = `${price.toLocaleString()} ₺`;
            document.getElementById('monthlyResult').textContent = 
                `${isTurkish ? 'Aylık' : 'Monthly'}: ${Math.round(monthlyPrice).toLocaleString()} ₺`;
        }
        
        // Обработчики событий
        document.getElementById('months').addEventListener('input', function() {
            document.getElementById('monthsValue').textContent = this.value;
            calculatePrice();
        });
        
        document.getElementById('serviceType').addEventListener('change', calculatePrice);
        
        document.getElementById('closeCalculator').addEventListener('click', function() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Закрытие по клику вне окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Инициализируем расчет
        calculatePrice();
    });
}

// 11. Кнопка "Наверх"
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                backToTopBtn.style.display = 'none';
            }, 300);
        }
    });
    
    // Плавный скролл наверх
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Эффект при наведении
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.backgroundColor = '#b71c1c';
        backToTopBtn.style.transform = 'translateY(-5px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.backgroundColor = 'var(--primary-color)';
        backToTopBtn.style.transform = 'translateY(0)';
    });
}

// 12. Дополнительные утилиты
function initUtilities() {
    // Обновляем год в футере
    const yearElements = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        if (el.textContent.includes('2023')) {
            el.textContent = el.textContent.replace('2023', currentYear);
        }
    });
    
    // Добавляем атрибуты для доступности
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'THE LAND OF TRAINING');
        }
    });
    
    // Отслеживание событий
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Отслеживание кликов по услугам
        if (target.closest('.service-card')) {
            const serviceTitle = target.closest('.service-card').querySelector('.service-title').textContent;
            console.log(`Service clicked: ${serviceTitle.trim()}`);
        }
        
        // Отслеживание кликов по ценам
        if (target.closest('.pricing-card')) {
            const pricingTitle = target.closest('.pricing-card').querySelector('.pricing-title').textContent;
            console.log(`Pricing clicked: ${pricingTitle.trim()}`);
        }
    });
}

// Инициализация утилит после загрузки DOM
setTimeout(initUtilities, 1000);

// Экспорт функций для глобального доступа (если нужно)
window.gymApp = {
    switchLanguage: function(lang) {
        const buttons = document.querySelectorAll('.lang-btn');
        const button = Array.from(buttons).find(btn => btn.getAttribute('data-lang') === lang);
        if (button) button.click();
    },
    openWhatsApp: function(message = '') {
        const phone = '+905078294704';
        const encodedMsg = encodeURIComponent(message || getDefaultMessage());
        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
    },
    calculatePrice: function(serviceType, months) {
        // Логика расчета цены
        console.log(`Calculating price for ${serviceType}, ${months} months`);
    }
};