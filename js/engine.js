/**
 * Muestra el menu principal.
 */
function showMenu() {
    var menuStructure = {
        'title': 'Menú Principal',
        'tags': [
            {
                'icon': 'icon icon-books',
                'text': 'Archivo',
                'command': () => {},
                'options': [
                    {
                        'text': 'Monedas',
                        'command': () => {
                            core.tabs.build('.engineBodyWorkArea', 'Monedas', './monedas.php', true);
                        }
                    },
                    {
                        'text': 'Empresas',
                        'command': () => {

                        }
                    },
                    {
                        'text': 'Clientes',
                        'command': () => {

                        }
                    }
                ]
            },
            {
                'icon': 'icon icon-database',
                'text': 'Procesos',
                'command': () => {},
                'options': [
                    {
                        'text': 'Cuentas por Cobrar',
                        'command': () => {

                        }
                    }
                ]
            },
            {
                'icon': 'icon icon-file-pdf',
                'text': 'Reportes',
                'command': () => {},
                'options': [
                    {
                        'text': 'Estado de Cuenta Cliente',
                        'command': () => {

                        }
                    },
                    {
                        'text': 'General de Saldos',
                        'command': () => {

                        }
                    },
                ]
            },
            {
                'icon': 'icon icon-user',
                'text': 'Usuario',
                'command': () => {},
                'options': [
                    {
                        'text': 'Cambiar E-Mail',
                        'command': () => {

                        }
                    },
                    {
                        'text': 'Cambiar Contraseña',
                        'command': () => {

                        }
                    },
                    {
                        'text': 'Cerrar Sesión',
                        'command': () => {
                            core.showConfirm({
                                'icon': 'icon icon-lock',
                                'title': 'Cerrar Sesión',
                                'message': 'Se dispone a cerrar la sesión actual, ¿esta seguro?',
                                'callbackOk': () => {
                                    core.showLoading();
                                    core.apiFunction('logout', {}, (response) => {
                                        core.hideLoading();
                                        core.showMessage(response.message, 2, core.color.success, () => {
                                            window.location.href = './index.php';
                                        });
                                    });
                                }
                            });
                        }
                    }
                ]
            }
        ]
    };
    
    core.menu.build('.engineBodyMenuArea', menuStructure);
}

/**
 * On load.
 */
$(() => {
    showMenu();
});
