// serviceWorker.js
// Это стандартный service worker для CRA.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname === '127.0.0.1'
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // Проверяем, что можем зарегистрировать service worker
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // Это localhost, регистрируем service worker только в production
                checkValidServiceWorker(swUrl, config);
            } else {
                // Для других случаев
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('Контент обновлен для оффлайн режима');
                                if (config && config.onUpdate) {
                                    config.onUpdate(registration);
                                }
                            } else {
                                console.log('Контент загружен для первого раза');
                                if (config && config.onSuccess) {
                                    config.onSuccess(registration);
                                }
                            }
                        }
                    };
                }
            };
        })
        .catch(error => {
            console.error('Ошибка регистрации Service Worker: ', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (response.status === 404 || (contentType && contentType.indexOf('javascript') === -1)) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log('Нет подключения к интернету. Работает в оффлайн режиме.');
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}
