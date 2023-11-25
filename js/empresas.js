
/**
 * Muestra los ultimos 5 registros.
 */
function empresasShowLast() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

	var data = {'tableName': 'empresas'};
	core.apiFunction('getLast5Records', data, function(response) {
		var gridStructure = {
			'tableTitle': 'Ultimos 5 registros ingresados',
			'columns': [
				{'title': 'ID', 'field': 'id', 'width': '50px', 'dataAlign': 'right'},
				{'title': 'NOMBRE', 'field': 'nombre', 'width': '250px', 'type': 'string'}
			],
			'rows': response.data,
			'showMaxRows': 5,
			'onClick': (t) => {
				core.showLoading();
				core.apiFunction('empresasLoad', {'id': t.id}, function(response) {
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

		core.grid.build($(".empresasLastBox", currentArea), gridStructure);
	});
}


/**
 * Agrega un nuevo registro.
 */
function empresasAddRecord() {
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
function empresasEditRecord() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Guarda los valores del registro actual.
    core.data.save(currentArea, 'backup', core.form.getData(currentArea));

    // Coloca el formulario en modo edicion.
    core.form.setState(currentArea, core.form.state.editing);
}

/**
 * Guarda el registro actual.
 */
function empresasSaveRecord() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');

    // Toma el registro desde los controles del formulario.
	var r = core.transform2Json(core.form.getData(currentArea));

	// Ejecuta la funcion.
	core.showLoading();
	core.apiFunction('empresasSave', r, (response) => {
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

		empresasShowLast();
	});
}


/**
 * Cancela la edicion del registro.
 */
function empresasCancelEdit() {
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
function empresasDeleteRecord() {
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
			core.apiFunction('empresasDelete', {'id': r.id}, (response) => {
				core.hideLoading();
				if (!response.status) {
					core.showMessage(response.message, 2, core.color.error);
					return;
				}

				core.showMessage(response.message, 2, core.color.success);
				core.form.setData(currentArea, core.form.getData(currentArea, true));
				core.form.setState(currentArea, core.form.state.noShow);
				empresasShowLast();
			});
		}
	});
}


/**
 * Busca un registro.
 */
function empresasSearch() {
    core.search({
        'title': 'Busqueda de Empresas',
        'column1': 'ID',
        'field1': 'id',
        'column2': 'NOMBRE',
        'field2': 'nombre',
        'fieldId': 'id',
        'method': 'empresasSearch',
		'callback': () => {
			// Recupera los datos de retorno.
			var id = core.form.dialog.getBackwardData();

			// Carga el registro del sistema.
			core.showLoading();
			core.apiFunction('empresasLoad', {'id': id}, function(response) {
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
	$('.btnEmpresasSearch', currentArea).unbind('click');
	$('.btnEmpresasSearch', currentArea).click(() => {
		empresasSearch();
	});

	$('.btnEmpresasAdd', currentArea).unbind('click');
	$('.btnEmpresasAdd', currentArea).click(() => {
		empresasAddRecord();
	});
	
	$('.btnEmpresasEdit', currentArea).unbind('click');
	$('.btnEmpresasEdit', currentArea).click(() => {
		empresasEditRecord();
	});
	
	$('.btnEmpresasSave', currentArea).unbind('click');
	$('.btnEmpresasSave', currentArea).click(() => {
		empresasSaveRecord();
	});
	
	$('.btnEmpresasCancel', currentArea).unbind('click');
	$('.btnEmpresasCancel', currentArea).click(() => {
		empresasCancelEdit();
	});

	$('.btnEmpresasDelete', currentArea).unbind('click');
	$('.btnEmpresasDelete', currentArea).click(() => {
		empresasDeleteRecord();
	});

    core.form.setState(currentArea, core.form.state.noShow);
    empresasShowLast();
});
