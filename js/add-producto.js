
/**
 * Calcula el total del item.
 */
function addProductoCalculaTotal() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    var precio = parseFloat(r.precio);
    var cantidad = parseFloat(r.cantidad);
    r.monto = (precio * cantidad).toFixed(2);
    core.form.setData(f, r);
}

/**
 * Busca el producto por el texto del codigo.
 */
function addProductoSearchByText() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    // Si no hay codigo estableido.
    if (r.codigo == '') {
        return;
    }

    core.showLoading();
    core.apiFunction('saintProductosLoad', {codigo: r.codigo}, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        var f = '#' + core.form.dialog.getCurrent();
        var r = core.transform2Json(core.form.getData(f));

        // Si la respuesta no tiene registros.
        if (Object.keys(response.data).length == 0) {
            core.showMessage('Codigo no registrado', 4, core.color.error);
            r.codigo = '';
            core.form.setData(f, r);
            return;
        }

        // Si existe un solo registro como respuesta.
        if (Object.keys(response.data).length == 1) {
            var d = response.data[0];
            r.codigo = d.codigo;
            r.descrip = d.descrip;
            core.form.setData(f, r);
            return;
        }

        // Si llega aqui es porque la respuesta contiene multiples registros.
        core.form.dialog.show('./select-producto.php', response.data, () => {
            var d = core.form.dialog.getBackwardData();
            if (d.hasOwnProperty('codigo')) {
                r.codigo = d.codigo;
                r.descrip = d.descrip;
            } else {
                r.codigo = '';
            }
            core.form.setData(f, r);
        });
    });
}


/**
 * Agrega o actualiza el producto en la lista.
 */
function addProductoBtnOkClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    // Valida los campos requeridos.
    if (r.descrip == '') {
        core.showMessage('Debe indicar una descripción para el item', 4, core.color.error);
        return;
    }

    if (parseFloat(r.precio) < 0.01) {
        core.showMessage('El precio del item debe ser mayor a cero (0)', 4, core.color.error);
        return;
    }

    if (parseFloat(r.cantidad) < 1) {
        core.showMessage('La cantidad del item debe ser mayor a cero (0)', 4, core.color.error);
        return;
    }

    r.addProducto = 1;
    core.form.dialog.setBackwardData(r);
    core.form.dialog.close();
}


/**
 * Busca un registro.
 */
function addProductoBuscarProductoClick() {
    core.search({
        'title': 'Busqueda de Productos',
        'column1': 'CODIGO',
        'field1': 'codigo',
        'column2': 'DESCRIPCION',
        'field2': 'descrip',
        'fieldId': 'codigo',
        'method': 'saintProductosSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var codigo = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('saintProductosLoad', {'codigo': codigo}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var f = '#' + core.form.dialog.getCurrent();
                var r = core.transform2Json(core.form.getData(f));
                r.codigo = response.data[0].codigo;
                r.descrip = response.data[0].descrip;
				core.form.setData(f, r);
			});
		}
	});
}


/**
 * On Load.
 */
$(() => {
    var f = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(f);

    var params = core.data.restore(f, 'params');
    core.form.setData(f, params);

    $('.addProductoBtnBuscarProducto', f).unbind('click');
    $('.addProductoBtnBuscarProducto', f).on('click', () => {
        addProductoBuscarProductoClick();
    });

    $('input[name="codigo"]', f).unbind('blur');
    $('input[name="codigo"]', f).on('blur', () => {
        addProductoSearchByText();
    });

    $('input[name="precio"]', f).unbind('blur');
    $('input[name="precio"]', f).on('blur', () => {
        addProductoCalculaTotal();
    });

    $('input[name="cantidad"]', f).unbind('blur');
    $('input[name="cantidad"]', f).on('blur', () => {
        addProductoCalculaTotal();
    });

    $('.addProductoBtnOk', f).unbind('click');
    $('.addProductoBtnOk', f).on('click', () => {
        addProductoBtnOkClick();
    });

    $('.addProductoBtnCancelar', f).unbind('click');
    $('.addProductoBtnCancelar', f).on('click', () => {
        core.form.dialog.close();
    });

    // Inicializa el backward data.
    core.form.dialog.setBackwardData({});
});
