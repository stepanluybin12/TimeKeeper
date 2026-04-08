document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    if (!form) {
        return;
    }

    // Элементы формы
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const topic = document.getElementById('topic');
    const message = document.getElementById('message');
    const consent = document.getElementById('consent');

   
    function showError(input, message) {
        // Удаляем предыдущую ошибку
        clearError(input);
        // Добавляем класс is-invalid
        input.classList.add('is-invalid');
        // Создаём блок с сообщением
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        input.insertAdjacentElement('afterend', feedback);
    }

    function clearError(input) {
        input.classList.remove('is-invalid');
        const next = input.nextElementSibling;
        if (next && next.classList && next.classList.contains('invalid-feedback')) {
            next.remove();
        }
    }

    // Сброс ошибок при вводе
    const allInputs = [fullname, email, topic, message];
    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                clearError(this);
            });
        }
    });
    if (consent) {
        consent.addEventListener('change', function() {
            // Удаляем ошибку под чекбоксом
            const container = this.closest('.form-check');
            if (container) {
                const feedback = container.querySelector('.invalid-feedback');
                if (feedback) feedback.remove();
            }
            this.classList.remove('is-invalid');
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Сброс всех старых ошибок
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

        let isValid = true;

        // 1. ФИО (не пусто, минимум 2 слова)
        const fullnameValue = fullname.value.trim();
        if (fullnameValue === '') {
            showError(fullname, 'Введите фамилию и имя');
            isValid = false;
        } else if (fullnameValue.split(/\s+/).length < 2) {
            showError(fullname, 'Введите фамилию и имя (минимум два слова)');
            isValid = false;
        }

        // 2. Email
        const emailValue = email.value.trim();
        if (emailValue === '') {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
            showError(email, 'Введите корректный email (например, name@domain.ru)');
            isValid = false;
        }

        // 3. Тема (выпадающий список)
        const topicValue = topic.value;
        if (!topicValue || topicValue === 'Выберите тему') {
            showError(topic, 'Пожалуйста, выберите тему обращения');
            isValid = false;
        }

        // 4. Чекбокс согласия
        if (!consent.checked) {
            const container = consent.closest('.form-check');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'Необходимо согласие на обработку персональных данных';
            container.appendChild(feedback);
            consent.classList.add('is-invalid');
            isValid = false;
        }

        // 5. Сообщение
        const messageValue = message.value.trim();

        // Если всё корректно – отправляем событие
        if (isValid) {
            const formData = {
                fullname: fullnameValue,
                email: emailValue,
                topic: topic.options[topic.selectedIndex]?.text || topicValue,
                message: messageValue || '(не заполнено)',
                consent: consent.checked
            };
            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);
            alert('Форма отправлена! Данные в консоли.');
        }
    });
});