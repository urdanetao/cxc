
/**
 * Carga las empresas registradas al combo.
 */
function repGeneralSaldosEmpresasLoad() {
    core.showLoading();
    core.apiFunction('empresasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var html =
            '<select name="idemp" class="txb">' +
                '<option value="0">Todas las Empresas</option>';
        
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            html += '<option value="' + response.data[i].id + '">' + response.data[i].nombre + '</option>';
        }
        
        html += '</select>';
        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        $('.repSaldoGeneralEmpresaBox', currentArea).html(html);
    });
}


/**
 * Carga las monedas registradas al combo.
 */
function repGeneralSaldosMonedasLoad() {
    core.showLoading();
    core.apiFunction('monedasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var html =
            '<select name="idmon" class="txb">' +
                '<option value="0">Todas</option>';
        
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            html += '<option value="' + response.data[i].id + '">' + response.data[i].siglas + '</option>';
        }
        
        html += '</select>';
        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        $('.repGeneralSaldosMonedaBox', currentArea).html(html);
    });
}


/**
 * Busca un cliente.
 */
function repGeneralSaldosBtnBuscarClienteClick() {
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
 * Aquita el cliente seleccionado.
 */
function repGeneralSaldosBtnQuitarClienteClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    r.idcli = '';
    r.nomcli = '';
    core.form.setData(currentArea, r);
}


/**
 * Genera el reporte.
 */
function repGeneralSaldosBtnPrintClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    r.nomemp = $('select[name="idemp"] option:selected', currentArea).html();
    r.nomtipo = $('select[name="tipo"] option:selected', currentArea).html();
    r.siglas = $('select[name="idmon"] option:selected', currentArea).html();

    core.showLoading();
    core.apiFunction('prepare-report', r, function(response) {
        core.hideLoading();
        window.open('./pdf-general-saldos_01.php');
    });
}

/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.repGeneralSaldosBtnBuscarCliente', currentArea).unbind('click');
    $('.repGeneralSaldosBtnBuscarCliente', currentArea).on('click', () => {
        repGeneralSaldosBtnBuscarClienteClick();
    });

    $('.repGeneralSaldosBtnQuitarCliente', currentArea).unbind('click');
    $('.repGeneralSaldosBtnQuitarCliente', currentArea).on('click', () => {
        repGeneralSaldosBtnQuitarClienteClick();
    });

    $('.repGeneralSaldosBtnPrint', currentArea).unbind('click');
    $('.repGeneralSaldosBtnPrint', currentArea).on('click', () => {
        repGeneralSaldosBtnPrintClick();
    });

    repGeneralSaldosEmpresasLoad();
    repGeneralSaldosMonedasLoad();
});
