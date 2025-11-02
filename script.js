// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {

    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ НАВИГАЦИОННЫХ ССЫЛОК =====
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Закрываем мобильное меню, если оно открыто
                nav.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Вычисляем позицию с учетом фиксированного хедера
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== БУРГЕР-МЕНЮ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ =====
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    navToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Закрываем меню при клике на ссылку (уже обработано выше) или вне меню
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // ===== КАРУСЕЛЬ ОТЗЫВОВ =====
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        // Скрываем все отзывы
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        testimonialBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Показываем выбранный отзыв
        testimonials[index].classList.add('active');
        testimonialBtns[index].classList.add('active');
        currentTestimonial = index;
    }

    // Обработчики для кнопок навигации карусели
    testimonialBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // Автопрокрутка отзывов каждые 5 секунд
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
    const contactForm = document.getElementById('contact-form');
    const formOutput = document.getElementById('form-output');

    // Валидация в реальном времени
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    nameInput.addEventListener('input', function() {
        if (nameInput.validity.valid) {
            nameError.textContent = '';
            nameInput.style.borderColor = '#ddd';
        } else {
            showNameError();
        }
    });

    emailInput.addEventListener('input', function() {
        if (emailInput.validity.valid) {
            emailError.textContent = '';
            emailInput.style.borderColor = '#ddd';
        } else {
            showEmailError();
        }
    });

    function showNameError() {
        if (nameInput.validity.valueMissing) {
            nameError.textContent = 'Пожалуйста, введите ваше имя.';
        } else if (nameInput.validity.tooShort) {
            nameError.textContent = `Имя должно содержать минимум ${nameInput.minLength} символов. Вы ввели ${nameInput.value.length}.`;
        }
        nameInput.style.borderColor = '#ff6b6b';
    }

    function showEmailError() {
        if (emailInput.validity.valueMissing) {
            emailError.textContent = 'Пожалуйста, введите ваш email.';
        } else if (emailInput.validity.typeMismatch) {
            emailError.textContent = 'Введите корректный email адрес.';
        }
        emailInput.style.borderColor = '#ff6b6b';
    }

    // Обработка отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращаем реальную отправку
        
        // Проверяем валидность HTML5
        let isValid = true;
        
        if (!nameInput.validity.valid) {
            showNameError();
            isValid = false;
        }
        
        if (!emailInput.validity.valid) {
            showEmailError();
            isValid = false;
        }
        
        if (!isValid) {
            alert('Пожалуйста, исправьте ошибки в форме.');
            return;
        }
        
        // Собираем данные формы
        const formData = new FormData(contactForm);
        const formObject = {};
        
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Имитация отправки на сервер - сохраняем в localStorage
        saveToLocalStorage(formObject);
        
        // Показываем данные формы на странице
        displayFormData(formObject);
        
        // Очищаем форму
        contactForm.reset();
        
        // Показываем сообщение об успехе
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
    });

    function saveToLocalStorage(data) {
        // Получаем существующие заявки или создаем новый массив
        let applications = JSON.parse(localStorage.getItem('weddingApplications')) || [];
        
        // Добавляем новую заявку с временной меткой
        data.timestamp = new Date().toISOString();
        applications.push(data);
        
        // Сохраняем обратно в localStorage
        localStorage.setItem('weddingApplications', JSON.stringify(applications));
        
        console.log('Данные сохранены в localStorage:', data);
    }

    function displayFormData(data) {
        let outputHTML = '<h3>Данные вашей заявки:</h3><ul>';
        
        for (let key in data) {
            if (key !== 'timestamp') {
                let label = contactForm.querySelector(`[name="${key}"]`).previousElementSibling.textContent;
                outputHTML += `<li><strong>${label}</strong>: ${data[key]}</li>`;
            }
        }
        
        outputHTML += '</ul>';
        formOutput.innerHTML = outputHTML;
        formOutput.style.display = 'block';
        
        // Плавно прокручиваем к выводу данных
        formOutput.scrollIntoView({ behavior: 'smooth' });
    }

    // ===== КНОПКА "ЗАБРОНИРОВАТЬ" В ХЕДЕРЕ =====
    const bookNowBtn = document.getElementById('book-now-btn');
    bookNowBtn.addEventListener('click', function() {
        // Плавно скроллим к форме контактов
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    // ===== ИЗМЕНЕНИЕ СТИЛЯ ХЕДЕРА ПРИ СКРОЛЛЕ =====
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

});