
/**
 * Guarda el documento.
 */
function addDocumentoBtnSaveClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));
    var d = core.grid.getAllRows($('.itemsBox', f));
    var deletedItems = core.transform2Json(core.data.restore(f, 'deletedItems'));
    var params = {
        'r': r,
        'd': d,
        'deletedItems': deletedItems
    };

    core.showLoading();
    core.apiFunction('documentosSave', params, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.close();
    });
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
        'showMaxRows': 7,
        'onClick': (t) => {
        }
    };

    var f = '#' + core.form.dialog.getCurrent();
    core.grid.build($(".itemsBox", f), gridStructure);

    var total = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
        total += parseFloat(data[i].monto);
    }

    var r = core.transform2Json(core.form.getData(f));
    r.total = total;
    core.form.setData(f, r);
}


/**
 * Agrega un nuevo item.
 */
function addDocumentoBtnAddItemClick() {
    var params = {
        id: core.getUniqueId()
    };
    core.form.dialog.show('./add-producto.php', params, () => {
        addDocumentoInsertUpdateItem();
    });
}


/**
 * Edita el item seleccionado.
 */
function addDocumentoBtnEditItemClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.grid.getSelectedRow($('.itemsBox', f));

    if (!r.hasOwnProperty('id')) {
        core.showMessage('Debe seleccionar el item que desea editar', 4, core.color.info);
        return;
    }
    
    core.form.dialog.show('./add-producto.php', r, () => {
        addDocumentoInsertUpdateItem();
    });
}


/**
 * Inserta o actualiza un registro del grid.
 */
function addDocumentoInsertUpdateItem() {
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
}


/**
 * Elimina el item seleccionado.
 */
function addDocumentoBtnDeleteItemClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.grid.getSelectedRow($('.itemsBox', f));

    if (!r.hasOwnProperty('id')) {
        core.showMessage('Debe seleccionar el item que desea eliminar', 4, core.color.info);
        return;
    }

    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar Item',
        'message': 'Se dispone a eliminar este item, ¿Esta seguro?',
        'callbackOk': () => {
            var f = '#' + core.form.dialog.getCurrent();
            var d = core.grid.getAllRows($('.itemsBox', f));
            var n = [];
            var ni = 0;

            for (var i = 0; i < Object.keys(d).length; i++) {
                if (d[i].id == r.id) {
                    continue;
                }
                n[ni] = d[i];
                ni++;
            }

            // Si el item no es nuevo guarda el id.
            if (r.id.length != 36) {
                var deletedItems = core.data.restore(f, 'deletedItems');
                var index = Object.keys(deletedItems).length;
                deletedItems[index] = r.id;
                core.data.save(f, 'deletedItems', deletedItems);
            }

            // Actualiza los datos del grid.
            addDocumentoShowItems(n);
        }
    });
}


/**
 * Carga el registro completo del documento.
 */
function addDocumentoLoad(id) {
    core.showLoading();
    core.apiFunction('documentosLoad', {'id': id}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var f = '#' + core.form.dialog.getCurrent();
        core.form.setData(f, response.data.registro);
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

    $('.addDocumentoBtnEditItem', f).unbind('click');
    $('.addDocumentoBtnEditItem', f).on('click', () => {
        addDocumentoBtnEditItemClick();
    });

    $('.addDocumentoBtnDeleteItem', f).unbind('click');
    $('.addDocumentoBtnDeleteItem', f).on('click', () => {
        addDocumentoBtnDeleteItemClick();
    });

    $('.addDocumentoBtnSave', f).unbind('click');
    $('.addDocumentoBtnSave', f).on('click', () => {
        addDocumentoBtnSaveClick();
    });

    $('.addDocumentoBtnClose', f).unbind('click');
    $('.addDocumentoBtnClose', f).on('click', () => {
        core.form.dialog.close();
    });

    // Inicializa la lista de elementos eliminados.
    core.data.save(f, 'deletedItems', []);

    // Establece la fecha del dia por defecto.
    var r = core.transform2Json(core.form.getData('.datosBox', f));
    r.fecha = core.getDate();
    core.form.setData($('.datosBox', f), r);

    addDocumentoShowItems([]);

    if (params.id != '') {
        addDocumentoLoad(params.id);
    }
});
