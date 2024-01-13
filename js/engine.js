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
                            core.tabs.build('.engineBodyWorkArea', 'Empresas', './empresas.php', true);
                        }
                    },
                    {
                        'text': 'Clientes',
                        'command': () => {
                            core.tabs.build('.engineBodyWorkArea', 'Clientes', './clientes.php', true);
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
                            core.tabs.build('.engineBodyWorkArea', 'Cuentas por Cobrar', './cxc.php', true);
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
                        'text': 'General de Saldos',
                        'command': () => {
                            core.tabs.build('.engineBodyWorkArea', 'Reporte General de Saldos', './rep-general-saldos.php', true);
                        }
                    },
                    {
                        'text': 'Movimientos por Periodo',
                        'command': () => {
                            core.tabs.build('.engineBodyWorkArea', 'Reporte Movimientos por Periodo', './rep-movimientos-periodo.php', true);
                        }
                    }
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
                            core.tabs.build('.engineBodyWorkArea', 'Cambio de Correo Electrónico', './change-email-01.php', true);
                        }
                    },
                    {
                        'text': 'Cambiar Contraseña',
                        'command': () => {
                            core.tabs.build('.engineBodyWorkArea', 'Cambio de Contraseña', './change-pwd.php', true);
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
