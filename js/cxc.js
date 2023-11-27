
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
    });
}


/**
 * Muestra el resumen por moneda.
 */
function showResumenMoneda(data) {
    var gridStructure = {
        'tableTitle': 'Monedas registradas y saldos',
        'columns': [
            {'title': 'ID', 'field': 'idmon', 'width': '50px', 'hide': true},
            {'title': 'MONEDA', 'field': 'nommon', 'width': '200px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'saldo', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 5,
        'onClick': (t) => {
            // core.showLoading();
            // core.apiFunction('clientesLoad', {'id': t.id}, function(response) {
            //     core.hideLoading();
            //     if (!response.status) {
            //         core.showMessage(response.message, 2, core.color.error);
            //         return;
            //     }
            //     var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
            //     core.form.setData(currentArea, response.data);
            //     core.form.setState(currentArea, core.form.state.showing);
            // });
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
            {'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
            {'title': 'CLIENTE', 'field': 'nombre', 'width': '300px', 'type': 'string'},
            {'title': 'MONTO', 'field': 'monto', 'width': '120px', 'type': 'number', 'dataAlign': 'right', 'decimalPlaces': 2, 'thousandSep': true}
        ],
        'rows': data,
        'showMaxRows': 15,
        'onClick': (t) => {
            // core.showLoading();
            // core.apiFunction('clientesLoad', {'id': t.id}, function(response) {
            //     core.hideLoading();
            //     if (!response.status) {
            //         core.showMessage(response.message, 2, core.color.error);
            //         return;
            //     }
            //     var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
            //     core.form.setData(currentArea, response.data);
            //     core.form.setState(currentArea, core.form.state.showing);
            // });
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
