
/**
 * Carga el detalle del cliente.
 */
function loadDetalleCliente() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));
    
    core.showLoading();
    core.apiFunction('loadDetalleCliente', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        showDetalleCliente(response.data);
    });
}

/**
 * Muestra el detalle del cliente.
 */
function showDetalleCliente(data) {
    var gridStructure = {
        'tableTitle': 'Lista de Transacciones Realizadas',
        'columns': [
            {'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
            {'title': 'IDEMP', 'field': 'idemp', 'width': '50px', 'hide': true},
            {'title': 'IDMON', 'field': 'idmon', 'width': '50px', 'hide': true},
            {'title': 'IDCLI', 'field': 'idcli', 'width': '50px', 'hide': true},
            {'title': 'TIPO', 'field': 'tipo', 'width': '50px', 'hide': true},
            {'title': 'FECHA', 'field': 'fecha', 'width': '80px', 'type': 'date'},
            {'title': 'TIPO', 'field': 'tipotexto', 'width': '80px', 'type': 'string'},
            {'title': 'DESCRIPCION', 'field': 'descrip', 'width': '310px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'debitos', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true},
            {'title': 'ABONOS', 'field': 'creditos', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true},
            {'title': 'SALDO', 'field': 'saldo', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 6,
        'onClick': (t) => {
            core.showLoading();
            core.apiFunction('documentosLoad', {id: t.id}, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }

                showDetalleDoc(response.data.detalle);
                showAbonos(response.data.abonos);
            })
        }
    };

    var f = '#' + core.form.dialog.getCurrent();
    core.grid.build($(".detalleGeneralClienteBox", f), gridStructure);

    // Calcula el total.
    var totalCxC = 0;
    for (var i = 0; i < Object.keys(data).length; i++) {
        totalCxC += parseFloat(data[i].saldo);
    }
    var r = core.transform2Json(core.form.getData(f));
    r.totalCxCCliente = totalCxC;
    core.form.setData(f, r);

    showDetalleDoc([]);
    showAbonos([]);
}


/**
 * Muestra el detalle de un documento.
 */
function showDetalleDoc(data) {
    var gridStructure = {
        'tableTitle': 'Detalle del Documento',
        'columns': [
            {'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
            {'title': 'IDPARENT', 'field': 'idparent', 'width': '50px', 'hide': true},
            {'title': 'DESCRIPCION', 'field': 'descrip', 'width': '250px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'monto', 'width': '100px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 4,
        'onClick': (t) => {
        }
    };

    var f = '#' + core.form.dialog.getCurrent();
    core.grid.build($(".detalleDocBox", f), gridStructure);
}


/**
 * Muestra los abonos realizados a un documento.
 */
function showAbonos(data) {
    var gridStructure = {
        'tableTitle': 'Abonos',
        'columns': [
            {'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
            {'title': 'IDPARENT', 'field': 'idparent', 'width': '50px', 'hide': true},
            {'title': 'FECHA', 'field': 'fecha', 'width': '80px', 'type': 'date'},
            {'title': 'DESCRIPCION', 'field': 'descrip', 'width': '250px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'monto', 'width': '100px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 4,
        'onClick': (t) => {
        }
    };

    var f = '#' + core.form.dialog.getCurrent();
    core.grid.build($(".detalleAbonosBox", f), gridStructure);
}


/**
 * Agrega un documento.
 */
function cxcDetalleBtnAddDocumentoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));
    var params = {
        id: '',
        idemp: r.idemp,
        nomemp: r.nomemp,
        idcli: r.idcli,
        nomcli: r.nomcli,
        idmon: r.idmon,
        siglas: r.siglas,
        nommon: r.nommon
    };
    
    core.form.dialog.show('./add-documento.php', params, () => {
        loadDetalleCliente();
    });
}


/**
 * Edita un documento.
 */
function cxcDetalleBtnEditDocumentoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));
    var item = core.grid.getSelectedRow($('.detalleGeneralClienteBox', f));

    if (!item.hasOwnProperty('id')) {
        core.showMessage('Debe seleccionar el documento que desea editar', 4, core.color.info);
        return;
    }

    var params = {
        id: item.id,
        idemp: r.idemp,
        nomemp: r.nomemp,
        idcli: r.idcli,
        nomcli: r.nomcli,
        idmon: r.idmon,
        siglas: r.siglas,
        nommon: r.nommon
    };
    
    core.form.dialog.show('./add-documento.php', params, () => {
        loadDetalleCliente();
    });
}


/**
 * Elimina un documento.
 */
function cxcDetalleBtnDeleteDocumentoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var item = core.grid.getSelectedRow($('.detalleGeneralClienteBox', f));

    if (!item.hasOwnProperty('id')) {
        core.showMessage('Debe seleccionar el documento que desea eliminar', 4, core.color.info);
        return;
    }

    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar Documento',
        'message': 'Se dispone a liminar el documento completo con su detalle y abonos, ¿esta seguro?',
        'callbackOk': () => {
            core.showLoading();
            core.apiFunction('documentosDelete', {'id': item.id}, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }
                core.showMessage(response.message, 4, core.color.success);
                loadDetalleCliente();
            });
        }
    });
}


