
/**
 * Guarda el documento.
 */
function addDocumentoBtnSaveClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var params = core.data.restore(f, 'params');
}

/**
 * Muestra el detalle del documento.
 */
function addDocumentoShowItems(data) {
    var gridStructure = {
        'tableTitle': 'Items del Documento',
        'columns': [
            {'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
            {'title': 'IDPARENT', 'field': 'idparent', 'width': '50px', 'hide': true},
            {'title': 'CODIGO', 'field': 'codigo', 'width': '80px', 'type': 'string'},
            {'title': 'DESCRIPCION', 'field': 'descrip', 'width': '275px', 'type': 'string'},
            {'title': 'PRECIO', 'field': 'precio', 'width': '100px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true},
            {'title': 'CANTIDAD', 'field': 'cantidad', 'width': '100px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 0, 'thousandSep': true},
            {'title': 'TOTAL', 'field': 'monto', 'width': '100px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 8,
        'onClick': (t) => {
        }
    };

    var f = '#' + core.form.dialog.getCurrent();
    core.grid.build($(".itemsBox", f), gridStructure);
}


/**
 * Agrega un nuevo item.
 */
function addDocumentoBtnAddItemClick() {
    var params = {
        id: core.getUniqueId()
    };
    core.form.dialog.show('./add-producto.php', params, () => {
        var r = core.form.dialog.getBackwardData();
        if (r.hasOwnProperty('addProducto') && r.addProducto == 1) {
            // Toma todos los registros del grid.
            var f = '#' + core.form.dialog.getCurrent();
            var d = core.grid.getAllRows($('.itemsBox', f));
            var i;

            if (Object.keys(d).length > 0) {
                // Recorre la lista de elementos.
                var found = false;
                for (i = 0; i < Object.keys(d).length; i++) {
                    if (d[i].id == r.id) {
                        found = true;
                        break;
                    }
                }
    
                if (!found) {
                    i = Object.keys(d).length;
                    d[i] = {};
                }
            } else {
                i = 0;
                d[i] = {};
            }

            // Establece los valores del registro.
            d[i].id = r.id;
            d[i].codigo = r.codigo;
            d[i].descrip = r.descrip;
            d[i].precio = r.precio;
            d[i].cantidad = r.cantidad;
            d[i].monto = r.monto;

            // Actualiza los datos del grid.
            addDocumentoShowItems(d);
        }
    });
}


/**
 * Carga los items del documento.
 */
function addDocumentoLoadItems(id) {
    core.showLoading();
    core.apiFunction('loadDetalleAbonos', {'id': id}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        addDocumentoShowItems(response.data.detalle);
    });
}

/**
 * On Load.
 */
$(() => {
    // Toma los parametros enviados al formulario.
    var f = '#' + core.form.dialog.getCurrent();
    var params = core.data.restore(f, 'params');

    core.form.setData(f, params);
    core.linkNativeEvents(f);

    $('.addDocumentoBtnAddItem', f).unbind('click');
    $('.addDocumentoBtnAddItem', f).on('click', () => {
        addDocumentoBtnAddItemClick();
    });

    $('.addDocumentoBtnSave', f).unbind('click');
    $('.addDocumentoBtnSave', f).on('click', () => {
        addDocumentoBtnSaveClick();
    });

    $('.addDocumentoBtnClose', f).unbind('click');
    $('.addDocumentoBtnClose', f).on('click', () => {
        core.form.dialog.close();
    });

    // Establece la fecha del dia por defecto.
    var r = core.transform2Json(core.form.getData('.datosBox', f));
    r.fecha = core.getDate();
    core.form.setData($('.datosBox', f), r);

    addDocumentoShowItems([]);
    addDocumentoLoadItems(params.id);
});
