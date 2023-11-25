
/**
 * Muestra el menu principal.
 */
function showMenu() {
    var menuStructure = {
        'title': 'Menú Principal',
        'tags': [
            {
                'icon': 'icon icon-home3',
                'text': 'Inicio',
                'command': () => {
                    core.loadHTML('.homeBodyWorkArea', './start.php');
                },
                'options': []
            },
            {
                'icon': 'icon icon-earth',
                'text': 'Acceso al Sistema',
                'command': () => {},
                'options': [
                    {
                        'text': 'Acceso de usuarios',
                        'command': () => {
                            core.loadHTML('.homeBodyWorkArea', './login.php');
                        }
                    }
                ]
            }
        ]
    };
    
    core.menu.build('.homeBodyMenuArea', menuStructure);
}

/**
 * On load.
 */
$(() => {
    showMenu();
});
