
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
            core.apiFunction('loadDetalleAbonos', {id: t.id}, (response) => {
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
        
        core.form.dialog.show('./add-documento.php', params);
    });

    $('.cxcDetalleBtnCerrar', f).unbind('click');
    $('.cxcDetalleBtnCerrar', f).on('click', () => {
        core.form.dialog.close();
    });

    showDetalleCliente([]);
    loadDetalleCliente();
});