/**
 * Agrega un abono.
 */
function cxcDetalleBtnAddAbonoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var item = core.grid.getSelectedRow($('.detalleGeneralClienteBox', f));

    if (!item.hasOwnProperty('id')) {
        core.showMessage('Seleccione la transacción a la que desea abonar', 4, core.color.info);
        return;
    }

    var params = {
        'idparent': item.id,
        'fecha': core.getDate()
    };

    core.form.dialog.show('./add-abono.php', params, () => {
        loadDetalleCliente();
    });
}


/**
 * Edita un abono.
 */
function cxcDetalleBtnEditAbonoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var item = core.grid.getSelectedRow($('.detalleAbonosBox', f));

    if (!item.hasOwnProperty('id')) {
        core.showMessage('Seleccione el abono que desea editar', 4, core.color.info);
        return;
    }

    core.form.dialog.show('./add-abono.php', item, () => {
        loadDetalleCliente();
    });
}


/**
 * Elimina un abono.
 */
function cxcDetalleBtnDeleteAbonoClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var item = core.grid.getSelectedRow($('.detalleAbonosBox', f));

    if (!item.hasOwnProperty('id')) {
        core.showMessage('Seleccione el abono que desea eliminar', 4, core.color.info);
        return;
    }

    core.showConfirm({
        'icon': 'icon icon-bin',
        'title': 'Confirmar Eliminar Abono',
        'message': 'Se dispone a eliminar este abono, ¿Esta seguro?',
        'callbackOk': () => {
            core.showLoading();
            core.apiFunction('abonosDelete', item, (response) => {
                core.hideLoading();
                if (!response.status) {
                    core.showMessage(response.message, 4, core.color.error);
                    return;
                }
                core.showMessage(response.message, 4, core.color.success);
                loadDetalleCliente();
            });
        }
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

    $('[name="ver"]', f).unbind('change');
    $('[name="ver"]', f).on('change', () => {
        loadDetalleCliente();
    });

    $('.cxcDetalleBtnAddDocumento', f).unbind('click');
    $('.cxcDetalleBtnAddDocumento', f).on('click', () => {
        cxcDetalleBtnAddDocumentoClick();
    });

    $('.cxcDetalleBtnEditDocumento', f).unbind('click');
    $('.cxcDetalleBtnEditDocumento', f).on('click', () => {
        cxcDetalleBtnEditDocumentoClick();
    });

    $('.cxcDetalleBtnDeleteDocumento', f).unbind('click');
    $('.cxcDetalleBtnDeleteDocumento', f).on('click', () => {
        cxcDetalleBtnDeleteDocumentoClick();
    });

    $('.cxcDetalleBtnCerrar', f).unbind('click');
    $('.cxcDetalleBtnCerrar', f).on('click', () => {
        core.form.dialog.close();
    });

    $('.cxcDetalleBtnAddAbono', f).unbind('click');
    $('.cxcDetalleBtnAddAbono', f).on('click', () => {
        cxcDetalleBtnAddAbonoClick();
    })

    $('.cxcDetalleBtnEditAbono', f).unbind('click');
    $('.cxcDetalleBtnEditAbono', f).on('click', () => {
        cxcDetalleBtnEditAbonoClick();
    })

    $('.cxcDetalleBtnDeleteAbono', f).unbind('click');
    $('.cxcDetalleBtnDeleteAbono', f).on('click', () => {
        cxcDetalleBtnDeleteAbonoClick();
    })

    showDetalleCliente([]);
    loadDetalleCliente();
});
