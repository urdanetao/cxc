
/**
 * Carga las empresas registradas.
 */
function cxcLoadEmpresas() {
    core.showLoading();
    core.apiFunction('empresasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        var html =
            '<select>' +
                '<option value="0"></option>';
        
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            html += '<option value="' + response.data[i].id + '">' + response.data[i].nombre + '</option>';
        }

        html += '</select>';
        $('[name="idemp"]', currentArea).html(html);
    });
}


/**
 * Carga las monedas registradas.
 */
function cxcLoadMonedas() {
    core.showLoading();
    core.apiFunction('monedasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        var html =
            '<select>' +
                '<option value="0"></option>';
        
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            html += '<option value="' + response.data[i].id + '">' + response.data[i].siglas + '</option>';
        }

        html += '</select>';
        $('[name="idmon"]', currentArea).html(html);
    });
}


/**
 * Carga el resumen general por moneda.
 */
function loadResumenMoneda() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    var params = {
        'idemp': r.idemp,
        'tipo': r.tipo
    };

    if (r.idemp == '0') {
        showResumenMoneda([]);
        loadResumenCliente('');
        return;
    }

    core.showLoading();
    core.apiFunction('saldoGeneralMoneda', params, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        showResumenMoneda(response.data);
        loadResumenCliente('');
    });
}


/**
 * Muestra el resumen por moneda.
 */
function showResumenMoneda(data) {
    var gridStructure = {
        'tableTitle': 'Monedas registradas y saldos',
        'columns': [
            {'title': 'IDMON', 'field': 'idmon', 'width': '50px', 'hide': true},
            {'title': 'SIGLAS', 'field': 'siglas', 'width': '50px', 'hide': true},
            {'title': 'MONEDA', 'field': 'nommon', 'width': '200px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'saldo', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 5,
        'onClick': (t) => {
            loadResumenCliente(t.idmon);
        }
    };

    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.grid.build($(".resumenMonedaBox", currentArea), gridStructure);
}


/**
 * Muestra el resumen por cliente.
 */
function showResumenCliente(data) {
    var gridStructure = {
        'tableTitle': 'Clientes registrados y saldos',
        'columns': [
            {'title': 'ID', 'field': 'idcli', 'width': '50px', 'hide': true},
            {'title': 'CLIENTE', 'field': 'nomcli', 'width': '300px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'saldo', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 15,
        'onClick': (t) => {
            var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
            var r = core.transform2Json(core.form.getData(currentArea));
            var m = core.grid.getSelectedRow($('.resumenMonedaBox', currentArea));
            r.nomemp = $('[name="idemp"] option:selected', currentArea).html();
            r.tipoTexto = $('[name="tipo"] option:selected', currentArea).html();
            r.idmon = m.idmon;
            r.siglas = m.siglas;
            r.nommon = m.nommon;
            r.idcli = t.idcli;
            r.nomcli = t.nomcli;
            core.form.dialog.show('./cxc-detalle.php', r, () => {
                loadResumenCliente(m.idmon);
            });
        }
    };

    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.grid.build($(".resumenClienteBox", currentArea), gridStructure);
}


/**
 * Busca un cliente.
 */
function cxcClienteSearch() {
    core.search({
        'title': 'Busqueda de Clientes',
        'column1': 'ID',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'clientesSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('clientesLoad', {'id': id}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
                var r = core.transform2Json(core.form.getData(currentArea));
                r.idcli = response.data.id;
                r.nomcli = response.data.nombre;
				core.form.setData(currentArea, r);

                // Toma la moneda seleccionada.
                var m = core.grid.getSelectedRow($('.resumenMonedaBox', currentArea));
                var idmon = '';

                if (m.hasOwnProperty('idmon')) {
                    idmon = m.idmon;
                }

                loadResumenCliente(idmon);
			});
		}
	});
}


/**
 * Quita al cliente seleccionado.
 */
function cxcClienteRemove() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    r.idcli = '';
    r.nomcli = '';
    core.form.setData(currentArea, r);

    // Toma la moneda seleccionada.
    var m = core.grid.getSelectedRow($('.resumenMonedaBox', currentArea));
    var idmon = '';

    if (m.hasOwnProperty('idmon')) {
        idmon = m.idmon;
    }

    loadResumenCliente(idmon);
}


/**
 * Carga el resumen por cliente.
 */
function loadResumenCliente(idmon) {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    var params = {
        idemp: r.idemp,
        tipo: r.tipo,
        idmon: idmon,
        idcli: r.idcli
    };

    core.showLoading();
    core.apiFunction('saldoGeneralCliente', params, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        showResumenCliente(response.data);

        // Calcula el total.
        var totalCxC = 0;
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            totalCxC += parseFloat(response.data[i].saldo);
        }

        var r = core.transform2Json(core.form.getData(currentArea));
        r.totalCxC = totalCxC;
        core.form.setData(currentArea, r);
    });
}


/**
 * Agrega una nueva transaccion.
 */
function cxcBtnAddTransactionClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    r = core.transform2Json(core.form.getData(currentArea));

    if (r.idemp == '0') {
        core.showMessage('Debe seleccionar una empresa', 4, core.color.info);
        return;
    }

    // Toma el nombre de la empresa.
    r.nomemp = $('[name="idemp"] option:selected', currentArea).html();

    core.form.dialog.show('./add-transaction.php', r, () => {
        var r = core.form.dialog.getBackwardData();
        if (r.hasOwnProperty('addTransactionOk') && r.addTransactionOk == 1) {
            core.form.dialog.show('./cxc-detalle.php', r, () => {
                var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
                var m = core.grid.getSelectedRow($('.resumenMonedaBox', currentArea));
                if (!m.hasOwnProperty('idmon')) {
                    m.idmon = 0;
                }
                loadResumenMoneda();
            });
        }
    });
}


/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.cxcBtnBuscarCliente', currentArea).unbind('click');
    $('.cxcBtnBuscarCliente', currentArea).click(() => {
        cxcClienteSearch();
    })

    $('.cxcBtnQuitarCliente', currentArea).unbind('click');
    $('.cxcBtnQuitarCliente', currentArea).click(() => {
        cxcClienteRemove();
    })

    $('.cxcBtnAddTransaction', currentArea).unbind('click');
    $('.cxcBtnAddTransaction', currentArea).click(() => {
        cxcBtnAddTransactionClick();
    })

    $('[name="idemp"]', currentArea).unbind('change');
    $('[name="idemp"]', currentArea).on('change', ()=> {
        loadResumenMoneda();
    });

    $('[name="tipo"]', currentArea).unbind('change');
    $('[name="tipo"]', currentArea).on('change', ()=> {
        loadResumenMoneda();
    });

    cxcLoadEmpresas();
    cxcLoadMonedas();
    showResumenMoneda([]);
    showResumenCliente([]);
});
