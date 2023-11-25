
/**
 * Muestra los ultimos 5 registros.
 */
function monedasShowLast() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

	var data = {'tableName': 'monedas'};
	core.apiFunction('getLast5Records', data, function(response) {
		var gridStructure = {
			'tableTitle': 'Ultimos 5 registros ingresados',
			'columns': [
				{'title': 'ID', 'field': 'id', 'width': '50px', 'hide': true},
				{'title': 'SIGLAS', 'field': 'siglas', 'width': '50px', 'type': 'string'},
				{'title': 'NOMBRE', 'field': 'nombre', 'width': '250px', 'type': 'string'}
			],
			'rows': response.data,
			'showMaxRows': 5,
			'onClick': (t) => {
				core.showLoading();
				core.apiFunction('monedasLoad', {'id': t.id}, function(response) {
					core.hideLoading();
					if (!response.status) {
						core.showMessage(response.message, 2, core.color.error);
						return;
					}
					var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
					core.form.setData(currentArea, response.data);
					core.form.setState(currentArea, core.form.state.showing);
				});
			}
		};

		core.grid.build($(".monedasLastBox", currentArea), gridStructure);
	});
}


/**
 * Agrega un nuevo registro.
 */
function monedasAddRecord() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Guarda los valores del registro actual.
	core.data.save(currentArea, 'backup', core.form.getData(currentArea));

	// Inicializa un registro en blanco.
	var r = core.form.getData(currentArea, true);

	core.form.setData(currentArea, r);
	core.form.setState(currentArea, core.form.state.editing);
}


/**
 * Edita el registro actual.
 */
function monedasEditRecord() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Guarda los valores del registro actual.
    core.data.save(currentArea, 'backup', core.form.getData(currentArea));

    // Coloca el formulario en modo edicion.
    core.form.setState(currentArea, core.form.state.editing);
}

/**
 * Guarda el registro actual.
 */
function monedasSaveRecord() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Toma el registro desde los controles del formulario.
	var r = core.transform2Json(core.form.getData(currentArea));

	// Ejecuta la funcion.
	core.showLoading();
	core.apiFunction('monedasSave', r, (response) => {
		core.hideLoading();

		if (!response.status) {
			core.showMessage(response.message, 2, core.color.error);
			return;
		}

		core.showMessage(response.message, 2, core.color.success);

		var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
		r.id = response.data.id;
		core.form.setData(currentArea, r);
		core.form.setState(currentArea, core.form.state.showing);

		monedasShowLast();
	});
}


/**
 * Cancela la edicion del registro.
 */
function monedasCancelEdit() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Restaura el registro anterior.
	var r = core.data.restore(currentArea, 'backup');
	core.form.setData(currentArea, r);

	// Establece el estado del formulario.
	if (r.id == '') {
		core.form.setState(currentArea, core.form.state.noShow);
	} else {
		core.form.setState(currentArea, core.form.state.showing);
	}
}


/**
 * Elimina el registro actual.
 */
function monedasDeleteRecord() {
    // Confirma con el usuario.
	core.showConfirm({
		'icon': 'icon icon-bin',
		'title': 'Confirmar Eliminar',
		'message': 'Se dispone a eliminar el registro, ¿está seguro?',
		'callbackOk': () => {
			var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
		
			// Toma el registro desde los controles del formulario.
			var r = core.transform2Json(core.form.getData(currentArea));

			core.showLoading();
			core.apiFunction('monedasDelete', {'id': r.id}, (response) => {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 2, core.color.error);
					return;
				}

				core.showMessage(response.message, 2, core.color.success);
				core.form.setData(currentArea, core.form.getData(currentArea, true));
				core.form.setState(currentArea, core.form.state.noShow);
				monedasShowLast();
			});
		}
	});
}


/**
 * Busca un registro.
 */
function monedasSearch() {
    core.search({
        'title': 'Busqueda de Monedas',
        'column1': 'SIGLAS',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'monedasSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('monedasLoad', {'id': id}, function(response) {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 4, core.color.error);
					return;
				}
	
				var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
				core.form.setData(currentArea, response.data);
				core.form.setState(currentArea, core.form.state.showing);
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

    // Enlaza los eventos.
	$('.btnMonedasSearch', currentArea).unbind('click');
	$('.btnMonedasSearch', currentArea).click(() => {
		monedasSearch();
	});

	$('.btnMonedasAdd', currentArea).unbind('click');
	$('.btnMonedasAdd', currentArea).click(() => {
		monedasAddRecord();
	});
	
	$('.btnMonedasEdit', currentArea).unbind('click');
	$('.btnMonedasEdit', currentArea).click(() => {
		monedasEditRecord();
	});
	
	$('.btnMonedasSave', currentArea).unbind('click');
	$('.btnMonedasSave', currentArea).click(() => {
		monedasSaveRecord();
	});
	
	$('.btnMonedasCancel', currentArea).unbind('click');
	$('.btnMonedasCancel', currentArea).click(() => {
		monedasCancelEdit();
	});

	$('.btnMonedasDelete', currentArea).unbind('click');
	$('.btnMonedasDelete', currentArea).click(() => {
		monedasDeleteRecord();
	});

    core.form.setState(currentArea, core.form.state.noShow);
    monedasShowLast();
});
