// src/content-script.js

console.log("Key+ Content Script v2 cargado.");

function findAssociatedUsernameField(passwordField) {
    const form = passwordField.closest('form');
    if (!form) return null;

    // Lista de posibles nombres y atributos para campos de usuario/email
    const userFieldSelectors = [
        'input[type="email"]',
        'input[name*="user"]',
        'input[name*="email"]',
        'input[id*="user"]',
        'input[id*="email"]',
        'input[autocomplete*="username"]',
        'input[aria-label*="user"]',
        'input[aria-label*="email"]',
        'input[placeholder*="user"]',
        'input[placeholder*="email"]',
    ];

    for (const selector of userFieldSelectors) {
        const field = form.querySelector(selector);
        if (field && field !== passwordField) {
        return field;
        }
    }

    // Como último recurso, busca el input de texto anterior al de la contraseña
    const inputs = Array.from(form.querySelectorAll('input'));
    const passwordIndex = inputs.indexOf(passwordField);
    if (passwordIndex > 0) {
        for (let i = passwordIndex - 1; i >= 0; i--) {
        if (inputs[i].type === 'text' || inputs[i].type === 'email') {
            return inputs[i];
        }
        }
    }
    
    return null;
    }

    document.addEventListener('focusin', (event) => {
    const field = event.target;
    // Solo actuar sobre campos de contraseña que estén visibles
    if (field.tagName === 'INPUT' && field.type === 'password' && field.offsetParent !== null) {
        
    // Evita añadir el botón si ya existe
    if (document.getElementById('keyplus-autofill-btn')) return;

    console.log('Campo de contraseña detectado. Ofreciendo autocompletado...');
    
    const button = document.createElement('button');
    button.id = 'keyplus-autofill-btn';
    button.style.position = 'absolute';
    button.style.right = '5px';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.padding = '4px';
    button.style.lineHeight = '0';
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 448 512" style="fill: #f97316;"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`;
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    field.parentNode.insertBefore(wrapper, field);
    wrapper.appendChild(field);
    wrapper.appendChild(button);

    button.addEventListener('click', (e) => {
        e.preventDefault();

        // PISTA 1: ¿Se está enviando la petición?
        console.log('[Key+] Enviando petición para autocompletar en:', window.location.href);

        chrome.runtime.sendMessage(
            { type: 'GET_CREDENTIALS', url: window.location.href },
            (response) => {

            // PISTA 2: ¿Llegó alguna respuesta? ¿Qué contenía?
            console.log('[Key+] Respuesta recibida del background:', response);
            
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }

            if (response && response.email && response.password) {
                const usernameField = findAssociatedUsernameField(field);
                if (usernameField) {
                usernameField.value = response.email;
                // Disparamos un evento 'input' para que sitios como React lo detecten
                usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                }
                field.value = response.password;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                console.log('No se encontraron credenciales para este sitio.');
            }
            }
        );
        });

        // Limpiar el botón cuando el usuario sale del campo
        field.addEventListener('focusout', () => {
            setTimeout(() => {
                if (!wrapper.contains(document.activeElement)) {
                    // ✅ AÑADIMOS ESTA LÍNEA DE VERIFICACIÓN
                    if (wrapper.parentNode) {
                        button.remove();
                        // Devolvemos el input a su lugar original en el DOM
                        wrapper.parentNode.insertBefore(field, wrapper);
                        wrapper.remove();
                    } else {
                        // Si el padre ya no existe, simplemente eliminamos el botón
                        button.remove();
                    }
                }
            }, 100);
        });
    }
});