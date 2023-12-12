
/**
 * Carga las monedas registradas en el combo.
 */
function addTransactionMonedasLoad() {
    core.showLoading();
    core.apiFunction('monedasLoad', {}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        var html =
            '<select name="idmon" class="txb">' +
                '<option value="0">Seleccione</option>';
        
        for (var i = 0; i < Object.keys(response.data).length; i++) {
            html += '<option value="' + response.data[i].id + '">' + response.data[i].siglas + '</option>';
        }

        html += '</select>';

        var f = '#' + core.form.dialog.getCurrent();
        $('.addTransactionMonedaBox', f).html(html);
    });
}


/**
 * Selecciona el cliente.
 */
function addTransactionBtnBuscarClienteClick() {
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
	
				var f = '#' + core.form.dialog.getCurrent();
                var r = core.transform2Json(core.form.getData(f));
                r.idcli = response.data.id;
                r.nomcli = response.data.nombre;
				core.form.setData(f, r);
			});
		}
	});
}


/**
 * Llama al formulario para agregar movimientos.
 */
function addTransactionBtnAddClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    if (r.idmon == '0') {
        core.showMessage('Seleccione la moneda', 4, core.color.info);
        return;
    }

    if (r.idcli == '') {
        core.showMessage('Seleccione un cliente', 4, core.color.info);
        return;
    }

    r.siglas = $('[name="idmon"] option:selected', f).html();
    r.tipo = 0;
    r.tipoTexto = 'Todas';

    r.addTransactionOk = 1;
    core.form.dialog.setBackwardData(r);
    core.form.dialog.close();
}


/**
 * On Load.
 */
$(() => {
    var f = '#' + core.form.dialog.getCurrent();
    var params = core.data.restore(f, 'params');

    // Inicializa los datos de retorno.
    core.form.dialog.setBackwardData({});

    core.form.setData(f, params);
    core.linkNativeEvents(f);

    $('.addTransactionBtnBuscarCliente', f).unbind('click');
    $('.addTransactionBtnBuscarCliente', f).on('click', () => {
        addTransactionBtnBuscarClienteClick();
    });

    $('.addTransactionBtnAdd', f).unbind('click');
    $('.addTransactionBtnAdd', f).on('click', () => {
        addTransactionBtnAddClick();
    });

    $('.addTransactionBtnClose', f).unbind('click');
    $('.addTransactionBtnClose', f).on('click', () => {
        core.form.dialog.close();
    });

    addTransactionMonedasLoad();
});
