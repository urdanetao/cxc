
/**
 * Muestra los productos a seleccionar.
 */
function selectProductoShowData(data) {
    var f = '#' + core.form.dialog.getCurrent();
    var gridStructure = {
        'tableTitle': 'Lista de Productos',
        'columns': [
            {'title': 'CODIGO', 'field': 'codigo', 'width': '120px', 'type': 'string'},
            {'title': 'DESCRIPCION', 'field': 'descrip', 'width': '350px', 'type': 'string'}
        ],
        'rows': data,
        'showMaxRows': 10,
        'onClick': (t) => {}
    };

    core.grid.build($('.productosBox', f), gridStructure);
}

/**
 * Seleccion de un producto.
 */
function selectProductoBtnSelectClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.grid.getSelectedRow($('.productosBox', f));

    if (!r.hasOwnProperty('codigo')) {
        core.showMessage('Debe seleccionar un registro', 4, core.color.error);
        return;
    }

    core.form.dialog.setBackwardData(r);
    core.form.dialog.close();
}

/**
 * Si cierran el formulario sin seleccionar.
 */
function selectProductoBtnCloseClick() {
    var r = {
        codigo: '',
        descrip: ''
    };
    core.form.dialog.setBackwardData(r);
    core.form.dialog.close();
}

/**
 * On Load.
 */
$(() => {
    var f = '#' + core.form.dialog.getCurrent();

    $('.selectProductoBtnSelect', f).unbind('click');
    $('.selectProductoBtnSelect', f).on('click', () => {
        selectProductoBtnSelectClick();
    });

    $('.selectProductoBtnClose', f).unbind('click');
    $('.selectProductoBtnClose', f).on('click', () => {
        selectProductoBtnCloseClick();
    });

    var data = core.data.restore(f, 'params');
    selectProductoShowData(data);
});
