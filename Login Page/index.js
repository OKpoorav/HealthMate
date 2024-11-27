        // Form Toggle Logic
        function toggleForms(showLogin) {
            const container = document.querySelector('.container');

            if (showLogin) {
                container.classList.remove('slide-left');
                container.classList.add('slide-right');
            } else {
                container.classList.remove('slide-right');
                container.classList.add('slide-left');
            }
        }

        // Event Listeners for Form Switching
        document.getElementById('toRegister').addEventListener('click', () => {
            toggleForms(false);
        });

        document.getElementById('toLogin').addEventListener('click', () => {
            toggleForms(true);
        });

        // Validation Functions
        const validateEmail = (email) => {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        };

        const validatePassword = (password) => password.length >= 8;
        const validateName = (name) => name.trim().length > 0;

        // Form Validation Setup
        function setupFormValidation(formId) {
            const form = document.getElementById(formId);
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const value = input.value.trim();
                    const inputType = input.type;
                    const errorContainer = input.parentElement;
                    let isValid = false;

                    switch(inputType) {
                        case 'email':
                            isValid = validateEmail(value);
                            break;
                        case 'password':
                            isValid = validatePassword(value);
                            break;
                        case 'text':
                            isValid = validateName(value);
                            break;
                    }

                    errorContainer.classList.toggle('error', !isValid);
                });
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let formIsValid = true;

                inputs.forEach(input => {
                    const value = input.value.trim();
                    const inputType = input.type;
                    const errorContainer = input.parentElement;
                    let isValid = false;

                    switch(inputType) {
                        case 'email':
                            isValid = validateEmail(value);
                            break;
                        case 'password':
                            isValid = validatePassword(value);
                            break;
                        case 'text':
                            isValid = validateName(value);
                            break;
                    }

                    errorContainer.classList.toggle('error', !isValid);
                    formIsValid = formIsValid && isValid;
                });

                if (formIsValid) {
                    alert(`${formId === 'loginForm' ? 'Login' : 'Registration'} submitted successfully!`);
                }
            });
        }

        // Initialize form validations
        setupFormValidation('loginForm');
        setupFormValidation('registerForm');

        // Social Login Handlers
        ['googleLogin', 'googleRegister', 'appleLogin', 'appleRegister'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                alert(`Simulated ${id.includes('google') ? 'Google' : 'Apple'} login`);
            });
        });
