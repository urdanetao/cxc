
/**
 * Carga las empresas registradas al combo.
 */
 function repMovimientosPeriodoEmpresasLoad() {
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
        $('.repMovimientosPeriodoEmpresaBox', currentArea).html(html);
    });
}


/**
 * Carga las monedas registradas al combo.
 */
 function repMovimientosPeriodoMonedasLoad() {
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
        $('.repMovimientosPeriodoMonedaBox', currentArea).html(html);
    });
}


/**
 * Busca un cliente.
 */
 function repMovimientosPeriodoBtnBuscarClienteClick() {
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
 function repMovimientosPeriodoBtnQuitarClienteClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    r.idcli = '';
    r.nomcli = '';
    core.form.setData(currentArea, r);
}


/**
 * Genera el reporte.
 */
 function repMovimientosPeriodoBtnPrintClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));
    r.nomemp = $('select[name="idemp"] option:selected', currentArea).html();
    r.nomtipo = $('select[name="tipo"] option:selected', currentArea).html();
    r.siglas = $('select[name="idmon"] option:selected', currentArea).html();

    core.showLoading();
    core.apiFunction('prepare-report', r, function(response) {
        core.hideLoading();
        window.open('./pdf-movimientos-periodo.php');
    });
}


/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.repMovimientosPeriodoBtnBuscarCliente', currentArea).unbind('click');
    $('.repMovimientosPeriodoBtnBuscarCliente', currentArea).on('click', () => {
        repMovimientosPeriodoBtnBuscarClienteClick();
    });

    $('.repMovimientosPeriodoBtnQuitarCliente', currentArea).unbind('click');
    $('.repMovimientosPeriodoBtnQuitarCliente', currentArea).on('click', () => {
        repMovimientosPeriodoBtnQuitarClienteClick();
    });

    $('.repMovimientosPeriodoBtnPrint', currentArea).unbind('click');
    $('.repMovimientosPeriodoBtnPrint', currentArea).on('click', () => {
        repMovimientosPeriodoBtnPrintClick();
    });

    repMovimientosPeriodoEmpresasLoad();
    repMovimientosPeriodoMonedasLoad();
});
