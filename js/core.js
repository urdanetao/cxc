
class Core {
    // Pila de elementos dialog.
    #dialogStack;

    // Maximo de filas a mostrar en un grid.
    #searchMaxRows;

    // Nombre de la api.
    #api;

    // Modo depuracion.
    #debugMode;

    // Espacios de nombre en la raiz.
    color;
    form;
    data;
    format;
    math;
    grid;
    menu;

    /**
     * Constructor de la clase.
     * @returns Nose
     */
    constructor() {
        // Valida que esté cargado JQuery.
        if (typeof($) != 'function') {
            this.#consoleInternalError("constructor: No se ha cargado la libreria JQuery");
            return;
        }

        // Contenedor de dialogos modal.
        if ($('#dialogBox', 'body').length == 0) {
            var html =
                '<div id="dialogBox">' +
                    '<dialog id="dlg-loading" class="coreDialog">' +
                        '<div class="flex flex-vcenter dialogLoadingMainContainer">' +
                            '<img src="./img/loading.gif" class="dialog-loading-img">' +
                            '<div class="hsep10"></div>' +
                            '<span translate="no" class="lbl dialog-loading-lbl-text"></span>' +
                        '</div>' +
                    '</dialog>' +

                    '<dialog id="dialog-error" class="coreDialog">' +
                        '<div class="dialogErrorMainContainer">' +
                            '<div class="window">' +
                                '<div class="windowTitle">' +
                                    '<h6 class="dialog-error-lbl-title"></h6>' +
                                '</div>' +
                                '<div class="windowBox" style="padding: 0px;">' +
                                    '<div class="dlg-content">' +
                                        '<table>' +
                                            '<tr>' +
                                                '<td></td>' +
                                                '<td>' +
                                                    '<div>' +
                                                        '<span translate="no" class="lbl">Ha ocurrido un error!</span>' +
                                                    '</div>' +
                                                '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                                '<td>' +
                                                    '<div class="flex">' +
                                                        '<div class="dialog-error-img">' +
                                                            '<img src="./img/error.png">' +
                                                        '</div>' +
                                                        '<div class="hsep10"></div>' +
                                                    '</div>' +
                                                '</td>' +
                                                '<td>' +
                                                    '<div>' +
                                                        '<textarea class="txb dialog-error-detail " rows="5" readonly="true"></textarea>' +
                                                    '</div>' +
                                                '</td>' +
                                            '</tr>' +
                                        '</table>' +
                                        '<div class="vsep10"></div>' +
                                        '<div class="flex flex-hcenter">' +
                                            '<button class="btn btn-dark dialogErrorBtnOk">Ok</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</dialog>' +

                    '<dialog id="dlg-select-icon" class="coreDialog">' +
                        '<div class="selectIconMainContainer">' +
                            '<div class="window">' +
                                '<div class="windowTitle">' +
                                    '<h6 translate="no">Seleccionar Icono</h6>' +
                                '</div>' +
                                '<div class="windowBox">' +
                                    '<div class="dialogSelectIconBody">' +
                                        '<!-- Filtro -->' +
                                        '<div class="iconFilterMainCnt">' +
                                            '<div>' +
                                                '<div>' +
                                                    '<span translate="no" class="lbl">Filtrar Iconos</span>' +
                                                '</div>' +
                                                '<div class="flex flex-vcenter">' +
                                                    '<input translate="no" type="text" class="txb txbIconFilter">' +
                                                    '<div class="hsep5"></div>' +
                                                    '<button class="btn btn-dark mini-btn btnCancelFilter">' +
                                                        '<span translate="no" class="icon icon-cross"></span>' +
                                                    '</button>' +
                                                    '<div class="hsep5"></div>' +
                                                    '<button class="btn btn-dark mini-btn btnSetFilter">' +
                                                        '<span translate="no" class="icon icon-filter"></span>' +
                                                    '</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div>' +
                                                '<div>' +
                                                    '<span translate="no" class="lbl">Nombre del Icono</span>' +
                                                '</div>' +
                                                '<div>' +
                                                    '<input translate="no" type="text" class="txb txbIconName" disabled="true">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="vsep10"></div>' +
                                        '<div class="dialogSelectIconTitle">' +
                                            '<span translate="no" class="lbl">Seleccione un icono</span>' +
                                        '</div>' +
                                        '<!-- Contenedor de los iconos -->' +
                                        '<div class="dialogSelectIconPanel"></div>' +
                                        '<!-- Botones -->' +
                                        '<div class="dialogSelectIconButtons">' +
                                            '<button class="btn btn-dark dialogSelectIconOk">Ok</button>' +
                                            '<div class="hsep10"></div>' +
                                            '<button class="btn btn-dark dialogSelectIconCancel">Cancelar</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</dialog>' +

                    '<dialog id="dlg-search" class="coreDialog">' +
                        '<div class="dialogSearchTitleBox">' +
                            '<span translate="no" class="dialogSearchTitleText "></span>' +
                        '</div>' +
                        '<div class="dlg-content">' +
                            '<!-- Cabecera. -->' +
                            '<div class="flex">' +
                                '<span translate="no" class="lbl">Buscar</span>' +
                                '<div class="hsep5"></div>' +
                                '<input translate="no" type="text" class="txb txb-str dialog-search-txb-search" placeholder="Ingrese el texto de búsqueda">' +
                                '<div class="hsep5"></div>' +
                                '<button class="btn btn-dark icon icon-search mini-btn dialog-search-btn-search"></button>' +
                            '</div>' +
                            '<br>' +
                            '<div class="dialogSearchGridBox"></div>' +
                            '<div class="vsep10"></div>' +
                            '<div class="flex flex-right">' +
                                '<button class="btn btn-dark dialogSearchBtnOk">Ok</button>' +
                                '<div class="hsep10"></div>' +
                                '<button class="btn btn-dark dialogSearchBtnCancel">Cancelar</button>' +
                            '</div>' +
                            '<div class="vsep10"></div>' +
                        '</div>' +
                    '</dialog>' +

                    '<dialog id="dlg-confirm" class="coreDialog">' +
                        '<div>' +
                            '<div class="flex flex-vcenter dialogConfirmHeader">' +
                                '<div>' +
                                    '<span translate="no" class="dialogConfirmTitleIcon"></span>' +
                                '</div>' +
                                '<div>' +
                                    '<span translate="no" class="lbl  dialogConfirmTitleText"></span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="dialogConfirmBody">' +
                                '<span translate="no" class="lbl dialogConfirmBodyText"></span>' +
                            '</div>' +
                            '<div class="flex flex-right dialogConfirmFooter">' +
                                '<div>' +
                                    '<button class="btn btn-light btnDialogConfirmOk">Ok</button>' +
                                '</div>' +
                                '<div class="hsep10"></div>' +
                                '<div>' +
                                    '<button class="btn btn-light btnDialogConfirmCancel">Cancelar</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</dialog>' +
                '</div>';
            $('body').append(html);
        }

        /**
         * Espacio de nombres color.
         */
        this.color = {
            'success': 1,
            'alert': 2,
            'error': 3,
            'info': 4
        };

        // Pila de cuadros de dialogo.
        this.#dialogStack = [];

        // Maximo de filas a mostrar en un grid.
        this.#searchMaxRows = 10;

        // Nombre de la api.
        this.#api = './api.php';

        // Modo depuracion.
        this.#debugMode = 1;

        /**
         * Espacio de nombres form.
         */
        this.form = {
            /**
             * Espacio de nombres state.
             */
            'state': {
                'noBody': -1,
                'noShow': 0,
                'showing': 1,
                'editing': 2
            },

            'getState': (cnt) => { return this.#getFormState(cnt); },
            'setState': (cnt, state) => { this.#setFormState(cnt, state); },
            'getData': (cnt, emptyValues) => { return this.#getFormData(cnt, emptyValues); },
            'setData': (cnt, data) => { this.#setFormData(cnt, data); },

            /**
             * Espacio de nombres dialog
             */
            'dialog': {
                'show': (url, data, callback) => { this.#dialogShow(url, data, callback); },
                'getCurrent': () => { return this.#dialogGetCurrent(); },
                'setBackwardData': (data) => { this.#dialogSetBackwardData(data) },
                'getBackwardData': () => { return this.#dialogGetBackwardData(); },
                'close': () => { this.#dialogClose(); }
            }
        };

        /**
         * Espacio de nombres 'data'.
         */
        this.data = {
            'save': (cnt, key, value) => { this.#saveData(cnt, key, value); },
            'restore': (cnt, key) => { return this.#restoreData(cnt, key); }
        };

        /**
         * Espacio de nombres format.
         */
        this.format = {
            'thousandSep': ',',
            'decimalSep': '.',
            'dateSep': '/',
            'dateSqlSep': '-',
            'encodeHtml': (text) => { return this.#encodeHtml(text); },
            'fillLeft': (text, char, resultSize) => { return this.#fillLeft(text, char, resultSize); },
            'extractNumbers': (text) => { return this.#extractNumbers(text); },
            'filterString': (text) => { return this.#filterString(text); },
            'numberFormat': (val, dec, tsep) => { return this.#numberFormat(val, dec, tsep); },
            'numberUnFormat': (val) => { return this.#numberUnFormat(val); },
            'formatDate': (date, separator) => { return this.#formatDate(date, separator) }
        };

        /**
         * Espacio de nombres math.
         */
        this.math = {
            'PI': 3.141592653589793,
            'isPrimeNumber': (value) => { return this.#isPrimeNumber(value); }
        };

        /**
         * Espacio de nombres tabs.
         */
        this.tabs = {
            'build': (tabContainer, tabTitle, url, closable) => { return this.#buildTab(tabContainer, tabTitle, url, closable); },
            'closeActiveTab': (tabContainer) => { this.#closeActiveTab(tabContainer); },
            'getActiveTabArea': (tabContainer) => { return this.#getActiveTabArea(tabContainer); },
            'setActiveTabArea': (sharedId) => { this.#setActiveTabArea(sharedId); }
        };

        /**
         * Espacio de nombres grid.
         */
        this.grid = {
            'defaultMaxRows': 5,
            'defaultColumnWidth': '100px',
            'defaultColumnTextAlign': 'left',
            'build': (cnt, struct) => { this.#buildGrid(cnt, struct) },
            'getSelectedRow': (cnt) => { return this.#getSelectedRow(cnt); },
            'getAllRows': (cnt) => { return this.#getAllRows(cnt); },
            'getEmptyRow': (cnt) => { return this.#getEmptyRow(cnt); }
        };

        /**
         * Espacio de nombres menu.
         */
        this.menu = {
            'build': (cnt, struct) => { this.#buildMenu(cnt, struct); }
        };
    }


    /**
     * isEmpty
     * Devuelve true si el valor esta vacío (0, '0', '', false).
     */
    isEmpty(value) {
        return this.#isEmpty(value);
    }


    /**
     * transform2Json
     * Convierte un arreglo javascript en un objeto json.
     */
	transform2Json(a) {
	    return {...a};
	}


    /**
     * selectIcon
     * 
     * Abre el dialogo de seleccion de iconos.
     */
    selectIcon(selectedIcon, callback) {
        this.#selectIcon(selectedIcon, callback);
    }


    /**
     * replicate
     * 
     * Replica un caracter o una cadena.
     */
    replicate(str, times) {
    	// Variables locales.
        var s = '';

        // Valida los parametros.
        if (typeof(str) != 'string') {
        	this.#consoleInternalError("replicate: str, se esperaba una cadena");
        	return s;
        }

        if (str == '') {
        	this.#consoleInternalError("replicate: str, la cadena está vacía");
        	return s;
        }

        if (typeof(times) != "number") {
        	this.#consoleInternalError("replicate: times, se esperaba un valor numerico");
        	return s;
        }

        for (var i = 0; i < times; i++) {
            s += str;
        }

        return s;
    }


    /**
     * showConfirm
     * 
     * Muestra un dialogo de confirmacion de eventos.
     * 
     * Parametros:
     * {icon, title, message, callbackOk, callbackCancel}
     */
    showConfirm(params) {
        // Valida los parametros.
        if (typeof(params) != "object") {
        	this.#consoleInternalError("showConfirm: params, se esperaba un objeto " +
        		"con la estructura: " + "{icon, title, message, callbackOk, callbackCancel}");
        	return;
        }

        if (typeof(params.icon) != "string") {
            params.icon = "";
        }
        if (typeof(params.title) != "string") {
            params.title = "";
        }
        if (this.isEmpty(params.title)) {
        	params.title = "Set a title text";
        }
        if (typeof(params.message) != "string") {
            params.message = "";
        }
        if (this.isEmpty(params.message)) {
        	params.message = "Set a message text";
        }

        if (typeof(params.callbackOk) != "function") {
            params.callbackOk = () => {};
        }

        if (typeof(params.callbackCancel) != "function") {
            params.callbackCancel = () => {};
        }

        var cnt = '#dlg-confirm';
        this.data.save(cnt, 'params', params);

        this.#confirmSetUp();

        var element = document.getElementById('dlg-confirm');
        element.showModal();
    }


    /**
     * showError
     * 
     * Muestra el dialogo de error.
     * 
     * Estructura para mostrar los mensajes de error.
     * 
     * errorStructure {
     * 		title: '',
     * 		message: ''
     * }
     */
	showError(errorStructure) {
		// Oculta dialog-loading.
		this.hideLoading();

		// Si no esta definido el dialogo regresa.
		if ($("#dialog-error").length == 0) {
			this.#consoleInternalError("showError: no se encuentra el elemento: #dialog-error");
			return;
		}

		// Valida la estructura errorStructure.
		if (typeof(errorStructure) == "undefined") {
			this.#consoleInternalError("showError: errorStructure, se esperaba un onjeto con la estructura: errorStructure {title, message}");
			return;
		}

		if (typeof(errorStructure) != "object" ||
			!errorStructure.hasOwnProperty("title") ||
			!errorStructure.hasOwnProperty("message")) {
			var msg = "La estructura 'errorStructure' no es valida o no contiene los campos requeridos";
			this.#consoleInternalError(msg);
			return;
		}

		// Establece las propiedades.
		$(".dialog-error-lbl-title").text(errorStructure.title);
		$(".dialog-error-detail").val(errorStructure.message);

        // Evento para cerrar el dialogo de error.
        $('.dialogErrorBtnOk', '#dialog-error').unbind("click");
        $('.dialogErrorBtnOk', '#dialog-error').click(() => {
            var element = document.getElementById('dialog-error');
            element.close();
        });

		// Muestra el cuadro de dialogo.
        var element = document.getElementById('dialog-error');
        element.showModal();
	};


    /**
     * showLoading
     * Muestra el dialogo de carga de datos.
     * 
     * Parametros:
     * message: (string) con el mensaje que se mostrará en la espera.
     */
    showLoading(message) {
    	if (typeof(message) != "string") {
        	message = '';
        }

    	if (message == '') {
    		message = "Loading data... Please wait";
    	}

        var element = document.getElementById('dlg-loading');
        $('.dialog-loading-lbl-text', $(element)).text(message);
        element.showModal();
    }


    /**
     * hideLoading
     * Oculta el dialogo de carga de datos.
     */
    hideLoading() {
        var element = document.getElementById('dlg-loading');
        element.close();
    }


    /**
     * transform2Array
     * Convierte un objeto en un array.
     * 
     * Parametros.
     * obj: (object) con los datos a convertir.
     * 
     * Retorna: (array) con los elementos.
     */
    transform2Array(obj) {
        // Valida los parametros.
        if (typeof(obj) != 'object') {
            this.#consoleInternalError('transform2Array: obj, se esperaba un objeto');
            return;
        }

        var result = [], i = 0;

        for (var e in obj) {
            result[i++] = obj[e];
        }

        return result;
    }


    /**
     * setMask
     * Establece una mascara a una cadena.
     * 
     * Parametros.
     * str: (string) con la cadena que se quiere enmascarar.
     * mask: (string) con la mascara que de quiere aplicar.
     * 
     * La mascara utiliza el caracter equis minuscula 'x' para representar un
     * caracter de la cadena origen y cualquier otro caracter sera interpretado
     * como un caracter de mascara.
     * 
     * Retorna: (string) con la cadena formateada.
     */
    setMask(str, mask) {
        // Variables locales.
        var si = 0, mi = 0;
        var result = '', char, charMask;

        // Valida los tipos de los parametros.
        if (typeof(str) != 'string') {
            this.#consoleInternalError('setMask: str, se esperaba una cadena');
            return result;
        }

        if (typeof(mask) != 'string') {
            this.#consoleInternalError('setMask: mask, se esperaba una cadena');
            return result;
        }

        // Recorre la cadena.
        while (si < str.length) {
            // Toma el caracter de la cadena.
            char = str.substring(si, si + 1);

            // Si quedan caracteres en la mascara.
            if (mi < mask.length) {
                // Toma el caracter de la mascara.
                charMask = mask.substring(mi, mi + 1);

                // Si debe usar el caracter de la cadena.
                if (charMask == 'x') {
                    result += char;
                    si++;
                } else {
                    result += charMask;
                }

                mi++;
            } else {
                result += char;
                si++;
            }
        }

        return result;
    };


    /**
     * removeChars
     * Elimina los caracteres indicados de una cadena.
     * 
     * Parametros:
     * str: (string) con la cadena a procesar.
     * chars: (string) con los caracteres a eliminar.
     * 
     * Retorna: string con la cadena resultante.
     */
    removeChars(str, chars) {
        var result, charToDelete, char;

        // Valida los tipos de los parametros.
        if (typeof(str) != 'string') {
            this.#consoleInternalError('removeChars: str, se esperaba una cadena');
            return result;
        }

        if (typeof(chars) != 'string') {
            this.#consoleInternalError('removeChars: chars, se esperaba una cadena');
            return result;
        }

        // Recorre la cadena con los caracteres a eliminar.
        for (var i = 0; i < chars.length; i++) {
            // Toma el caracter a eliminar.
            charToDelete = chars.substring(i, i + 1);

            // Inicializa el resultado.
            result = '';

            // Recorre la cadena original.
            for (var k = 0; k < str.length; k++) {
                char = str.substring(k, k + 1);
                if (char != charToDelete) {
                    result += char;
                }
            }

            // Actualiza la cadena procesada.
            str = result;
        }

        return str;
    }


    /**
     * Devuelve un id unico.
     */
    getUniqueId() {
        return uuid.v4();
    }


    /**
     * getNumbers
     * 
     * Toma solo los numeros de una cadena de caracteres.
     */
    getNumbers(str) {
        // Valida los parametros.
        if (typeof(str) != 'string') {
            this.#consoleInternalError("getNumbers: str, se esperaba una cadena");
            return result;
        }

        // Variables locales.
        var result = '', code;

        // Recorre la cadena.
        for (var i = 0; i < str.length; i++) {
            // Toma el codigo del caracter.
            code = str.charCodeAt(i);

            // Si es un numero lo agrega a la cadena resultante.
            if (code >= 48 && code <= 57) {
                result += str.substring(i, i + 1);
            }
        }

        return result;
    }


    /**
     * Muestra un mensaje flotante.
     * @param {string} message Mensaje a mostrar.
     * @param {int} time Tiempo en segundos que será mostrado el mensaje.
     * @param {color} color Color del cuadro que contiene el mensaje
     * @param {function} callback Funcion de retorno.
     */
    showMessage(message, time, color, callback) {
        // Valida los parametros.
        if (typeof(message) != "string") {
            this.#consoleInternalError("showMessage: message, se esperaba una cadena");
            return;
        }
        if (message == '') {
            this.#consoleInternalError("showMessage: message, la cadena está vacía");
            return;
        }
        if (typeof(time) != "number") {
            this.#consoleInternalError("showMessage: time, se esperaba un valor numerico");
            return;
        }
        if (typeof(color) != 'number') {
            this.#consoleInternalError("showMessage: color, se esperaba un valor numerico");
            return;
        }
        if (typeof(callback) != "function") {
            callback = () => {};
        }

        var messageBackgroundColor, messageTitle, messageIcon;

        switch (color) {
            case this.color.success:
                messageTitle = 'Exito';
                messageBackgroundColor = 'green';
                messageIcon = 'icon icon-checkmark';
                break;
            case this.color.warning:
                messageTitle = 'Atención';
                messageBackgroundColor = 'yellow';
                messageIcon = 'icon icon-warning';
                break;
            case this.color.error:
                messageTitle = 'Error';
                messageBackgroundColor = 'red';
                messageIcon = 'icon icon-cancel-circle';
                break;
            case this.color.info:
                messageTitle = 'Información';
                messageBackgroundColor = 'blue';
                messageIcon = 'icon icon-info';
                break;
            default:
                messageTitle = 'Información';
                messageBackgroundColor = 'blue';
                messageIcon = 'icon icon-info';
                break;
        }

        // Muestra el mensaje.
        iziToast.show({
            'position': 'topRight',
            'icon': messageIcon,
            'title': messageTitle,
            'message': message,
            'timeout': time * 1000,
            'maxWidth': '350px',
            'color': messageBackgroundColor,
            'transitionIn': 'bounceInLeft',
            'onClosed': callback,
        });
    }


    /**
     * httpRequest
     * 
     * Ejecuta una peticion ajax a la api.
     * 
     * Parametros:
     * data: Estructura JSON:
     * 
     * data = {
     * 		'idProc': 'procedureIdName',
     *  	'jsonParams': { jsonParameters, ... }
     * }
     * 
     * callback: Funcion que se ejecuta al completarse la peticion http.
     */
	#httpRequest(data, callback) {
	    // Valida los parametros.
	    if (typeof(data) != 'object' ||
	        !data.hasOwnProperty("idProc") ||
	        !data.hasOwnProperty("jsonParams")) {
	        this.#consoleInternalError("ajax: data, no cuenta con la estructura requerida.");
	        return;
	    }

	    if (typeof(callback) != "function") {
	        callback = (response) => {};
	    }

	    $.ajax({
	        'type': 'post',
	        'url': this.#api,
	        'data': data,
	        'dataType': 'json',
	        'error': (xhr, ajaxOptions, thrownError) => {
                if (xhr.status == 0 || xhr.status == 500 ||
                    xhr.textStatus == 'timeout' || xhr.textStatus == 'abort') {
                    var response = {
                        'status': false,
                        'message': 'No hay conexión',
                        'data': {
                            'xhr': xhr,
                            'ajaxOptions': ajaxOptions,
                            'thrownError': thrownError
                        }
                    };
                    console.log(data);
                    callback(response);
                } else {
	        	  this.#errorFunc(xhr, ajaxOptions, thrownError);
                }
	        },
	        'success': (response) => {
	            callback(response);
	        }
	    });
	}


    /**
     * apiFunction
     * 
     * Ejecuta una funcion de la api.
     * 
     * Parametros.
     * procName: (string) con el nombre del procedimiento.
     * procData: (json object) con los datos necesarios para la funcion.
     * callback: (function) funcion que sera ejecutada una vez se tengan los resultados.
     */
	apiFunction(procName, procData, callback) {

	    // Valida los parametros.
	    if (typeof(procName) != "string" || this.isEmpty(procName)) {
	        this.#consoleInternalError("apiFunction: procName, se esperaba una cadena con el nombre del procedimiento");
	        return;
	    }

	    if (typeof(procData) != "object") {
	        this.#consoleInternalError("apiFunction: procData, se esperaba un objeto json");
	        return;
	    }

	    if (typeof(callback) != "function") {
	        this.#consoleInternalError("apiFunction: callback, se esperaba una funcion.");
	        return;
	    }

        // Toma el id de la sesion.

        var sessionId = '';
        if ($('#sessionId').length != 0) {
            sessionId = $('#sessionId').val();
        }

	    var data = {
            'sessionId': sessionId,
	        'idProc': procName,
	        'jsonParams': procData
	    };

	    this.#httpRequest(data, callback);
	}


    /**
     * Enlaza los eventos que controla el comportamiento de los controles de texto.
     */
	linkNativeEvents(cnt) {
        // Valida los parametros.
        if (typeof(cnt) != 'string' && typeof(cnt) != 'object') {
            this.#consoleInternalError("linkNativeEvents: cnt se esperaba un objeto o un string");
            return;
        }

        if (cnt == null) {
            this.#consoleInternalError("linkNativeEvents: cnt en null");
            return;
        }

        if ($(cnt).length == 0) {
            this.#consoleInternalError("linkNativeEvents: cnt no existe el contenedor");
            return;
        }
        
	    // -------------------------
	    // CONTROLES TIPO NUMERICOS.
	    // -------------------------

	    // txb-num: Hace que el control solo acepte valores numericos.
	    // txb-num-<n>dec: <n> = 1 - 6 Establece el numero de posiciones decimales.
	    // m: Establece la mascara #,0.<n> - <n> Cantidad de decimales establecida.

	    // Enlaza el evento focusin.
        $(".txb-num", cnt).unbind('focusin');
	    $(".txb-num", cnt).focusin((e) => {
	        this.#numFocusIn(e.target);
	    });

	    // Enlaza el evento focusout.
	    $(".txb-num", cnt).focusout((e) => { this.#numFocusOut(e.target); });

	    // Enlaza el evento keypress.
	    $(".txb-num", cnt).keypress((e) => { this.#numKeyPress(e); });

	    // Enlaza el evento pegar.
	    $(".txb-num", cnt).bind("paste", (e) => { this.#numPaste(e); });

	    // Establece la alineacion por defecto para los TextBox numericos.
        $(".txb-num", cnt).css("text-align", "right");

        // Aplica el formato a todos los controles numericos.
        var objectList = $('.txb-num', cnt);
        for (var i = 0; i < $(objectList).length; i++) {
            this.#showNumericValue($(objectList[i]));
        }

        // Agrega el cuadro de busqueda a los controles con la clase search.
        objectList = $('.search', cnt);
        var htmlCode, elementWidth;
        for (var i = 0; i < $(objectList).length; i++) {
            // Valida que exista por lo menos un div dentro del div .search.
            if ($(objectList[i]).find('input').length == 0) {
                this.#consoleInternalError("linkNativeEvents: El contenedor .search no contiene ningun input");
                return;
            }

            // Valida que no tenga mas de un input dentro del div .search
            if ($(objectList[i]).find('input').length > 1) {
                this.#consoleInternalError("linkNativeEvents: El contenedor .search contiene mas de un input");
                return;
            }

            // Toma el codigo html del contenedor .search.
            htmlCode = $(objectList[i], cnt).html();

            // Agrega el cuadro para mostrar los resultados de la busqueda.
            htmlCode +=
                '<div class="txbSearchBox">' +
                '</div>';
            $(objectList[i], cnt).html(htmlCode);

            // Toma el ancho del control de busqueda.
            elementWidth = $(objectList[i], cnt).find('input').css('width');

            // Establece el ancho del cuadro de resultados de la busqueda.
            $(objectList[i], cnt).find('.txbSearchBox').css('width', elementWidth);
        }

        // Enlaza el evento keyup para las busquedas.
        $('.txb', $('div.search', cnt)).unbind('keyup');
        $('.txb', $('div.search', cnt)).on('keyup', (event) => {
            // Toma el elemento padre.
            var parent = $(event.currentTarget, cnt).closest('div.search');

            // Toma el valor actual del cuadro de texto y filtra el contenido.
            var text = $(event.currentTarget, cnt).val();
            text = this.format.filterString(text.toUpperCase());

            // Ejecuta la funcion asignada.
            var fn = $(parent, cnt).attr('functionName');
            window[fn](parent, text);
        });

        // Enlaza el evento blur en los cuadros de busqueda.
        $('.txb', $('div.search', cnt)).unbind('blur');
        $('.txb', $('div.search', cnt)).on('blur', (event) => {
            setTimeout(() => {
                // Toma el elemento padre.
                var parent = $(event.currentTarget, cnt).closest('div.search');
    
                // Si se esta mostrando lo blanquea y lo oculta.
                if ($(parent, cnt).find('.txbSearchBox').css('display') == 'block') {
                    // $(parent).find('.txbSearchBox').html('');
                    $(parent, cnt).find('.txbSearchBox').css('display', 'none');
                }
            }, 300);
        });

	    // ----------------------
	    // CONTROLES TIPO STRING.
	    // ----------------------

        // Enlaza el evento focusin.
        $(".txb-str", cnt).unbind('focusin');
        $(".txb-str", cnt).focusin((e) => {
            this.#strFocusIn(e.target);
        });

	    $(".txb-str", cnt).focusout((e) => { this.#strFocusOut(e); });
        
        $(".txb-str-low", cnt).focusout((e) => { this.#strFocusOutLower(e); });

        // Botones Tab (Sig) y Go (Ir).
        $('.txb', cnt).on("keydown", (event) => {
            if (event.keyCode == 9) {
                $(event.currentTarget, cnt).blur();
            }
            if (event.keyCode == 13) {
                $(event.currentTarget, cnt).blur();
            }
        });

        // ---------------------------
        // Cuadro para subir imagenes.
        // ---------------------------

        // Apunta a todos los contenedores de tipo imagen.
        var imageCnt;
        var imageCntList = $('.txb-image');

        // Recorre los contenedores.
        for (var i = 0; i < imageCntList.length; i++) {
            // Apunta al elemento.
            imageCnt = $(imageCntList[i], cnt);

            // Si el contenedor ya fue inicializado lo omite.
            if ($(imageCnt, cnt).attr('init') == 'true') {
                continue;
            }

            // Elimina todo el contenido.
            imageCnt.empty();

            // Establece las propiedades CSS.
            imageCnt.css('cursor', 'pointer');

            // Agrega el input file oculto.
            imageCnt.append('<input translate="no" type="file" accept="image/*" hidden="true">');

            // Agrega el contenedor de la imagen en base64.
            imageCnt.append('<input translate="no" type="text" class="dataBase64" hidden="true">');
    
            // Agrega el contenedor de la imagen.
            imageCnt.append('<img src="" alt="">');

            // Apunta al contenedor de la imagen.
            var img = $(imageCnt.find('img')[0], cnt);

            // Establece el tamaño de la imagen.
            img.css('width', '100%');
            img.css('height', '100%');

            // Establece la imagen inicial.
            img.attr('src', './img/empty-image.jpg');
            
            // Enlaza el evento click.
            imageCnt.unbind('click');
            imageCnt.click((e) => {
                // Si esta deshabilitado regresa.
                if (e.currentTarget.hasAttribute('disabled')) {
                    this.showMessage('Captura de imagen deshabilitada', 2, this.color.alert);
                    return;
                }

                // Apunta al input file oculto.
                var inputFile = $(this, cnt).find('input[type="file"]')[0];

                // Ejecuta el click.
                inputFile.click();
            });

            // Enlaza el evento change al input file oculto.
            var inputFile = imageCnt.find('input[type="file"]')[0];
            $(inputFile, cnt).unbind('change');
            $(inputFile, cnt).change((e) => {
                // Si no se selecciono ningun archivo.
                if (this.files.length == 0) {
                    return;
                }

                // Apunta a este input file.
                var inputFile = this;

                // Apunta al archivo seleccionado, elemento 0 del arreglo.
                var file = this.files[0];

                // Lee el contenido del archivo.
                var fileReader = new FileReader();

                // Enlaza el evento load.
                fileReader.addEventListener('load', (t) => {
                    // Apunta al contenedor de la imagen.
                    var imageCnt = $($(inputFile, cnt).closest('.txb-image')[0]);

                    // Apunta al elemento img en el contenedor.
                    var img = $(imageCnt.find('img')[0]);

                    // Toma las dimensiones del contenedor.
                    var w = parseInt($(img, cnt).css('width')),
                        h = parseInt($(img, cnt).css('height'));

                    // Reduce el tamaño de la imagen a las dimensiones del contenedor.
                    var canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    
                    // var imageItem = document.createElement('img');
                    var imageItem = new Image();
                    imageItem.onload = () => {
                        imageItem.width = w;
                        imageItem.height = h;

                        var context2d = canvas.getContext('2d');
                        context2d.drawImage(imageItem, 0, 0, w, h);

                        var finalImageData = canvas.toDataURL();

                        // Toma la imagen con menor tamaño.
                        var imageDataBase64;
                        if (finalImageData.length < fileReader.result.length) {
                            imageDataBase64 = finalImageData;
                        } else {
                            imageDataBase64 = fileReader.result;
                        }

                        // Si sobrepasa los 512,000 caracteres no se puede guardar.
                        if (imageDataBase64.length > 512000) {
                            this.showMessage('La imagen es demasiado grande', 2, this.color.error);
                            return;
                        }

                        // Coloca el contenido en base64 en el campo.
                        var dataBase64 = $(imageCnt.find('.dataBase64')[0], cnt);
                        $(dataBase64, cnt).val(imageDataBase64);

                        // Establece la imagen seleccionada.
                        $(img, cnt).attr('src', imageDataBase64);
                    }

                    // Establece el contenido al objeto Image.
                    imageItem.src = fileReader.result;
                });

                // Realiza la carga del archivo.
                fileReader.readAsDataURL(file);
            });

            // Marca el contenedor como inicializado.
            $(imageCnt, cnt).attr('init', 'true');
        }
	}


    /**
     * isValidNumber
     * Devuelve true si la cadena contiene un numero valido.
     * @param {string} value Cadena que se desea evaluar.
     * @returns Retorna true si la cadena contiene un numero válido.
     */
    isValidNumber(strValue) {
        // Variables locales.
        var sign = false;
        var decimalPoint = false;

        // Valida los parametros.
        if (typeof(strValue) != "string") {
        	this.#consoleInternalError("isValidNumber: strValue, se esperaba una cadema");
            return false;
        }

        if (strValue == '') {
        	strValue = '0';
        }

        // Recorre la cadena validando el contenido.
        for (var i = 0; i < strValue.length; i++) {
            // Si es el signo.
            if (strValue[i] == '+' || strValue[i] == '-') {
                if (sign || i != 0) {
                    return false;
                }

                sign = true;
                continue;
            }

            // Si es el punto decimal.
            if (strValue[i] == this.format.decimalSep) {
                if (decimalPoint) {
                    return false;
                }

                decimalPoint = true;
                continue;
            }

            // Si es un digito.
            else if (strValue[i].charCodeAt(0) >= 48 && strValue[i].charCodeAt(0) <= 57) {
                continue;
            }

            // Cualquier otro caracter no es valido.
            return false;
        }

        return true;
    }


    /**
     * search
     * 
     * Busqueda de registros.
     * 
     * @param {json} params Objeto json con los parametros de la busqueda.
     * @returns none
     * 
     * Realiza una busqueda de registros.
     * 
     * La estructura del objeto params debe ser la siguiente:
     * title:       Titulo para el cuadro de dialogo.
     * method:      Nombre de la funcion que realizará la consulta.
     * column1      Titulo para la columna del campo numero 1.
     * field1       Nombre del campo numero 1.
     * column2      Titulo para la columna del campo numero 2.
     * field2       Nombre del campo numero 2.
     * fieldId      Nombre del campo que debe retornar.
     * callback     (function) funcion de retorno.
     */
    search(params) {
        // Valida la estructura params.
        if (typeof(params) != "object" ||
            !params.hasOwnProperty("title") ||
            !params.hasOwnProperty("column1") ||
            !params.hasOwnProperty("field1") ||
            !params.hasOwnProperty("column2") ||
            !params.hasOwnProperty("field2") ||
            !params.hasOwnProperty("method") ||
            !params.hasOwnProperty("fieldId") ||
            !params.hasOwnProperty("callback")) {
            var msg = "search: La estructura 'params' no es valida o no contiene los campos requeridos";
            this.#consoleInternalError(msg);
            return;
        }

        // Valida la funcion de retorno.
        if (typeof(params.callback) != "function") {
            var msg = "searchRecord: no ha especificado una funcion callback válida";
            this.#consoleInternalError(msg);
            return;
        }

        // Guarda los parametros en el formulario.
        this.data.save('#dlg-search', 'params', params);

        this.#searchSetUp(params);

        // Carga el formulario de busqueda.
        var element = document.getElementById('dlg-search');
        element.showModal();
    }


    /**
     * Funciones privadas.
     */

    /**
     * Inicializa el formulario de busqueda.
     */
    #searchSetUp() {
        var cnt = '#dlg-search';
        var params = core.data.restore(cnt, 'params');

        // Establece las propiedades.
        $('.dialogSearchTitleText', cnt).text(params.title);
        
        // Inicializa el cuadro de busqueda.
        $('.dialog-search-txb-search', cnt).val('');

        // Muestra los datos iniciales del grid.
        this.#searchShowData({});

        // Enlaza los eventos.
        $(".dialog-search-btn-search", cnt).unbind("click");
        $(".dialog-search-btn-search", cnt).click(() => {
            var textToFind = $(".dialog-search-txb-search", cnt).val();
            this.#searchFindClick(textToFind);
        });
        
        $(".dialogSearchBtnOk", cnt).unbind("click");
        $(".dialogSearchBtnOk", cnt).click(() => {
            this.#searchOkClick();
        });
        
        $(".dialogSearchBtnCancel", cnt).unbind("click");
        $(".dialogSearchBtnCancel", cnt).click(() => {
            var element = document.getElementById('dlg-search');
            element.close();
        });
    }


    /**
     * Muestra la informacion en el grid de busqueda.
     */
    #searchShowData(data) {
        var cnt = '#dlg-search';
        var params = core.data.restore(cnt, 'params');

        var gridStructure = {
            'tableTitle': params.title,
            'columns': [
                {'title': params.fieldId, 'width': '50px', 'field': params.fieldId, 'hide': true},
                {'title': params.column1, 'width': '150px', 'field': params.field1},
                {'title': params.column2, 'width': '350px', 'field': params.field2}
            ],
            'rows': data,
            'showMaxRows': this.#searchMaxRows,
            'onClick': (r) => {}
        };

        this.grid.build($('.dialogSearchGridBox', cnt), gridStructure);
    }

    /**
     * searchFindClick
     * Realiza la busqueda en la base de datos según el criterio indicado.
     * 
     * Parametros:
     * textToFind: (string) con el texto que se desea encontrar en el campo de busqueda.
     * 
     * Retorna:
     * (Array): con los resultados de la busqueda.
     */
    #searchFindClick(textToFind) {
        if (typeof(textToFind) != "string") {
            var msg = "searchFindClick: se esperaba un string";
            this.#consoleInternalError(msg);
            return;
        }

        var cnt = '#dlg-search';
        var params = core.data.restore(cnt, 'params');

        this.showLoading();
        this.apiFunction(params.method, {'textToFind': textToFind}, (response) => {
            this.hideLoading();
            if (!response.status) {
                core.showMessage(response.message, 4, core.color.error);
                return;
            }
            this.showMessage(response.message, 4, core.color.success);
            this.#searchShowData(response.data);
        });
    }


    /**
     * searchOkClick
     */
    #searchOkClick() {
        var cnt = '#dlg-search';
        var params = core.data.restore(cnt, 'params');

        var row = core.grid.getSelectedRow($(".dialogSearchGridBox", cnt));

        // Valida que se haya seleccionado un registro del grid.
        if (!row.hasOwnProperty(params.fieldId)) {
            core.showMessage("Primero debe seleccionar un registro", 3, core.color.alert);
            return;
        }
        
        // Toma y guarda el id del registro seleccionado.
        var fieldId = row[params.fieldId];
        core.form.dialog.setBackwardData(fieldId);
        
        var element = document.getElementById('dlg-search');
        element.close();
        params.callback();
    }


    /**
     * Devuelve true si el numero dado es primo.
     */
    #isPrimeNumber(value) {
        if (typeof(value) != 'number') {
            return false;
        }
        
        if (value == 0 || value == 1 || value == 4) {
            return false;
        }

        for (var x = 2; x < (value / 2); x++) {
            if (value % x == 0) return false;
        }

        return true;
    }

    
    /**
     * #encodeHtml
     * @param {string} text Texto a codificar.
     * @returns Texto codificado.
     * 
     * Codifica un texto para ser insertado como contenido html sin que este
     * sea procesado por el navegador.
     */
    #encodeHtml(text) {
        return text.replace(/&/g, "&amp;")
                .replace(/>/g, "&gt;")
                .replace(/</g, "&lt;")
                .replace(/"/g, "&quot;");
    }


    /**
     * Rellena con ceros a la izquierda.
     */
    #fillLeft(text, char, resultSize) {
        if (text == null) {
            text = '';
        }

        if (typeof(text) != 'string') {
            text = text.toString();
        }

        if (typeof(char) != 'string') {
            this.#consoleInternalError("fillLeft: char, se esperaba una cadena");
            return '';
        }

        if (typeof(resultSize) != 'number') {
            this.#consoleInternalError("fillLeft: resultSize, se esperaba un numero");
            return '';
        }

        if (text.length >= resultSize) {
            return text;
        }

        return char.repeat(resultSize - text.length) + text;
    }


    /**
     * Extrae solo los numeros de una cadena.
     * @param {text} value 
     * @returns 
     */
    #extractNumbers(text) {
        if (typeof(text) != 'string') {
            this.#consoleInternalError("extractNumbers: text, se esperaba una cadena");
            return '0';
        }

        var number = '';

        for (var i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) {
                number += text[i];
            }
        }

        if (number == '') {
            number = '0';
        }

        return number;
    }


    /**
     * Filtra una cadena de caracteres especiales.
     * @param text - Texto a filtrar
     */
    #filterString(text) {
        if (typeof(text) != 'string') {
            this.#consoleInternalError("filterString: text, se esperaba una cadena");
            return '0';
        }

        var textFiltered = '';

        for (var i = 0; i < text.length; i++) {
            // Si es un numero.
            if (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) {
                textFiltered += text[i];
            }

            // Si es una letra [a-z] o [A-Z].
            if ((text.charCodeAt(i) >= 97 && text.charCodeAt(i) <= 122) ||
                (text.charCodeAt(i) >= 65 && text.charCodeAt(i) <= 90)) {
                textFiltered += text[i];
            }

            // Si es la eñe [ñ-Ñ].
            if (text.charCodeAt(i) >= 164 && text.charCodeAt(i) <= 165) {
                textFiltered += text[i];
            }
            
            // Si es un simbolo: espace#[]+-*/.,<>:;^@=()$!_{}
            switch (text.charCodeAt(i)) {
                case 32:
                case 33:
                case 35:
                case 36:
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 58:
                case 59:
                case 60:
                case 61:
                case 64:
                case 62:
                case 91:
                case 93:
                case 94:
                case 95:
                case 123:
                case 125:
                    textFiltered += text[i];
                    break;
            }
        }

        return textFiltered;
    }


    /**
     * #dialogShow
     * @param {string} url Ruta y nombre del archivo a cargar.
     * @param {json} data Datos que se desean pasar al formulario.
     * @param {function} callback Funcion de retorno.
     * @returns 
     */
    #dialogShow(url, data, callback) {
        // Valida los parametros.
        if (typeof(url) != 'string') {
            url = '';
        }

        url = url.trim();

        if (url == '') {
            this.#consoleInternalError('#showDialog: url, Se esperaba una cadena con la direccion url');
            return;
        }

        if (typeof(data) != 'object') {
            this.#consoleInternalError('#showDialog: data, Se esperaba un objeto json');
            return;
        }

        if (typeof(callback) != 'function') {
            callback = () => {};
        }

        // Genera un nuevo dialogo.
        var dialogName = this.#dialogPush();
        var dialog = document.getElementById(dialogName);

        // Sobreescribe el evento cancel.
        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
            this.#dialogClose();
        });

        // Nombre del contenedor.
        var cntName = '#' + dialogName;

        // Guarda la funcion de retorno en el formulario.
        this.data.save(cntName, 'callback', callback);

        // Guarda los parametros en el formulario.
        this.data.save(cntName, 'params', data);
        
        // Carga el contenido de la url.
        this.showLoading();
        $(cntName).load(url, () => {
            this.hideLoading();

            // Muestra el dialogo.
            dialog.showModal();
        });
    }


    /**
     * Guarda un nombre de cuadro de dialogo en la pila.
     */
    #dialogPush() {
        var dialogName = 'dlg-' + this.getUniqueId();
        var element = '<dialog id="' + dialogName + '" class="coreDialog"></dialog>';
        $('#dialogBox').append(element);

        var index = this.#dialogStack.length;
        this.#dialogStack[index] = dialogName;

        return dialogName;
    }


    /**
     * Devuelve el nombre del dialogo actual.
     */
    #dialogGetCurrent() {
        var index = this.#dialogStack.length;
        var dialogName = '';
        if (index > 0) {
            dialogName = this.#dialogStack[index - 1];
        }
        return dialogName;
    }


    /**
     * Guarda datos para ser recuperados desde otro formulario.
     */
    #dialogSetBackwardData(data) {
        this.data.save('#dialogBox', 'dialogBackwardData', data);
    }


    /**
     * Recupera los ultimos datos almacenados.
     */
    #dialogGetBackwardData() {
        var data = this.data.restore('#dialogBox', 'dialogBackwardData');
        if (typeof(data) == 'undefined') {
            data = {};
        }
        return data;
    }


    /**
     * Saca un dialogo de la pila.
     */
    #dialogPop() {
        if (this.#dialogStack.length == 0) {
            return;
        }
        var e = this.#dialogStack.length - 1;
        var dialogName = this.#dialogStack[e];
        $('#dialogBox').remove('#' + dialogName);
        var newStack = [];
        for (var i = 0; i < this.#dialogStack.length - 1; i++) {
            newStack[i] = this.#dialogStack[i];
        }
        this.#dialogStack = newStack;
    }


    /**
     * Cierra un dialogo.
     */
    #dialogClose() {
        if (this.#dialogStack.length == 0) {
            return;
        }
        var e = this.#dialogStack.length - 1;
        var dialogName = this.#dialogStack[e];
        var callback = this.data.restore('#' + dialogName, 'callback');

        var dialog = document.getElementById(dialogName);
        dialog.close();

        this.#dialogPop();
        callback();
    }


    /**
     * Guarda la copia de un objeto/variable en un elemento html.
     */
    #saveData(cnt, key, value) {
    	// Valida que se encuentre definido el contenedor.
		if ($(cnt).length == 0) {
			this.#consoleInternalError("#saveData: containerName, el contenedor '" + cnt + "' no esta definido");
			return null;
		}

    	if (typeof(key) != 'string') {
    		this.#consoleInternalError("#saveData: key, se esperaba una cadena");
    		return null;
    	}

    	if (this.isEmpty(key)) {
    		this.#consoleInternalError("#saveData: key, la cadena esta vacía");
    		return null;
    	}

    	if (typeof(value) == "undefined" || (typeof(value) == "object" && value == null)) {
    		this.#consoleInternalError("#saveData: value, se esperaba un valor o un objeto != null");
    		return null;
    	}

    	// Guarda los datos.
    	$(cnt).data(key, value);
    };


    // 
    // Recupera la copia de un objeto/variable en un elemento html.
    #restoreData(cnt, key) {
    	// Valida que se encuentre definido el contenedor.
		if ($(cnt).length == 0) {
			this.#consoleInternalError("#restoreData: " + cnt + ", el contenedor no " + "esta definido");
			return null;
		}

    	if (typeof(key) != "string") {
    		this.#consoleInternalError("#restoreData: key, se esperaba una cadena");
    		return null;
    	}

    	if (this.isEmpty(key)) {
    		this.#consoleInternalError("#restoreData: key, la cadena esta vacía");
    		return null;
    	}

    	return $(cnt).data(key);
    }


    /**
     * isEmpty
     * Valida si el contenido de una variable es 'vacio'.
     * 
     * Parametros:
     * value: nombre de la variable que sera evaluada.
     * 
     * Retorna: true si el contenido de la variable esta vacio o si la variable no se
     * encuentra definida, de lo contrario retorna false.
     */
    #isEmpty(value) {
        return (value === undefined || value === null || value === false ||
            value === '' || value === '0' || value === 0 || value === 'false');
    }


    /**
     * #consoleInternalError
     * @param {*} msg Mensaje a mostrar por la consola.
     * Despliega por la consola un mensaje de error interno, por lo general referente
     * a las validaciones que se realizan dentro de las funciones.  Ademas, lanza un
     * alert() indicando que se desplegó el mensaje de error en la consola del
     * navegador.
     */
    #consoleInternalError(message) {
        // if (typeof(this.hideLoading) == "function") {
        //     this.hideLoading();
        // }
        if (typeof(console) == 'object') {
            console.log(message);
            if (typeof(alert) == 'function') {
                alert("Internal Error: please check console for details");
            }
        }
    }


    /**
     * Tabs.
     */
    
    /**
     * buildTab
     * Construye una pestaña con su cuerpo y la agrega al contenedor indicado.
     * 
     * Parametros.
     * tabContainer: nombre del elemento contenedor del sistema de pestañas.
     * tabTitle: titulo que mostrara la pestaña.
     * closable: indica si la pestaña debe tener el boton de cerrar.
     */
	#buildTab(tabContainer, tabTitle, url, closable) {
	    // Puntero al contenedor principal del sistema de pestañas.
	    var tabSystemContainer;

        // Puntero de elementos (generico).
        var tabElement, id;

	    // Valida la existencia del contenedor principal.
        if ($(tabContainer).length == 0) {
            this.#consoleInternalError('El contenedor ' + tabContainer + ' no se encuentra definido');
            return '';
        }

        // Apunta al contenedor indicado como principal del sistema de pestañas.
        tabSystemContainer = $(tabContainer)[0];

        // Si dentro del contenedor principal no existe la propiedad 'tab-system'.
        if ($('>[tab-system]', tabSystemContainer).length == 0) {
            // Genera el id para el contenedor primario del sistema de pestañas.
            id = this.getUniqueId();

            // Construye el contenedor primario del sistema de pestañas.
            var html =
                '<div tab-system="' + id + '">' +
                    '<div class="__tab-header-cnt">' +
                    '</div>' +
                    '<div class="__tab-body-cnt">' +
                    '</div>' +
                '</div>';

            // Sobreescribe el contenido del contenedor principal con el contenedor primario
            // del sistema de pestañas.
            $(tabSystemContainer).html(html);
        } else {
            id = $('>[tab-system]', tabSystemContainer).attr('tab-system');
        }

        // Valida los parametros.
	    if (typeof(tabTitle) != "string" || tabTitle == "") {
	        tabTitle = "newTab";
	    }

	    if (typeof(url) != "string") {
	    	url = "";
	    }

	    // Si no se especifica, por defecto la pestaña se puede cerrar.
	    if (typeof(closable) != "boolean") {
	        closable = true;
	    }

	    // Id Shared es el id compartido entre la pestaña y el cuerpo.
        var sharedId = this.getUniqueId();

	    // Codigo html de la pestaña.
	    var tabHeaderHTML =
	        '<div ' +
	            'class="__tab-header __tab-active" ' +
                'shared-id="' + sharedId + '">' +
        	        '<div class="' +
                        (closable ? '__tab-header-title-closable-cnt' : '__tab-header-title-cnt') + '">' +
        	            '<span translate="no" class="__tab-header-title">' + tabTitle + '</span>' +
        	        '</div>';

	    // Si la pestaña se puede cerrar.
	    if (closable) {
	        tabHeaderHTML +=
	            '<div class="__tab-header-close-btn-cnt">' +
	               '<span translate="no" class="icon icon-cross __tab-header-close-btn"></span>' +
	            '</div>';
	    }

	    tabHeaderHTML +=
	        '</div>';

	    // Codigo html del cuerpo de la pestaña.
	    var tabBodyHTML =
	        '<div ' +
                'class="__tab-body" shared-id="' +  sharedId + '">' +
	        '</div>';

	    // Desmarca la pestaña que se encuentra activa dentro de este sistema de pestañas.
        tabElement = '[tab-system="' + id + '"]>.__tab-header-cnt>.__tab-header.__tab-active';
        $(tabElement).removeClass('__tab-active');

	    // Agrega la pestaña en el __tab-header-cnt de este sistema de pestañas.
        tabElement = '[tab-system="' + id + '"]>.__tab-header-cnt';
        $(tabElement).append(tabHeaderHTML);

	    // Oculta todos los cuerpos existentes en este sistema de pestañas.
        tabElement = '[tab-system="' + id + '"]>.__tab-body-cnt>.__tab-body';
        $(tabElement).css("display", "none");

	    // Agrega el cuerpo de la pestaña.
        tabElement = '[tab-system="' + id + '"]>.__tab-body-cnt';
        $(tabElement).append(tabBodyHTML);

	    // Enlaza los eventos.
        tabElement = '[shared-id="' + sharedId + '"].__tab-header';
	    $(tabElement).unbind("click");
	    $(tabElement).click((t) => { this.#headerClick(t); });

	    if (closable) {
            tabElement = '[shared-id="' + sharedId + '"].__tab-header>.__tab-header-close-btn-cnt';
	        $(tabElement).unbind("click");
	        $(tabElement).click(() => { this.#closeTab(sharedId); });
	    }

	    // Agrega el contenido a la pestaña.
	    if (url != '') {
            tabElement = '[shared-id="' + sharedId + '"].__tab-body';
	    	this.showLoading();
	    	this.loadHTML($(tabElement), url, {}, this.hideLoading);
	    }

	    return sharedId;
	}


    /**
     * headerClick
     * Evento click de la pestaña, establece la pestaña como activa.
     * 
     * Parametros:
     * t: Listener del evento.
     */
	#headerClick(t) {
        // Puntero a elemento generico.
        var tabElement, selectedTab;

        if (typeof(t) == 'object' && t != null && t.hasOwnProperty('currentTarget')) {
            selectedTab = $(t.currentTarget);
        } else {
            selectedTab = t;
        }

        // Toma el id del sistema de pestañas.
        var id = $(selectedTab).closest('[tab-system]').attr('tab-system');

	    // Desmarca la pestaña actualmente activa.
        tabElement = '[tab-system="' + id + '"]>.__tab-header-cnt>.__tab-active';
	    $(tabElement).removeClass("__tab-active");

	    // Marca esta pestaña como activa.
	    $(selectedTab).addClass("__tab-active");

	    // Oculta el todos los body.
        tabElement = '[tab-system="' + id + '"]>.__tab-body-cnt>.__tab-body';
        $(tabElement).css("display", "none");

	    // Muestra el body correspondiente a la pestaña clickeada.
        var sharedId = $(selectedTab).attr('shared-id');
	    tabElement = '[shared-id="' + sharedId + '"].__tab-body';
	     $(tabElement).css("display", "block");
	}


    /**
     * closeTab
     * Cierra un tab.
     * 
     * Parametros.
     * t: Listener del evento.
     */
	#closeTab(sharedId) {
        // Puntero a elementos (generico).
        var tabElement;

        // Apunta al header de la pestaña.
        tabElement = '[shared-id="' + sharedId + '"].__tab-header';
        var tabHeader = $(tabElement);

        // Valida que exista.
        if ($(tabHeader).length == 0) {
            this.#consoleInternalError('closeTab: sharedId no existe');
            return;
        }

	    // Toma el id del sistema de pestañas.
	    var id = $(tabHeader).closest('[tab-system]').attr('tab-system');

	    // Guarda si la pestaña que se esta cerrando es la que se encuentra activa.
        tabElement = '[shared-id="' + sharedId + '"].__tab-header';
	    var isActiveTab = $(tabElement).hasClass("__tab-active");

        // Toma el id compartido de la pestaña que quedara activa cuando este se cierre.
        var tabList = $('[tab-system="' + id + '"]>.__tab-header-cnt>.__tab-header');
        var nextTabActive = '';

        // Si la pestaña a cerrar se encontraba activa.
        if (isActiveTab) {
            for (var i = 0; i < $(tabList).length; i++) {
                // Si es la pestaña activa.
                if ($($(tabList[i])).hasClass('__tab-active')) {
                    // Si tiene pestañas a su izquierda.
                    if (i > 0) {
                        // Toma el id de la pestaña de la izquierda.
                        nextTabActive = $($(tabList[i - 1])).attr('shared-id');
                    }

                    // Si tiene pestañas a su derecha.
                    else if ((i + 1) < $(tabList).length) {
                        // Toma el share-id de la pestaña de la derecha.
                        nextTabActive = $($(tabList[i + 1])).attr('shared-id');
                    }

                    break;
                }
            }
        }

	    // Elimina la pestaña y el cuerpo.
        tabElement = '[shared-id="' + sharedId + '"]';
	    $(tabElement).remove();

        // Si encontro una pestaña disponible la activa.
        if (nextTabActive != '') {
            tabElement = '[shared-id="' + nextTabActive + '"].__tab-header';
            $(tabElement).click();
        }
	}


    /**
     * closeActiveTab
     * Cierra la pestaña activa.
     * 
     * Parametros:
     * tabContainer: nombre del contenedor de las pestañas.
     */
	#closeActiveTab(tabContainer) {
        // Apunta a la pestaña activa.
        var tabElement = $('>[tab-system]>.__tab-header-cnt>.__tab-header.__tab-active', tabContainer)[0];

	    // Si existe el contenedor.
	    if ($(tabElement).length != 0) {
	        // Toma el shared-id.
            var sharedId = $(tabElement).attr('shared-id');
	        this.#closeTab(sharedId);
	    }
	};


    /**
     * getActiveTabArea
     * Devuelve un objeto que representa el area de trabajo activa de una pestaña el
     * contenedor indicado.
     * 
     * Parametros:
     * tabContainer: nombre del contenedor de las pestañas.
     * 
     * Si no se consigue una pestaña activa dentro del contenedor devuelve cadena vacia.
     */
	#getActiveTabArea(tabContainer) {
        var selector;

        // Toma el id del sistema de pestañas.
        selector = '>[tab-system]';
        var id = $($(selector, tabContainer)[0]).attr('tab-system');

        // Toma el shared-id de la pestaña activa.
        selector = '[tab-system="' + id + '"]>.__tab-header-cnt>.__tab-header.__tab-active';
        var sharedId = $(selector).attr('shared-id');

        // Apunta al area de trabajo activa.
        selector = '[shared-id="' + sharedId + '"].__tab-body';
	    var activeTabArea = $(selector);

	    return activeTabArea
	}


    /**
     * setActiveTabArea
     * Activa (establece el foco) en una pestaña.
     * 
     * Parametros:
     * sharedId: id compartido entre la cabecera y el cuerpo de la pestaña.
     */
    #setActiveTabArea(sharedId) {
        // Apunta a la pestaña.
        var tab = $('.__tab-header[shared-id="' + sharedId + '"]');

        if (tab.length != 0) {
            this.#headerClick(tab);
        } else {
            console.log('No existe');
        }
    }


    /**
     * Espacio de nombres 'form'.
     */

    /**
     * getFormState
     * Devuelve el estado actual del formulario.
     */
    #getFormState = (container) => {
        // Valida los parametros.
        if ($(container).length == 0) {
            this.#consoleInternalError("getFormState: el contenedor '" + container + "' no existe");
            return;
        }

        var state = $(container).data("formState");

        if (typeof(state) != "number") {
        	state = this.form.state.noBody;
        }

    	return state;
    }


    /**
     * setFormState
     * Establece el estado del formulario, vacio (__no_show), mostrando un registro (__showing)
     * o editando un registro (__editing).
     * 
     * Una vez cambiado el estado se habilitan/desabilitan los controls que contengan la clase
     * enable-noshow, enable-showing o enable-editing
     * 
     * Parametros:
     * container: (string) nombre del contenedor del formulario.
     * state: (number) Estado del formulario.
     */
    #setFormState = (container, state) => {
        // Valida los parametros.
    	if ($(container).length == 0) {
    		this.#consoleInternalError("setFormState: container, no esta definido");
    		return null;
    	}

        if (typeof(state) != 'number') {
            this.#consoleInternalError("setFormState: tipo del parametro 'state' no valido");
            return null;
        }

        var stateDefined = false;
        for (var i in this.form.state) {
        	if (state == this.form.state[i]) {
        		stateDefined = true;
        		break;
        	}
        }

        if (!stateDefined) {
        	this.#consoleInternalError("setFormState: state, estado no valido: " + state.toString());
        	return;
        }

        // Guarda el nuevo estado del formulario.
        this.data.save(container, 'formState', state);

        // Apaga todos los controles con la clase enable.
        $(".enable-nobody", container).attr("disabled", true);
        $(".enable-noshow", container).attr("disabled", true);
        $(".enable-showing", container).attr("disabled", 'disabled');
        $(".enable-editing", container).attr("disabled", 'disabled');

        // Enciende los controles que correspondan con el estado del formulario.
        switch (state) {
            case this.form.state.noBody:
                $(".enable-nobody", container).removeAttr("disabled");
                break;

            case this.form.state.noShow:
                $(".enable-noshow", container).removeAttr("disabled");
                break;

            case this.form.state.showing:
                $(".enable-showing", container).removeAttr("disabled");
                break;

            case this.form.state.editing:
                $(".enable-editing", container).removeAttr("disabled");
                break;
        }
    }


    /**
     * getFormData
     * Toma los valores contenidos en los controles que se encuentran en el
     * contenedor padre indicado.
     * 
     * Los elementos soportados son input (text, number, date, password, checkbox),
     * textarea y select.
     * 
     * Los elementos deben tener un nombre (tag: name="myname") y la clase
     * txb (tag: class="txb")
     * 
     * Parametros:
     * container: nombre del contenedor padre de los controles incluyendo el
     * punto (.) si este es una clase o el simbolo de numeral (#) si es un id.
     * 
     * emptyValues: valor logico (boolean) que indica si debe retornar la estructa
     * con todos los valores vacios por defecto, si no se indica se asume false.
     * 
     * Retorna:
     * Un arreglo asociativo donde el nombre de cada elemento es el mismo establecido
     * en la etiqueta 'name' del control y el valor correspondiente.
     */
    #getFormData = (container, emptyValues) => {
    	// Valida los parametros.
    	if (typeof(container) != 'object' && typeof(container) != "string") {
        	this.#consoleInternalError("getFormData: container, se esperaba un objeto jQuery o una cadena");
            return {};
        }

        if (this.isEmpty(container)) {
        	this.#consoleInternalError("getFormData: container, la cadena esta vacía");
            return {};
        }

        if ($(container).length == 0) {
            this.#consoleInternalError("getFormData: el contenedor '" + container + "' no existe");
            return {};
        }

        // Valida el parametro emptyValues.
        if (typeof(emptyValues) != "boolean") {
            emptyValues = false;
        }

        // Variables locales.
        var r = [];
        var objectList, objectName, tagName, objectType, i, obj;
        var isNumericField;

        // Toma la lista de elementos que se encuentran en el contenedor.
        objectList = $(".txb", container);

        // Recorre la lista de elementos.
        for (i = 0; i < objectList.length; i++) {
            // Toma el siguiente elemento de la lista, su tagName, name y type.
            obj = $(objectList[i]);
            tagName = $(obj).prop('nodeName');
            if (typeof(tagName) == 'string') {
                tagName = tagName.toLowerCase();
            }
            objectName = $(obj).attr('name');
            objectType = $(obj).prop('type');

            // Evalua el tagName.
            switch (tagName) {
                // tag: div.
                case 'div':
                    // Si contiene la clase .txb-image
                    if ($(obj).hasClass('txb-image')) {
                        var txbDataBase64 = $(obj).find('.dataBase64');
                        if (txbDataBase64.length == 0) {
                            r[objectName] = '';
                        } else {
                            r[objectName] = $(txbDataBase64).val();
                        }
                    }
                    break;

                // tag: input.
                case 'input':
                    isNumericField = false;

                    // Evalua el tipo.
                    switch (objectType) {
                        // Si es text, number, date o password.
                        case 'text':
                        case 'tel':
                            if ($(obj).hasClass('txb-num')) {
                                isNumericField = true;
                            }
                        case 'date':
                        case 'password':
                            if (emptyValues) {
                                r[objectName] = '';
                            } else {
                                if (isNumericField) {
                                    r[objectName] = this.format.numberUnFormat($(obj[0]).val());
                                } else {
                                    r[objectName] = $(obj[0]).val();
                                }
                            }
                            break;

                        case 'number':
                            if (emptyValues) {
                                r[objectName] = '0';
                            } else {
                                r[objectName] = $(obj[0]).val();
                            }
                            break;

                            // Si es checkbox.
                        case 'checkbox':
                            if (emptyValues) {
                                r[objectName] = false;
                            } else {
                                r[objectName] = obj[0].checked;
                            }
                            break;
                    }

                    break;

                    // tag: select.
                case 'select':
                    if (emptyValues) {
                        r[objectName] = '0';
                    } else {
                        r[objectName] = $(obj[0]).val();
                    }
                    break;

                    // tag: textarea.
                case 'textarea':
                    if (emptyValues) {
                        r[objectName] = '';
                    } else {
                        r[objectName] = $(obj[0]).val();
                    }
                    break;
            }
        }

        return r;
    }


    /**
     * setFormData
     * Establece los valores a los controles que se encuentren dentro de un contenedor
     * especifico, los elementos soportados son: input (text, number, date, password,
     * checkbox), textarea y select.
     * 
     * Los elementos deben tener un name (tag: name="myname") y la clase txb (class="txb")
     * 
     * Parametros:
     * container: nombre del contenedor padre de los controles incluyendo el
     * punto (.) si este es una clase o el simbolo de numeral (#) si es un id.
     * 
     * data: arreglo asociativo que contiene los valores que se desean mostrar, los nombres
     * de los elementos deben coincidir con los nombres establecidos en el atributo name.
     */
    #setFormData = (container, data) => {
        // Valida los parametros.
        if (typeof(container) != 'string' && typeof(container) != 'object') {
        	this.#consoleInternalError("setFormData: container, se esperaba un objeto o una cadena");
            return;
        }

        if (this.isEmpty(container)) {
        	this.#consoleInternalError("setFormData: container, la cadena esta vacía");
            return;
        }

        if ($(container).length == 0) {
            this.#consoleInternalError("setFormData: el contenedor '" + container + "' no existe");
            return;
        }

        if (typeof(data) != 'object') {
        	this.#consoleInternalError("setFormData: data, se esperaba un objeto/array");
            return;
        }

        if (data == null) {
        	this.#consoleInternalError("setFormData: data, es un valor nulo");
            return;
        }

        // Variables locales.
        var objectList, objectName, objectType, tagName, i, obj;
        var decimalPlaces, thousandSep;

        // Toma la lista de elementos que se encuentran en el contenedor.
        objectList = $(".txb", container);

        // Recorre la lista de elementos.
        for (i = 0; i < $(objectList).length; i++) {
            // Toma el siguiente elemento de la lista, su tagName, name y type.
            obj = $(objectList[i]);
            tagName = $(obj).prop('nodeName');
            if (typeof(tagName) == 'string') {
                tagName = tagName.toLowerCase();
            }
            objectName = $(obj).attr('name');
            objectType = $(obj).prop('type');

            // Si el objectName esta definido como un elemento en el arreglo.
            if (data.hasOwnProperty(objectName)) {
                // Evalua el tagName.
                switch (tagName) {
                    case 'div':
                        // Apunta al img y al input.
                        var img = $(obj).find('img')[0];
                        var dataBase64 = $(obj).find('.dataBase64')[0];

                        // Establece los valores.
                        var imageData = data[objectName]
                        $(img).attr('src', (imageData == '' ? './img/empty-image.jpg' : imageData));
                        $(dataBase64).val((imageData == '' ? '' : imageData));
                        break;

                    case 'input':
                        decimalPlaces = 0;
                        thousandSep = false;

                        // Evalua el tipo.
                        switch (objectType) {
                            // Si es text, number, date o password.
                            case 'text':
                            case 'tel':
                                if ($(obj).hasClass('txb-num')) {
                                    this.#showNumericValue(obj, data[objectName]);
                                } else {
                                    $(obj).val(data[objectName]);
                                }
                                break;
                            case 'number':
                            case 'date':
                                var v = data[objectName].toString();
                                if (v.substring(0, 2) == '00') {
                                    data[objectName] = '';
                                }
                            case 'password':
                                $(obj[0]).val(data[objectName]);
                                break;

                            // Si es checkbox.
                            case 'checkbox':
                                var chk = data[objectName];
                                switch (typeof(chk)) {
                                    case 'boolean':
                                        break;
                                    case 'number':
                                        chk = (chk != 0);
                                        break;
                                    case 'string':
                                        chk = (chk != '0' && chk != 'false');
                                        break;
                                    default:
                                        chk = false;
                                        break;
                                }
                                obj[0].checked = chk;
                                break;
                        }

                        break;

                    // tag: select.
                    case 'select':
                        $(obj[0]).val(data[objectName]);
                        break;

                    // tag: textarea.
                    case 'textarea':
                        $(obj[0]).val(data[objectName]);
                        break;
                }
            }
        }
    }


    /**
     * Listeners.
     */

    /**
     * strFocusIn
     * Cuando toma el foco un control de texto.
     */
    #strFocusIn(e) {
        // Convierte el parametro a un objeto jQuery.
        if (!(e instanceof($))) {
            e = $(e);
        }

        // Selecciona todo el texto.
        e.select();
    }


    /**
     * numFocusIn
     * Cuando toma el foco un control numerico.
     */
    // 
    #numFocusIn(e) {
        // Convierte el parametro a un objeto jQuery.
        if (!(e instanceof($))) {
            e = $(e);
        }

        // Toma el contenido
        var val = e.val();

        // Le quita la mascara.
        e.val(this.format.numberUnFormat(val));

        // Alinea el contenido a la izquierda para edicion.
        e.css("text-align", "left");

        // Selecciona todo el texto.
        e.select();
    }


    /**
     * numFocusOut
     * Cuando pierde el foco un control numerico.
     */
    #numFocusOut(e) {
        e = $(e);

        // Desliga el evento.
        e.unbind("focusout");

        this.#showNumericValue(e);

        // Vuelve a ligar el evento.
        e.focusout(() => {
            this.#numFocusOut(e);
        });
    }


    /**
     * showNumericValue
     * Muestra el contenido en un textbox numerico.
     */
    #showNumericValue(e, value) {
        // El parametro e debe ser un objeto jQuery.
        if ((e instanceof $) == false) {
            this.#consoleInternalError("showNumericValue: e, se esperaba un objeto jQuery");
            return;
        }

        var v;

        // Si no se paso el parametro value.
        if (typeof(value) == 'undefined') {
            // Toma el valor que contiene la caja de texto.
            v = parseFloat(this.format.numberUnFormat(e.val()));
        } else {
            // Toma el valor del parametro;
            v = parseFloat(value);
        }

        if (v !== v) {
            v = 0;
        }

        // Valida que exista el elemento.
        if (e.length == 0) {
            this.#consoleInternalError("showNumericValue: e, elemento no esta definido");
            return;
        }

        var dec = 0, mask = false;

        // Numero de decimales que debe mostrar.
        if (e.hasClass('d1')) {
            dec = 1;
        } else if (e.hasClass('d2')) {
            dec = 2;
        } else if (e.hasClass('d3')) {
            dec = 3;
        } else if (e.hasClass('d4')) {
            dec = 4;
        } else if (e.hasClass('d5')) {
            dec = 5;
        } else if (e.hasClass('d6')) {
            dec = 6;
        } else if (e.hasClass('d7')) {
            dec = 7;
        } else if (e.hasClass('d8')) {
            dec = 8;
        }

        // Si debe dividir los grupos de miles.
        if (e.hasClass('m')) {
            mask = true;
        }

        // Alinea el contenido a la derecha.
        e.css("text-align", "right");

        // Muestra el valor en el control.
        e.val(this.format.numberFormat(v, dec, mask));
    }


    /**
     * 
     * Cuando presionan una tecla.
     */
    #numKeyPress(e) {
        // Variables.
        var objName = $(e.target);
        var position = e.target.selectionStart;
        var currentVal = objName.val();
        var msg;

        // Simbolo positivo o negativo.
        if (String.fromCharCode(e.charCode) == '+' || String.fromCharCode(e.charCode) == '-') {
            // Si ya se coloco el simbolo.
            if (currentVal[0] == '+' || currentVal[0] == '-') {
                e.preventDefault();
                msg = "Ya se encuentra presente el signo de este valor";
                this.showMessage(msg, 3, this.color.alert);
                return;
            }

            // Solo es valido en la primera posicion de la cadena.
            if (position != 0) {
                e.preventDefault();
                msg = "El signo solo es valido al principio del valor";
                this.showMessage(msg, 3, this.color.alert);
                return;
            }

            return;
        }

        // Punto decimal.
        if (String.fromCharCode(e.charCode) == this.format.decimalSep) {
            // Si ya se coloco el simbolo.
            if (currentVal.indexOf(this.format.decimalSep) != -1) {
                e.preventDefault();
                msg = "Ya fue colocado el punto decimal";
                this.showMessage(msg, 3, this.color.alert);
                return;
            }

            return;
        }

        if (e.charCode < 48 || e.charCode > 57) {
            e.preventDefault();
        }
    }


    /**
     * numPaste
     * Cuando pegan contenido en el control desde el portapapeles.
     */
    #numPaste(e) {
        // Constantes.
        const errMsg = 'No es posible acceder al portapapeles';

        // Anula el evento.
        e.preventDefault();

        // Valida que el navegador sea compatible.
        if (!navigator.clipboard) {
            this.showMessage(errMsg, 3, this.color.error);
            return;
        }

        // Valida que el contenido del portapapeles sea un numero valido.
        navigator.clipboard.readText()
            .then((text) => {
                if (!this.isValidNumber(text)) {
                    this.showMessage("El valor que desea pegar no es un número válido", 3, this.color.error);
                    text = "";
                }

                $(this).val(text);
            })
            .catch((err) => {
                alert(err);
            });
    }


    /**
     * strFocusOut
     * Cuando un control de texto pierde el foco.
     */
    #strFocusOut(e) {
        e = $(e.target);

        // Convierte el contenido a mayusculas.
        e.val(e.val().toUpperCase());
    }


    /**
     * strFocusOutLower
     * Convierte el texto ingresado en el control a minusculas.
     */
    #strFocusOutLower(e) {
        e = $(e.target);

        // Convierte el contenido a minusculas.
        e.val(e.val().toLowerCase());
    }


    /**
     * getDate
     * Devuelve la fecha actual en formato 'yyyy-mm-dd'.
     * 
     * Parametros:
     * initialDate: (string) fecha base que se desea obtener, si se omite se toma la fecha del dia.
     * days: (int/string) numero de dias que se desea incrementar o decrementar a la fecha base.
     * 
     * Retorna:
     * string con la fecha procesada.
     */
    getDate(initialDate, days) {
        // Valida los parametros.
        if (typeof(initialDate) != 'string') {
            initialDate = '';
        }
        initialDate = initialDate.trim();

        var dateObject;
        if (initialDate == '') {
            dateObject = new Date();
        } else {
            dateObject = new Date(initialDate + "T00:00:00");
        }

        if (typeof(days) == "string" && this.isValidNumber(days)) {
            days = parseInt(days);
        }
        if (typeof(days) != "number") {
            days = 0;
        }

        // Incrementa/decrementa los dias.
        if (days != 0) {
            dateObject.setDate(dateObject.getDate() + days);
        }

        var year = dateObject.toDateString().substring(11, 15);
        var strMonth = dateObject.toDateString().substring(4, 7);
        var month = '', day, date;

        switch (strMonth) {
            case 'Jan':
                month = '01';
                break;
            case 'Feb':
                month = '02';
                break;
            case 'Mar':
                month = '03';
                break;
            case 'Apr':
                month = '04';
                break;
            case 'May':
                month = '05';
                break;
            case 'Jun':
                month = '06';
                break;
            case 'Jul':
                month = '07';
                break;
            case 'Aug':
                month = '08';
                break;
            case 'Sep':
                month = '09';
                break;
            case 'Oct':
                month = '10';
                break;
            case 'Nov':
                month = '11';
                break;
            case 'Dec':
                month = '12';
                break;
        }

        day = dateObject.toDateString().substring(8, 10);
        date = year + this.format.dateSqlSep + month + this.format.dateSqlSep + day;

        return date;
    }


    /**
     * formatDate
     * Convierte una fecha en formato aaaa-mm-dd en dd-mm-aaaa.
     */
    #formatDate(date, separator) {
        // Valida los parametros.
        if (typeof(date) != "string" || date.trim() == '') {
        	return '';
        }

        if (typeof(separator) != "string") {
        	separator = this.format.dateSep;
        } else {
            if (separator.length > 1) {
                separator = separator.substring(0, 1);
            }
        }

        var day = date.substring(8, 10);
        var month = date.substring(5, 7);
        var year = date.substring(0, 4);
        date = day + separator + month + separator + year;
        return date;
    }


    /**
     * padLeft
     * Rellena una cadena con un caracter especifico por la izquierda.
     * @param {string} sourceString Cadena de origen.
     * @param {string} character Caracter de relleno.
     * @param {int} resultSize Tamaño final de la cadena.
     * @returns Devuelve la cadena formateada.
     */
    #padLeft(sourceString, character, resultSize) {
    	var s = '';

    	// Valida los parametros.
        if (typeof(sourceString) != "string") {
        	this.#consoleInternalError("padLeft: sourceString, se esperaba una cadena");
            return s;
        }

        if (sourceString == '') {
        	this.#consoleInternalError("padLeft: sourceString, la cadena esta vacía");
            return s;
        }

        if (typeof(character) != "string") {
        	this.#consoleInternalError("padLeft: character, se esperaba una cadena");
            return s;
        }

        if (character == '') {
        	this.#consoleInternalError("padLeft: character, la cadena esta vacía");
            return s;
        }

        if (character.length > 1) {
            character = character.substring(0, 1);
        }

        if (typeof(resultSize) != "number") {
        	this.#consoleInternalError("padLeft: resultSize, se esperaba un valor numerico");
            return s;
        }

        s = sourceString;

        while (s.length < resultSize) {
            s = character + s;
        }

        return s;
    }


    /**
     * numberFormat
     * Aplica formato a un numero.
     * @param {int|string} val Valor numerico a formatear.
     * @param {*} dec Numero de decimales.
     * @param {*} tsep Si se deben separar los grupos de miles.
     * @returns Devuelve la cadena formateada.
     */
    #numberFormat(val, dec, tsep) {
        // Variables.
        var intPart, decPart;
        var decPointPosition, len;
        var r = '';

        // Valida el numero a convertir.
        if ((typeof(val) != 'number' || isNaN(val)) && typeof(val) != 'string') {
            val = 0;
        }

        val = val.toString();

        // Valida el numero de decimales.
        if (typeof(dec) != 'number' || isNaN(dec)) {
            dec = 0;
        }

        // Valida el separador de miles.
        if (typeof(tsep) != 'boolean') {
            tsep = false;
        }

        // Elimina el formato si es necesario.
        val = this.format.numberUnFormat(val);

        if (!this.isValidNumber(val)) {
			this.#consoleInternalError("numFormat: El contenido de (val) no es valido, se esperaba una cadena numerica");
            return '';
        }

        // Valida el numero de posiciones decimales.
        if (typeof(dec) == "string") {
        	if (!this.isValidNumber(dec)) {
        		this.#consoleInternalError("numberFormat: dec, la cadena no contiene un numero valido");
	            return '';
        	}
        	dec = parseInt(dec, 10);
        }

        if (typeof(dec) != "number") {
        	this.#consoleInternalError("numberFormat: dec, tipo de dato inesperado");
        }

        // Valida el separador de miles.
        if (typeof(tsep) != "boolean") {
            tsep = false;
        }

        // Toma la posicion del punto decimal.
        decPointPosition = val.indexOf(this.format.decimalSep);

        // Si no tiene decimales.
        if (decPointPosition == -1) {
            intPart = val;

            if (this.isEmpty(intPart))
                intPart = '0';

            r = intPart;

            if (dec > 0) {
                decPart = this.replicate('0', dec);
                r += (this.format.decimalSep + decPart);
            }
        }

        // Si la cadena contiene el punto decimal.
        else {
            // Separa la parte entera de la decimal.
            intPart = val.substring(0, decPointPosition);
            decPart = val.substring(decPointPosition + 1);

            // Si no hay parte decimal establece el valor por defecto.
            if (this.isEmpty(decPart)) {
                decPart = "0";
            }

            // Contruye el valor.
            r = intPart + this.format.decimalSep + decPart;

            // Redondea segun el numero de decimales establecido.
            if (dec == 0) {
                r = Math.round(parseFloat(r)).toString();
            } else {
                var div = Math.pow(10, dec);
                var n = parseFloat(r);
                n *= div;
                n = Math.round(n);
                n /= div;
                r = n.toString();

                // Completa la parte decimal con ceros si es necesario.
                r += (r.indexOf(this.format.decimalSep) == -1) ? this.format.decimalSep : '';
                decPart = r.substring(r.indexOf(this.format.decimalSep) + 1);
                r += this.replicate('0', dec - decPart.length);
            }
        }

        // Si tiene signo positivo (+) lo elimina.
        if (r[0] == '+') {
            r = r.substring(1);
        }

        // Si debe agregar el separador de miles.
        if (tsep) {
            var rf = '';

            // Toma la posicion del punto decimal.
            decPointPosition = r.indexOf(this.format.decimalSep);

            // Separa la parte entera de la decimal.
            if (decPointPosition == -1) {
                intPart = r;
                decPart = '';
            } else {
                intPart = r.substring(0, r.indexOf(this.format.decimalSep));
                decPart = r.substring(r.indexOf(this.format.decimalSep) + 1);
            }

            // Calcula el numero de separadores que debe agregar.
            var len = intPart.length;
            len -= (intPart[0] == '-') ? 1 : 0;
            var sepCount = Math.trunc((len - 1) / 3);

            // Agrega los separadores.
            for (var i = intPart.length - 1, count = 1; i >= 0; i--, count++) {
                rf = intPart[i] + rf;
                if (count % 3 == 0 && sepCount > 0) {
                    rf = this.format.thousandSep + rf;
                    sepCount--;
                }
            }

            r = rf;

            if (decPointPosition != -1) {
                r += (this.format.decimalSep + decPart);
            }
        }

        return r;
    }


    /**
     * numberUnFormat
     * Elimina el formato de un numero.
     * @param {string} val Valor numero del que se quiere quitar el formato.
     * @returns Devuelve una cadena con el numero sin formato.
     */
    #numberUnFormat (val) {
        if (typeof(val) != "string" || this.isEmpty(val)) {
            val = '0';
        }

        var unformatStr = '';

        for (var i = 0; i < val.length; i++) {
            if (val[i] != this.format.thousandSep) {
                unformatStr += val[i];
            }
        }

        return unformatStr;
    }


    /**
     * Lanza el dialogo de error.
     */
    #errorFunc(xhr, ajaxOptions, thrownError) {
    	var errorText =
    	    "Error Information: \n\n" +
    	    "XHR Object Status: " + xhr.status + "\n\n" +
    	    "Error Message: " + thrownError + "\n\n" +
    	    "Response Text: " + xhr.responseText + "\n\n" +
    	    "*** end of error report ***";
    	var errorStructure = { 'title': 'System Error', 'message': errorText };

    	if (this.#debugMode == 1) {
    	    console.log(xhr);
    	    console.log(ajaxOptions);
    	    console.log(thrownError);
    	}

    	this.showError(errorStructure);
    }


    /**
     * selectIcon
     * 
     * Muestra el dialogo para seleccion de iconos.
     * 
     * Parametros:
     * selectedIcon: (string) con el nombre del icono que se encuentra seleccionado (si lo hay).
     * 
     * Retorna:
     * (string): con el nombre del icono seleccionado.
     */
    #selectIcon(selectedIcon, callback) {
        // Valida los parametros.
        if (typeof(selectedIcon) != 'string') {
            selectedIcon = '';
        }

        selectedIcon = selectedIcon.trim();

        if (typeof(callback) != 'function') {
            callback = (iconName) => {};
        }

        // Guarda la funcion callback dentro del dialog.
        this.data.save("#dlg-select-icon", "callback", callback);

        // Inicializa el filtro de iconos.
        $('.txbIconFilter', '#dlg-select-icon').val('');

        // Toma la lista de iconos disponibles sin filtrar.
        var iconList = this.#getIconList();

        // Actualiza el contenido del panel de iconos.
        this.#updateIconPanel(iconList, selectedIcon);

        // Enlaza los eventos.
        $('.btnCancelFilter', '#dlg-select-icon').unbind("click");
        $('.btnCancelFilter', '#dlg-select-icon').click(() => {
            $('.txbIconFilter', '#dlg-select-icon').val('');
            var iconList = this.#getIconList();
            this.#updateIconPanel(iconList, '');
        });

        $('.btnSetFilter', '#dlg-select-icon').unbind("click");
        $('.btnSetFilter', '#dlg-select-icon').click(() => {
            var filter = $('.txbIconFilter', '#dlg-select-icon').val().trim();

            if (filter == '') {
                this.showMessage("Debe establecer un texto para el filtro", 4, this.color.alert);
                return;
            }

            var iconList = this.#getIconList(filter);
            this.#updateIconPanel(iconList, '');
        });

        $(".dialogSelectIconCancel", '#dlg-select-icon').unbind("click");
        $(".dialogSelectIconCancel", '#dlg-select-icon').click(() => {
            this.#dialogSelectIconClose();
        });

        $(".dialogSelectIconOk", '#dlg-select-icon').unbind("click");
        $(".dialogSelectIconOk", '#dlg-select-icon').click(() => {
            // Toma el nombre del icono seleccionado.
            var iconName = this.#getSelectedIconName();

            // Restaura la funcion callback.
            var callback = this.data.restore('#dlg-select-icon', 'callback');

            // Ejecuta la funcion callback.
            callback(iconName);

            // Cierra el dialogo de seleccion de iconos.
            this.#dialogSelectIconClose();
        });

        // Muestra el dialogo de seleccion de iconos.
        var element = document.getElementById('dlg-select-icon');
        element.showModal();
    }


    /**
     * getSelectedIconName
     * 
     * Devuelve el nombre del icono seleccionado en el panel.
     */
    #getSelectedIconName() {
        var iconName = $(".dialogSelectIconBoxSelected", "#dlg-select-icon").find("span").attr("class");
        if (!this.isEmpty(iconName)) {
            iconName = iconName.substr(iconName.indexOf(" "));
        }
        return iconName;
    }


    /**
     * getIconList
     * 
     * Devuelve la lista de iconos disponibles.
     * 
     * Parametros:
     * filter: (string) con el filtro que se desea aplicar a la lista de iconos.
     * 
     * Retorna un array con la lista de iconos disponibles.
     */
    #getIconList(filter) {
        // Valida los parametros.
        if (typeof(filter) != 'string') {
            filter = '';
        }

        // Elimina los espacios iniciales y finales del filtro.
        filter = filter.trim();

        // Establece un array con la lista completa de iconos disponibles.
        var iconList = new Array();
        var index = 0;

        iconList[index++] = 'icon-home';                iconList[index++] = 'icon-home2';
        iconList[index++] = 'icon-home3';               iconList[index++] = 'icon-office';
        iconList[index++] = 'icon-newspaper';           iconList[index++] = 'icon-pencil';
        iconList[index++] = 'icon-pencil2';             iconList[index++] = 'icon-quill';
        iconList[index++] = 'icon-pen';                 iconList[index++] = 'icon-blog';
        iconList[index++] = 'icon-eyedropper';          iconList[index++] = 'icon-droplet';
        iconList[index++] = 'icon-paint-format';        iconList[index++] = 'icon-image';
        iconList[index++] = 'icon-images';              iconList[index++] = 'icon-camera';
        iconList[index++] = 'icon-headphones';          iconList[index++] = 'icon-music';
        iconList[index++] = 'icon-play';                iconList[index++] = 'icon-film';
        iconList[index++] = 'icon-video-camera';        iconList[index++] = 'icon-dice';
        iconList[index++] = 'icon-pacman';              iconList[index++] = 'icon-spades';
        iconList[index++] = 'icon-clubs';               iconList[index++] = 'icon-diamonds';
        iconList[index++] = 'icon-bullhorn';            iconList[index++] = 'icon-connection';
        iconList[index++] = 'icon-podcast';             iconList[index++] = 'icon-feed';
        iconList[index++] = 'icon-mic';                 iconList[index++] = 'icon-book';
        iconList[index++] = 'icon-books';               iconList[index++] = 'icon-library';
        iconList[index++] = 'icon-file-text';           iconList[index++] = 'icon-profile';
        iconList[index++] = 'icon-file-empty';          iconList[index++] = 'icon-files-empty';
        iconList[index++] = 'icon-file-text2';          iconList[index++] = 'icon-file-picture';
        iconList[index++] = 'icon-file-music';          iconList[index++] = 'icon-file-play';
        iconList[index++] = 'icon-file-video';          iconList[index++] = 'icon-file-zip';
        iconList[index++] = 'icon-copy';                iconList[index++] = 'icon-paste';
        iconList[index++] = 'icon-stack';               iconList[index++] = 'icon-folder';
        iconList[index++] = 'icon-folder-open';         iconList[index++] = 'icon-folder-plus';
        iconList[index++] = 'icon-folder-minus';        iconList[index++] = 'icon-folder-download';
        iconList[index++] = 'icon-folder-upload';       iconList[index++] = 'icon-price-tag';
        iconList[index++] = 'icon-price-tags';          iconList[index++] = 'icon-barcode';
        iconList[index++] = 'icon-qrcode';              iconList[index++] = 'icon-ticket';
        iconList[index++] = 'icon-cart';                iconList[index++] = 'icon-coin-dollar';
        iconList[index++] = 'icon-coin-euro';           iconList[index++] = 'icon-coin-pound';
        iconList[index++] = 'icon-coin-yen';            iconList[index++] = 'icon-credit-card';
        iconList[index++] = 'icon-calculator';          iconList[index++] = 'icon-lifebuoy';
        iconList[index++] = 'icon-phone';               iconList[index++] = 'icon-phone-hang-up';
        iconList[index++] = 'icon-address-book';        iconList[index++] = 'icon-envelop';
        iconList[index++] = 'icon-pushpin';             iconList[index++] = 'icon-location';
        iconList[index++] = 'icon-location2';           iconList[index++] = 'icon-compass';
        iconList[index++] = 'icon-compass2';            iconList[index++] = 'icon-map';
        iconList[index++] = 'icon-map2';                iconList[index++] = 'icon-history';
        iconList[index++] = 'icon-clock';               iconList[index++] = 'icon-clock2';
        iconList[index++] = 'icon-alarm';               iconList[index++] = 'icon-bell';
        iconList[index++] = 'icon-stopwatch';           iconList[index++] = 'icon-calendar';
        iconList[index++] = 'icon-printer';             iconList[index++] = 'icon-keyboard';
        iconList[index++] = 'icon-display';             iconList[index++] = 'icon-laptop';
        iconList[index++] = 'icon-mobile';              iconList[index++] = 'icon-mobile2';
        iconList[index++] = 'icon-tablet';              iconList[index++] = 'icon-tv';
        iconList[index++] = 'icon-drawer';              iconList[index++] = 'icon-drawer2';
        iconList[index++] = 'icon-box-add';             iconList[index++] = 'icon-box-remove';
        iconList[index++] = 'icon-download';            iconList[index++] = 'icon-upload';
        iconList[index++] = 'icon-floppy-disk';         iconList[index++] = 'icon-drive';
        iconList[index++] = 'icon-database';            iconList[index++] = 'icon-undo';
        iconList[index++] = 'icon-redo';                iconList[index++] = 'icon-undo2';
        iconList[index++] = 'icon-redo2';               iconList[index++] = 'icon-forward';
        iconList[index++] = 'icon-reply';               iconList[index++] = 'icon-bubble';
        iconList[index++] = 'icon-bubbles';             iconList[index++] = 'icon-bubbles2';
        iconList[index++] = 'icon-bubble2';             iconList[index++] = 'icon-bubbles3';
        iconList[index++] = 'icon-bubbles4';            iconList[index++] = 'icon-user';
        iconList[index++] = 'icon-users';               iconList[index++] = 'icon-user-plus';
        iconList[index++] = 'icon-user-minus';          iconList[index++] = 'icon-user-check';
        iconList[index++] = 'icon-user-tie';            iconList[index++] = 'icon-quotes-left';
        iconList[index++] = 'icon-quotes-right';        iconList[index++] = 'icon-hour-glass';
        iconList[index++] = 'icon-spinner';             iconList[index++] = 'icon-spinner2';
        iconList[index++] = 'icon-spinner3';            iconList[index++] = 'icon-spinner4';
        iconList[index++] = 'icon-spinner5';            iconList[index++] = 'icon-spinner6';
        iconList[index++] = 'icon-spinner7';            iconList[index++] = 'icon-spinner8';
        iconList[index++] = 'icon-spinner9';            iconList[index++] = 'icon-spinner10';
        iconList[index++] = 'icon-spinner11';           iconList[index++] = 'icon-binoculars';
        iconList[index++] = 'icon-search';              iconList[index++] = 'icon-zoom-in';
        iconList[index++] = 'icon-zoom-out';            iconList[index++] = 'icon-enlarge';
        iconList[index++] = 'icon-shrink';              iconList[index++] = 'icon-enlarge2';
        iconList[index++] = 'icon-shrink2';             iconList[index++] = 'icon-key';
        iconList[index++] = 'icon-key2';                iconList[index++] = 'icon-lock';
        iconList[index++] = 'icon-unlocked';            iconList[index++] = 'icon-wrench';
        iconList[index++] = 'icon-equalizer';           iconList[index++] = 'icon-equalizer2';
        iconList[index++] = 'icon-cog';                 iconList[index++] = 'icon-cogs';
        iconList[index++] = 'icon-hammer';              iconList[index++] = 'icon-magic-wand';
        iconList[index++] = 'icon-aid-kit';             iconList[index++] = 'icon-bug';
        iconList[index++] = 'icon-pie-chart';           iconList[index++] = 'icon-stats-dots';
        iconList[index++] = 'icon-stats-bars';          iconList[index++] = 'icon-stats-bars2';
        iconList[index++] = 'icon-trophy';              iconList[index++] = 'icon-gift';
        iconList[index++] = 'icon-glass';               iconList[index++] = 'icon-glass2';
        iconList[index++] = 'icon-mug';                 iconList[index++] = 'icon-spoon-knife';
        iconList[index++] = 'icon-leaf';                iconList[index++] = 'icon-rocket';
        iconList[index++] = 'icon-meter';               iconList[index++] = 'icon-meter2';
        iconList[index++] = 'icon-hammer2';             iconList[index++] = 'icon-fire';
        iconList[index++] = 'icon-lab';                 iconList[index++] = 'icon-magnet';
        iconList[index++] = 'icon-bin';                 iconList[index++] = 'icon-bin2';
        iconList[index++] = 'icon-briefcase';           iconList[index++] = 'icon-airplane';
        iconList[index++] = 'icon-truck';               iconList[index++] = 'icon-road';
        iconList[index++] = 'icon-accessibility';       iconList[index++] = 'icon-target';
        iconList[index++] = 'icon-shield';              iconList[index++] = 'icon-power';
        iconList[index++] = 'icon-switch';              iconList[index++] = 'icon-power-cord';
        iconList[index++] = 'icon-clipboard';           iconList[index++] = 'icon-list-numbered';
        iconList[index++] = 'icon-list';                iconList[index++] = 'icon-list2';
        iconList[index++] = 'icon-tree';                iconList[index++] = 'icon-menu';
        iconList[index++] = 'icon-menu2';               iconList[index++] = 'icon-menu3';
        iconList[index++] = 'icon-menu4';               iconList[index++] = 'icon-cloud';
        iconList[index++] = 'icon-cloud-download';      iconList[index++] = 'icon-cloud-upload';
        iconList[index++] = 'icon-cloud-check';         iconList[index++] = 'icon-download2';
        iconList[index++] = 'icon-upload2';             iconList[index++] = 'icon-download3';
        iconList[index++] = 'icon-upload3';             iconList[index++] = 'icon-sphere';
        iconList[index++] = 'icon-earth';               iconList[index++] = 'icon-link';
        iconList[index++] = 'icon-flag';                iconList[index++] = 'icon-attachment';
        iconList[index++] = 'icon-eye';                 iconList[index++] = 'icon-eye-plus';
        iconList[index++] = 'icon-eye-minus';           iconList[index++] = 'icon-eye-blocked';
        iconList[index++] = 'icon-bookmark';            iconList[index++] = 'icon-bookmarks';
        iconList[index++] = 'icon-sun';                 iconList[index++] = 'icon-contrast';
        iconList[index++] = 'icon-brightness-contrast'; iconList[index++] = 'icon-star-empty';
        iconList[index++] = 'icon-star-half';           iconList[index++] = 'icon-star-full';
        iconList[index++] = 'icon-heart';               iconList[index++] = 'icon-heart-broken';
        iconList[index++] = 'icon-man';                 iconList[index++] = 'icon-woman';
        iconList[index++] = 'icon-man-woman';           iconList[index++] = 'icon-happy';
        iconList[index++] = 'icon-happy2';              iconList[index++] = 'icon-smile';
        iconList[index++] = 'icon-smile2';              iconList[index++] = 'icon-tongue';
        iconList[index++] = 'icon-tongue2';             iconList[index++] = 'icon-sad';
        iconList[index++] = 'icon-sad2';                iconList[index++] = 'icon-wink';
        iconList[index++] = 'icon-wink2';               iconList[index++] = 'icon-grin';
        iconList[index++] = 'icon-grin2';               iconList[index++] = 'icon-cool';
        iconList[index++] = 'icon-cool2';               iconList[index++] = 'icon-angry';
        iconList[index++] = 'icon-angry2';              iconList[index++] = 'icon-evil';
        iconList[index++] = 'icon-evil2';               iconList[index++] = 'icon-shocked';
        iconList[index++] = 'icon-shocked2';            iconList[index++] = 'icon-baffled';
        iconList[index++] = 'icon-baffled2';            iconList[index++] = 'icon-confused';
        iconList[index++] = 'icon-confused2';           iconList[index++] = 'icon-neutral';
        iconList[index++] = 'icon-neutral2';            iconList[index++] = 'icon-hipster';
        iconList[index++] = 'icon-hipster2';            iconList[index++] = 'icon-wondering';
        iconList[index++] = 'icon-wondering2';          iconList[index++] = 'icon-sleepy';
        iconList[index++] = 'icon-sleepy2';             iconList[index++] = 'icon-frustrated';
        iconList[index++] = 'icon-frustrated2';         iconList[index++] = 'icon-crying';
        iconList[index++] = 'icon-crying2';             iconList[index++] = 'icon-point-up';
        iconList[index++] = 'icon-point-right';         iconList[index++] = 'icon-point-down';
        iconList[index++] = 'icon-point-left';          iconList[index++] = 'icon-warning';
        iconList[index++] = 'icon-notification';        iconList[index++] = 'icon-question';
        iconList[index++] = 'icon-plus';                iconList[index++] = 'icon-minus';
        iconList[index++] = 'icon-info';                iconList[index++] = 'icon-cancel-circle';
        iconList[index++] = 'icon-blocked';             iconList[index++] = 'icon-cross';
        iconList[index++] = 'icon-checkmark';           iconList[index++] = 'icon-checkmark2';
        iconList[index++] = 'icon-spell-check';         iconList[index++] = 'icon-enter';
        iconList[index++] = 'icon-exit';                iconList[index++] = 'icon-play2';
        iconList[index++] = 'icon-pause';               iconList[index++] = 'icon-stop';
        iconList[index++] = 'icon-previous';            iconList[index++] = 'icon-next';
        iconList[index++] = 'icon-backward';            iconList[index++] = 'icon-forward2';
        iconList[index++] = 'icon-play3';               iconList[index++] = 'icon-pause2';
        iconList[index++] = 'icon-stop2';               iconList[index++] = 'icon-backward2';
        iconList[index++] = 'icon-forward3';            iconList[index++] = 'icon-first';
        iconList[index++] = 'icon-last';                iconList[index++] = 'icon-previous2';
        iconList[index++] = 'icon-next2';               iconList[index++] = 'icon-eject';
        iconList[index++] = 'icon-volume-high';         iconList[index++] = 'icon-volume-medium';
        iconList[index++] = 'icon-volume-low';          iconList[index++] = 'icon-volume-mute';
        iconList[index++] = 'icon-volume-mute2';        iconList[index++] = 'icon-volume-increase';
        iconList[index++] = 'icon-volume-decrease';     iconList[index++] = 'icon-shuffle';
        iconList[index++] = 'icon-arrow-up-left';       iconList[index++] = 'icon-arrow-up';
        iconList[index++] = 'icon-arrow-up-right';      iconList[index++] = 'icon-arrow-right';
        iconList[index++] = 'icon-arrow-down-right';    iconList[index++] = 'icon-arrow-down';
        iconList[index++] = 'icon-arrow-down-left';     iconList[index++] = 'icon-arrow-left';
        iconList[index++] = 'icon-arrow-up-left2';      iconList[index++] = 'icon-arrow-up2';
        iconList[index++] = 'icon-arrow-up-right2';     iconList[index++] = 'icon-arrow-right2';
        iconList[index++] = 'icon-arrow-down-right2';   iconList[index++] = 'icon-arrow-down2';
        iconList[index++] = 'icon-arrow-down-left2';    iconList[index++] = 'icon-arrow-left2';
        iconList[index++] = 'icon-circle-up';           iconList[index++] = 'icon-circle-right';
        iconList[index++] = 'icon-circle-down';         iconList[index++] = 'icon-circle-left';
        iconList[index++] = 'icon-tab';                 iconList[index++] = 'icon-move-up';
        iconList[index++] = 'icon-move-down';           iconList[index++] = 'icon-sort-alpha-asc';
        iconList[index++] = 'icon-sort-alpha-desc';     iconList[index++] = 'icon-sort-numeric-asc';
        iconList[index++] = 'icon-sort-numberic-desc';  iconList[index++] = 'icon-sort-amount-asc';
        iconList[index++] = 'icon-sort-amount-desc';    iconList[index++] = 'icon-command';
        iconList[index++] = 'icon-shift';               iconList[index++] = 'icon-ctrl';
        iconList[index++] = 'icon-opt';                 iconList[index++] = 'icon-checkbox-checked';
        iconList[index++] = 'icon-checkbox-unchecked';  iconList[index++] = 'icon-radio-checked';
        iconList[index++] = 'icon-radio-checked2';      iconList[index++] = 'icon-radio-unchecked';
        iconList[index++] = 'icon-crop';                iconList[index++] = 'icon-make-group';
        iconList[index++] = 'icon-ungroup';             iconList[index++] = 'icon-scissors';
        iconList[index++] = 'icon-filter';              iconList[index++] = 'icon-font';
        iconList[index++] = 'icon-ligature';            iconList[index++] = 'icon-ligature2';
        iconList[index++] = 'icon-text-height';         iconList[index++] = 'icon-text-width';
        iconList[index++] = 'icon-font-size';           iconList[index++] = 'icon-bold';
        iconList[index++] = 'icon-underline';           iconList[index++] = 'icon-italic';
        iconList[index++] = 'icon-strikethrough';       iconList[index++] = 'icon-omega';
        iconList[index++] = 'icon-sigma';               iconList[index++] = 'icon-page-break';
        iconList[index++] = 'icon-superscript';         iconList[index++] = 'icon-subscript';
        iconList[index++] = 'icon-superscript2';        iconList[index++] = 'icon-subscript2';
        iconList[index++] = 'icon-text-color';          iconList[index++] = 'icon-pagebreak';
        iconList[index++] = 'icon-clear-formatting';    iconList[index++] = 'icon-table';
        iconList[index++] = 'icon-table2';              iconList[index++] = 'icon-insert-template';
        iconList[index++] = 'icon-pilcrow';             iconList[index++] = 'icon-ltr';
        iconList[index++] = 'icon-rtl';                 iconList[index++] = 'icon-section';
        iconList[index++] = 'icon-paragraph-left';      iconList[index++] = 'icon-paragraph-center';
        iconList[index++] = 'icon-paragraph-right';     iconList[index++] = 'icon-paragraph-justify';
        iconList[index++] = 'icon-indent-increase';     iconList[index++] = 'icon-indent-decrease';
        iconList[index++] = 'icon-share';               iconList[index++] = 'icon-new-tab';
        iconList[index++] = 'icon-embed';               iconList[index++] = 'icon-embed2';
        iconList[index++] = 'icon-terminal';            iconList[index++] = 'icon-share2';
        iconList[index++] = 'icon-mail';                iconList[index++] = 'icon-mail2';
        iconList[index++] = 'icon-mail3';               iconList[index++] = 'icon-mail4';
        iconList[index++] = 'icon-amazon';              iconList[index++] = 'icon-google';
        iconList[index++] = 'icon-google2';             iconList[index++] = 'icon-google3';
        iconList[index++] = 'icon-google-plus';         iconList[index++] = 'icon-google-plus2';
        iconList[index++] = 'icon-google-plus3';        iconList[index++] = 'icon-hangouts';
        iconList[index++] = 'icon-google-drive';        iconList[index++] = 'icon-facebook';
        iconList[index++] = 'icon-facebook2';           iconList[index++] = 'icon-instagram';
        iconList[index++] = 'icon-whatsapp';            iconList[index++] = 'icon-spotify';
        iconList[index++] = 'icon-telegram';            iconList[index++] = 'icon-twitter';
        iconList[index++] = 'icon-vine';                iconList[index++] = 'icon-vk';
        iconList[index++] = 'icon-renren';              iconList[index++] = 'icon-sina-weibo';
        iconList[index++] = 'icon-rss2';                iconList[index++] = 'icon-rss2';
        iconList[index++] = 'icon-youtube';             iconList[index++] = 'icon-twitch';
        iconList[index++] = 'icon-vimeo';               iconList[index++] = 'icon-vimeo2';
        iconList[index++] = 'icon-lanyrd';              iconList[index++] = 'icon-flickr';
        iconList[index++] = 'icon-flickr2';             iconList[index++] = 'icon-flickr3';
        iconList[index++] = 'icon-flickr4';             iconList[index++] = 'icon-dribbble';
        iconList[index++] = 'icon-behance';             iconList[index++] = 'icon-behance2';
        iconList[index++] = 'icon-deviantart';          iconList[index++] = 'icon-500px';
        iconList[index++] = 'icon-steam';               iconList[index++] = 'icon-steam2';
        iconList[index++] = 'icon-dropbox';             iconList[index++] = 'icon-onedrive';
        iconList[index++] = 'icon-github';              iconList[index++] = 'icon-npm';
        iconList[index++] = 'icon-basecamp';            iconList[index++] = 'icon-trello';
        iconList[index++] = 'icon-wordpress';           iconList[index++] = 'icon-joomla';
        iconList[index++] = 'icon-ello';                iconList[index++] = 'icon-blogger';
        iconList[index++] = 'icon-blogger2';            iconList[index++] = 'icon-tumblr';
        iconList[index++] = 'icon-tumblr2';             iconList[index++] = 'icon-yahoo';
        iconList[index++] = 'icon-yahoo2';              iconList[index++] = 'icon-tux';
        iconList[index++] = 'icon-appleinc';            iconList[index++] = 'icon-finder';
        iconList[index++] = 'icon-android';             iconList[index++] = 'icon-windows';
        iconList[index++] = 'icon-windows8';            iconList[index++] = 'icon-soundcloud';
        iconList[index++] = 'icon-soundcloud2';         iconList[index++] = 'icon-skype';
        iconList[index++] = 'icon-reddit';              iconList[index++] = 'icon-hackernews';
        iconList[index++] = 'icon-wikipedia';           iconList[index++] = 'icon-linkedin';
        iconList[index++] = 'icon-linkedin2';           iconList[index++] = 'icon-lastfm';
        iconList[index++] = 'icon-lastfm2';             iconList[index++] = 'icon-delicious';
        iconList[index++] = 'icon-stumbleupon';         iconList[index++] = 'icon-stumbleupon2';
        iconList[index++] = 'icon-stackoverflow';       iconList[index++] = 'icon-pinterest';
        iconList[index++] = 'icon-pinterest2';          iconList[index++] = 'icon-xing';
        iconList[index++] = 'icon-xing2';               iconList[index++] = 'icon-flattr';
        iconList[index++] = 'icon-foursquare';          iconList[index++] = 'icon-yelp';
        iconList[index++] = 'icon-paypal';              iconList[index++] = 'icon-chrome';
        iconList[index++] = 'icon-firefox';             iconList[index++] = 'icon-IE';
        iconList[index++] = 'icon-edge';                iconList[index++] = 'icon-safari';
        iconList[index++] = 'icon-opera';               iconList[index++] = 'icon-file-pdf';
        iconList[index++] = 'icon-file-openoffice';     iconList[index++] = 'icon-file-word';
        iconList[index++] = 'icon-file-excel';          iconList[index++] = 'icon-libreoffice';
        iconList[index++] = 'icon-html-five';           iconList[index++] = 'icon-html-five2';
        iconList[index++] = 'icon-css3';                iconList[index++] = 'icon-git';
        iconList[index++] = 'icon-codepen';             iconList[index++] = 'icon-svg';
        iconList[index++] = 'icon-IcoMoon';

        // Si hay un filtro lo aplica.
        if (filter != '') {
            var iconListFiltered = [];
            var i = 0;
            for (var k = 0; k < iconList.length; k++) {
                if (iconList[k].indexOf(filter) != -1) {
                    iconListFiltered[i++] = iconList[k];
                }
            }
            return iconListFiltered;
        } else {
            return iconList;
        }
    }


    /**
     * fillIconContainer
     * 
     * Llena el contenedor con los iconos disponibles.  Tambien marca como seleccionado
     * el icono que se indique.
     * 
     * Retorna un entero con la posicion del icono.
     */
    #fillIconContainer(iconList, selectedIcon) {
        var index = 1;
        var classSelected = '';
        if (selectedIcon == '') {
            classSelected = ' dialogSelectIconBoxSelected';
        }

        var html =
            '<div class="dialogSelectIconBox' + classSelected + '">' +
                '<span translate="no"></span>' +
            '</div>';

        for (var i = 0; i < iconList.length; i++) {
            classSelected = '';
            if (iconList[i] == selectedIcon) {
                classSelected = ' dialogSelectIconBoxSelected'
                index = i + 1;
            }
            
            html +=
                '<div class="dialogSelectIconBox' + classSelected + '">' +
                    '<span translate="no" class="icon ' + iconList[i] + '"></span>' +
                '</div>';
        }

        $(".dialogSelectIconPanel").html(html);

        return index;
    }


    /**
     * updateIconPanel
     * 
     * Actualiza el contenido del panel de iconos.
     */
    #updateIconPanel(iconList, selectedIcon) {
        this.#setSelectedIconName(selectedIcon);

        // Llena el contenedor con los iconos disponibles (segun el filtro).
        var selectedIconIndex = this.#fillIconContainer(iconList, selectedIcon);

        // Hace el scroll para que el elemento seleccionado quede visible.
        var scroll = (Math.ceil(selectedIconIndex / 11) * 50) - 50;
        $('.dialogSelectIconPanel', "#dlg-select-icon").animate({scrollTop: scroll});

        $(".dialogSelectIconBox", "#dlg-select-icon").unbind("click");
        $(".dialogSelectIconBox", "#dlg-select-icon").click((t) => {
            $(".dialogSelectIconBoxSelected", "#dlg-select-icon").removeClass("dialogSelectIconBoxSelected");
            $(t.currentTarget, "#dlg-select-icon").addClass("dialogSelectIconBoxSelected");

            var iconName = this.#getSelectedIconName();
            this.#setSelectedIconName(iconName);
        });
    }


    /**
     * setSelectedIconName
     * 
     * Establece el nombre del icono seleccionado en el control.
     */
    #setSelectedIconName(iconName) {
        if (typeof(iconName) != 'string') {
            iconName = '';
        }

        $('.txbIconName', '#dlg-select-icon').val(iconName);
    }


    /**
     * dialogSelectIconClose
     * 
     * Cierra el dialogo de seleccion de iconos.
     */
    #dialogSelectIconClose() {
        var element = document.getElementById('dlg-select-icon');

        element.close();
    }


    /**
     * buildGrid:
     * 
     * Construye un grid dentro de un contenedor.
     * 
     * Parametros:
     * gridContainer: (jQuery object) contenedor padre del grid.
     * gridStructure: (json object)
     * 
     * gridStructure = {
     *  	'tableTitle': '',
     *  	'columns': [
     * 			{
     * 				'title': 'columnTitle',				// Column title.
     * 				'width': 'columnWidth',				// Column width.
     * 				'align': 'headerTextAlign',			// left, center, right.
     * 				'dataAlign': 'dataTextAlign',		// left, center, right.
     * 				'field': 'fieldName',				// Name of table field.
     *              'hide': boolean,                    // Hide field.
     * 				'type': 'fieldType',				// Field data type, string, date, number, boolean.
     *              'fillZero: number,                  // Fill string with left side zeros.
     * 				'modify': boolean,					// Only for boolean data type.
     * 				'thousandSep': boolean,             // true si debe mostrar el separador de miles.
     * 				'decimalPlaces': number             // Numero de posiciones decimales a mostrar.
     * 			}
     * 		],
     * 		'rows': new Array(),                        // Arreglo con los datos a mostrar en el grid.
     * 		'showMaxRows': 5,                           // Numero de filas visibles en el grid.
     *      'setSelectedRow': boolean,                  // Marcar una fila como seleccionada.
     *      'selectedField': 'selectedFieldName',       // Nombre del campo de la fila seleccionada.
     *      'selectedValue': 'selectedFieldValue',      // Valor del campo de la fila seleccionada.
     * 		'onClick': function                         // Funcion para controlar el evento click.
     * }
     */
	#buildGrid(gridContainer, gridStructure) {
		// Variables locales.
		var html = '', tableTitle = '', showMaxRows;

		// Valida los parametros.
		if (!this.#validateGridParams(gridContainer, gridStructure)) {
			return;
		}

		// Guarda la estructura del grid.
		this.data.save(gridContainer, "gridStructure", gridStructure);

		// Apertura el contenedor general.
		html += '<div class="gridControlContainer">';

		// Agrega el titulo de la tabla.
		if (gridStructure.hasOwnProperty("tableTitle")) {
			tableTitle = gridStructure.tableTitle;
			if (typeof(tableTitle) != 'string') {
				tableTitle = '';
			}
		}

		if (tableTitle != '') {
			html +=
				'<div class="gridControlTableTitle">' +
					'<span translate="no" class="lbl" translate="no">' + tableTitle + '</span>' +
				'</div>';
		}

		// Apertura del contenedor de la tabla.
		html += '<div class="gridControlTableContainer">'

		// Apertura de la tabla.
		html += '<table class="gridControlTable">';

		// Construye la cabecera del grid.
		html += this.#buildHeader(gridStructure);

		// Contruye el cuerpo del grid.
		html += this.#buildBody(gridStructure);

		// Cierre de la tabla.
		html += '</table>';

		// Cierre del contenedor de la tabla.
		html += '</div>';

		// Cierre del contenedor general.
		html += '</div>';

		// Agrega el grid al contenedor.
		$(gridContainer).html(html);

		// Establece el alto del contenedor del grid.
		showMaxRows = this.#getMaxRows(gridStructure);
        var rowHeight = 24;

		var height = (showMaxRows * rowHeight) + 1;
		height = height.toString() + "px";
		$("tbody", $(gridContainer)).css("height", height);
		
		// Eventos click.
		var fn;

		if (gridStructure.hasOwnProperty("onClick")) {
			fn = gridStructure.onClick;
		}

		if (typeof(fn) != "function") {
			fn = (r) => {};
		}
		$(gridContainer).data("onClick", fn);

		// Agrega el evento para seleccionar la fila.
		$(".gridControlDataRow", gridContainer).unbind("click");
		$(".gridControlDataRow", gridContainer).click((t) => {
			this.#selectRow(t, gridContainer);
			t = t.currentTarget;
			var fn = $(gridContainer).data("onClick");
			var r = this.#getRow(t);
			fn(r);
		});
	}

    
    /**
     * Valida los parametros de la funcion buildGrid.
     */
	#validateGridParams(gridContainer, gridStructure) {
		var validationOk = true;
		var errorMessage = '';

		if (typeof(gridContainer) != "object") {
			errorMessage = "gridContainer, se esperaba un objeto jQuery";
			validationOk = false;
		} else if (gridContainer == null) {
			errorMessage = "gridContainer, el objeto en nulo";
			validationOk = false;
		} else if ($(gridContainer).length == 0) {
            errorMessage = "gridContainer, el contenedor '" + gridContainer + "' no esta definido";
			validationOk = false;
		} else if (typeof(gridStructure) == "undefined") {
			errorMessage = "gridStructure, no se encuentra definido";
			validationOk = false;
		} else if (!gridStructure.hasOwnProperty("columns") ) {
			errorMessage = "gridStructure, no se encuentra la propiedad 'columns'";
			validationOk = false;
		} else if (!gridStructure.hasOwnProperty("rows") ) {
			errorMessage = "gridStructure, no se encuentra la propiedad 'rows'";
			validationOk = false;
		}

		if (!validationOk) {
			this.#consoleInternalError("Core.grid.validateParams: " + errorMessage);
		}

		return validationOk;
	}


    /**
     * Construye la cabecera del grid.
     */
	#buildHeader(gridStructure) {
		var tableHeader = '', style, columnTitle, columnWidth, align, hide;

		// Agrega la apertura de la cabecera.
		tableHeader +=
			'<thead>' +
    		    '<tr class="gridControlHeaderTr">';

		// Construye la cabecera.
		for (var i = 0; i < Object.keys(gridStructure.columns).length; i++) {
			// Establece el titulo de la columna.
			if (gridStructure.columns[i].hasOwnProperty("title")) {
				columnTitle = gridStructure.columns[i].title
				if (typeof(columnTitle) != "string") {
					columnTitle = "COLUMN " + (i + 1).toString();
				}
				if (columnTitle == '') {
					columnTitle = "&nbsp;";
				}
			} else {
				columnTitle = "COLUMN " + (i + 1).toString();
			}

			// Establece el ancho de la columna.
			if (gridStructure.columns[i].hasOwnProperty("width")) {
				columnWidth = gridStructure.columns[i].width;
				if (typeof(columnWidth) != "string") {
					columnWidth = this.grid.defaultColumnWidth;
				}
			} else {
				columnWidth = this.grid.defaultColumnWidth;
			}

			// Establece la alineacion del texto en el titulo de la columna.
			if (gridStructure.columns[i].hasOwnProperty("align")) {
				align = gridStructure.columns[i].align;
				if (typeof(align) != 'string' ||
					(align != 'left' && align != 'center' && align != 'right')) {
					align = this.grid.defaultColumnTextAlign;
				}
			} else {
				align = this.grid.defaultColumnTextAlign;
			}

			// Si la columna es oculta.
			if (gridStructure.columns[i].hasOwnProperty("hide")) {
				hide = gridStructure.columns[i].hide;
				if (typeof(hide) != 'boolean') {
					hide = false;
				}
			} else {
				hide = false;
			}

			if (hide) {
				hide = "display: none; ";
			} else {
				hide = " ";
			}

			// Construye la columna.
			style = 'style="width: ' + columnWidth + ';text-align: ' + align + ';' + hide + '" ';
			tableHeader +=
				'<td ' + style + 'class="gridControlHeaderTd">' +
					'<div style="width: ' + columnWidth + '">' +
						'<span translate="no" translate="no">' + columnTitle + '</span>' +
					'</div>' +
				'</td>';
		}

		// Agrega el cierra de la cabecera.
		tableHeader +=
    			'</tr>' +
    		'</thead>';

		return tableHeader;
	}


    /**
     * Construye el cuerpo del grid.
     */
	#buildBody(gridStructure) {
		var thousandSep;
		var decimalPlaces = 0;
		var tableBody = '', columnType, columnWidth, rows, showMaxRows, columns;
		var fieldName, cellValue, dataAlign, hide;
        var setSelectedRow = false, selectedField = '', selectedValue = '', selectRowClass;

		// Agrega la apertura del cuerpo.
		tableBody += '<tbody>';

        // Si se debe seleccionar una fila en especifico.
        if (gridStructure.hasOwnProperty('setSelectedRow') && gridStructure.setSelectedRow) {
            setSelectedRow = true;
            if (gridStructure.hasOwnProperty('selectedField') &&
                typeof(gridStructure.selectedField) == 'string') {
                selectedField = gridStructure.selectedField;
            }
            if (gridStructure.hasOwnProperty('selectedValue')) {
                selectedValue = gridStructure.selectedValue;
            }
        }

		// Agrega los registros.
		rows = Object.keys(gridStructure.rows).length;
		columns = Object.keys(gridStructure.columns).length;

		var cellValueSpanClass;

		for (var i in gridStructure.rows) {
            // Valida si este es el registro que debe estar seleccionado.
            selectRowClass = '';

            if (setSelectedRow) {
                // Recorre las columnas ubicando el campo de comparacion.
                for (var k = 0; k < columns; k++) {
                    if (gridStructure.columns[k].hasOwnProperty("field")) {
                        fieldName = gridStructure.columns[k].field;
                        cellValue = gridStructure.rows[i][fieldName];
                        if (fieldName == selectedField && cellValue == selectedValue) {
                            selectRowClass = ' gridControlSelectedRow';
                            break;
                        }
                    }
                }
            }

			// Agrega la fila.
			tableBody += '<tr class="gridControlBodyTr gridControlDataRow' + selectRowClass + '">';

			// Agrega las columnas de la fila.
			for (var k = 0; k < columns; k++) {
				// Establece la clase del span que muestra los datos.
				cellValueSpanClass = '';

				// Establece el ancho de la columna.
				if (gridStructure.columns[k].hasOwnProperty("width")) {
					columnWidth = gridStructure.columns[k].width;
					if (typeof(columnWidth) != "string") {
						columnWidth = this.grid.defaultColumnWidth;
					}
				} else {
					columnWidth = this.grid.defaultColumnWidth;
				}

				// Toma el tipo de dato que se debe mostrar.
				if (gridStructure.columns[k].hasOwnProperty("type")) {
					columnType = gridStructure.columns[k].type;
					if (typeof(columnType) != 'string' ||
						(columnType != 'number' && columnType != 'string' && 
							columnType != 'boolean' && columnType != 'date' && 
							columnType != 'icon')) {
						columnType = "string";
					}
				} else {
					columnType = "string";
				}

				// Toma el valor que se debe mostrar en la celda.
				if (gridStructure.columns[k].hasOwnProperty("field")) {
					fieldName = gridStructure.columns[k].field;
                    cellValue = gridStructure.rows[i][fieldName];

                    // Si debe rellenar con ceros a la izquierda.
                    if (columnType == 'string' && gridStructure.columns[k].hasOwnProperty("fillZero")) {
                        if (typeof(cellValue) != 'string') {
                            cellValue = cellValue.toString();
                        }
                        var resultSize = parseInt(gridStructure.columns[k]['fillZero']);
                        cellValue = this.format.fillLeft(cellValue, '0', resultSize);
                    }
				} else {
					fieldName = "FIELD " + (k + 1).toString();
					cellValue = "&nbsp;";
				}

				// Aplica el formato.
				switch (columnType) {
					case 'icon':
						cellValueSpanClass = 'icon ' + cellValue;
						cellValue = "&nbsp;";
						break;

					case 'string':
						break;

					case 'number':
						// Separador de miles.
						if (gridStructure.columns[k].hasOwnProperty("thousandSep")) {
							thousandSep = gridStructure.columns[k].thousandSep;
							if (typeof(thousandSep) != "boolean") {
								thousandSep = false;
							}
						} else {
							thousandSep = false;
						}

						// Cantidad de posiciones decimales.
						if (gridStructure.columns[k].hasOwnProperty("decimalPlaces")) {
							decimalPlaces = gridStructure.columns[k].decimalPlaces;
							if (typeof(decimalPlaces) != "number") {
								decimalPlaces = 0;
							}
						} else {
							decimalPlaces = 0;
						}

						cellValue = this.format.numberFormat(cellValue, decimalPlaces, thousandSep);
						break;

					case 'boolean':
						// Si el checkbox debe estar activo.
						var modify = false;
						if (gridStructure.columns[k].hasOwnProperty("modify")) {
							modify = gridStructure.columns[k].modify;
							if (typeof(modify) != 'boolean') {
								modify = false;
							}
						}

						// Toma el valor.
						if (cellValue === '1' || cellValue === 1 ||
							cellValue === true || cellValue === 'true') {
							cellValue = true;
						} else {
							cellValue = false;
						}
						cellValue = '<input translate="no" type="checkbox"' +
							(!modify ? 'disabled="true"' : '') +
							(cellValue ? ' checked' : '') + '>';
						break;

					case 'date':
						cellValue = this.format.formatDate(cellValue);
						break;
				}

				// Establece la alineacion del contenido de la celda.
				if (gridStructure.columns[k].hasOwnProperty("dataAlign")) {
					dataAlign = gridStructure.columns[k].dataAlign;
					if (typeof(dataAlign) != 'string' ||
						(dataAlign != 'left' && dataAlign != 'center' && dataAlign != 'right')) {
						dataAlign = this.grid.defaultColumnTextAlign;
					}
				} else {
					dataAlign = this.grid.defaultColumnTextAlign;
				}

				// Si la columna es oculta.
				if (gridStructure.columns[k].hasOwnProperty("hide")) {
					hide = gridStructure.columns[k].hide;
					if (typeof(hide) != 'boolean') {
						hide = false;
					}
				} else {
					hide = false;
				}

				if (hide) {
					hide = "display: none; ";
				} else {
					hide = " ";
				}

				tableBody +=
					'<td ' +
						'style="width: ' + columnWidth + ';text-align: ' + dataAlign + ';' + hide + ';" ' +
						'class="' + (columnType == 'boolean' ? 'gridControlBodyTdBoolean' : 'gridControlBodyTd') + '" ' +
						'columnType="' + columnType + '">' +
						'<div style="width: ' + columnWidth + '" name="' + fieldName + '">' +
							'<span translate="no" class="' + cellValueSpanClass + '" translate="no">' + cellValue + '</span>' +
						'</div>' +
					'</td>';
			}

			// Agrega el cierre de la fila.
			tableBody += '</tr>';
		}

		// Toma el numero de filas que se deben mostrar en el grid.
		showMaxRows = this.#getMaxRows(gridStructure);

		// Si es necesario agrega filas en blanco hasta completar el maximo.
		if (rows < showMaxRows) {
			for (var r = 0; r < (showMaxRows - rows); r++) {
				tableBody += '<tr class="gridControlBodyTr">';
				for (var i = 0; i < Object.keys(gridStructure.columns).length; i++) {
					// Calcula el ancho de la columna.
					if (gridStructure.columns[i].hasOwnProperty("width")) {
						columnWidth = gridStructure.columns[i].width;
						if (typeof(columnWidth) != "string") {
							columnWidth = this.grid.defaultColumnWidth;
						}
					} else {
						columnWidth = this.grid.defaultColumnWidth;
					}

					// Si la columna es oculta.
					if (gridStructure.columns[i].hasOwnProperty("hide")) {
						hide = gridStructure.columns[i].hide;
						if (typeof(hide) != 'boolean') {
							hide = false;
						}
					} else {
						hide = false;
					}

					if (hide) {
						hide = "display: none; ";
					} else {
						hide = " ";
					}

					tableBody +=
						'<td style="width: ' + columnWidth + ';' + hide + '" ' + 'class="gridControlBodyTd">' +
							'<div style="width: ' + columnWidth + '">' +
								'<span translate="no" translate="no">&nbsp;</span>' +
							'</div>' +
						'</td>';
				}
				tableBody += '</tr>';
			}
		}

		// Agrega el cierre del cuerpo.
		tableBody += '</tbody>';

    	return tableBody;
	}


    /**
     * Devuelve un objeto json con la fila seleccionada.
     */
	#getSelectedRow(gridContainer) {
		var errorMessage;

		// Valida los parametros.
		if (typeof(gridContainer) != "object") {
    		errorMessage = "getSelectedRow: gridContainer, se esperaba un objeto jQuery";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

    	if (gridContainer == null) {
    		errorMessage = "getSelectedRow: gridContainer, el objeto en nulo";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

    	if ($(gridContainer).length == 0) {
    		errorMessage = "getSelectedRow: gridContainer, el contenedor no esta definido";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

    	// Devuelve la fila seleccionada.
		return this.#getRow($(".gridControlSelectedRow", gridContainer));
	}


    /**
     * Devuelve todas las filas de un grid en un objeto json.
     */
	#getAllRows(gridContainer) {
		var errorMessage;

		// Valida los parametros.
		if (typeof(gridContainer) != "object") {
    		errorMessage = "getAllRows: gridContainer, se esperaba un objeto jQuery";
    		this.#consoleInternalError(errorMessage);
    		return [];
    	}

    	if (gridContainer == null) {
    		errorMessage = "getAllRows: gridContainer, el objeto en nulo";
    		this.#consoleInternalError(errorMessage);
    		return [];
    	}

    	if ($(gridContainer).length == 0) {
    		errorMessage = "getAllRows: gridContainer, el contenedor no esta definido";
    		this.#consoleInternalError(errorMessage);
    		return [];
    	}

		var rows = $(".gridControlDataRow", gridContainer);
		var data = new Array();

		for (var i = 0; i < rows.length; i++) {
			data[i] = this.#getRow(rows[i]);
		}

		return this.transform2Json(data);
	}


    /**
     * Devuelve una fila vacia.
     */
	#getEmptyRow(gridContainer) {
		var errorMessage;

		// Valida los parametros.
		if (typeof(gridContainer) != "object") {
    		errorMessage = "getEmptyRow: gridContainer, se esperaba un objeto jQuery";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

    	if (gridContainer == null) {
    		errorMessage = "getEmptyRow: gridContainer, el objeto en nulo";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

    	if ($(gridContainer).length == 0) {
    		errorMessage = "getEmptyRow: gridContainer, el contenedor no esta definido";
    		this.#consoleInternalError(errorMessage);
    		return {};
    	}

		// Recupera la estructura del grid.
		var gridStructure = $(gridContainer).data("gridStructure");
		var columns = gridStructure.columns;
		var emptyRow = {}, columnType;

		// Recorre las conlumnas construyendo el objeto vacio.
		for (var i = 0; i < Object.keys(columns).length; i++) {
			columnType = '';
			if (typeof(columns[i].type) == 'string') {
				columnType = columns[i].type.trim();
			}

			if (this.isEmpty(columnType)) {
				columnType = 'string';
			}

			switch (columnType) {
				case 'boolean':
					emptyRow[columns[i].field] = false;
				case 'number':
					emptyRow[columns[i].field] = 0;
					break;
				case 'icon':
				case 'string':
				default:
					emptyRow[columns[i].field] = '';
					break;
			}
		}

		return this.transform2Json(emptyRow);
	}


    /**
     * Devuelve el numero maximo de filas que debe mostrar el grid.
     */
    #getMaxRows(gridStructure) {
    	var showMaxRows;

    	if (gridStructure.hasOwnProperty("showMaxRows")) {
    		showMaxRows = gridStructure.showMaxRows;
    		switch (typeof(showMaxRows)) {
    		 	case 'number':
    		 		break;
    		 	case 'string':
    		 		if (showMaxRows == '') {
    		 			showMaxRows = this.grid.defaultMaxRows;
    		 		} else if (this.isValidNumber(showMaxRows)) {
    		 			showMaxRows = parseInt(showMaxRows, 10);
    		 		} else {
    		 			showMaxRows = this.grid.defaultMaxRows;
    		 		}
    		 		break;
    		 	default:
    		 		showMaxRows = this.grid.defaultMaxRows;
    		 		break;
    		 }
    	} else {
    		showMaxRows = this.grid.defaultMaxRows;
    	}

    	return showMaxRows;
    }


    /**
     * Selecciona una fila de un grid.
     */
    #selectRow(row, context) {
    	if (row.hasOwnProperty("currentTarget")) {
    		row = row.currentTarget;
    	}

        // Desmarca la fila que se encuentre marcada.
        if (!this.isEmpty(context)) {
            // Desmarca la fila actualmente seleccionada.
            $(".gridControlSelectedRow", context).removeClass("gridControlSelectedRow");
        } else {
            // Desmarca la fila actualmente seleccionada.
            $(".gridControlSelectedRow").removeClass("gridControlSelectedRow");
        }

        // Marca esta fila.
        $(row).addClass("gridControlSelectedRow");
    }


    /**
     * Devuelve los datos de la fila especificada.
     */
    #getRow(row) {
    	// Valida los parametros.
    	if (typeof(row) == "undefined") {
    		this.#consoleInternalError("Core.grid.#getRow: row, no esta definido");
    		return {};
    	}

    	// Toma las columnas.
    	var columns = $("td", row);
    	var data = new Array();
    	var columnName, columnType;

    	for (var i = 0; i < columns.length; i++) {
    		// Toma el nombre del campo.
    		columnName = $(columns[i]).find("div").attr("name");

    		// Si esta vacio le asigna uno.
    		if (this.isEmpty(columnName)) {
    			columnName = 'column' + i.toString();
    		}

    		// Toma el tipo de dato de la columna.
    		columnType = $(columns[i]).attr("columnType");

    		switch (columnType) {
    			case 'icon':
    				var classText = $(columns[i]).find("div").find("span").attr("class");
    				data[columnName] = classText.substr(classText.indexOf(' ') + 1);
    				break;

    			case 'boolean':
    				data[columnName] = $(columns[i]).find("div").find("input").is(":checked");
    				break;

    			case 'number':
    				data[columnName] = this.format.numberUnFormat($(columns[i]).find("div").find("span").text());
    				break;
                
                case 'date':
                    var texto = $(columns[i]).find("div").find("span").text();
                    if (texto == '' || texto.length != 10) {
                        data[columnName] = '';
                    } else {
                        data[columnName] =
                            texto.substring(6) + this.format.dateSqlSep +
                            texto.substring(3, 5) + this.format.dateSqlSep +
                            texto.substring(0, 2);
                    }
    				break;

    			default:
    				data[columnName] = $(columns[i]).find("div").find("span").text();
    				break;
    		}
    	}

    	return this.transform2Json(data);
    }


    /**
     * loadHTML
     * 
     * Carga contenido html en un contenedor.
     * 
     * Parametros:
     * container: (string) elemento donde será cargado el contenido html.
     * url: (string) con la direccion del archivo que se desea cargar.
     * data: (json object) con los parametro a pasar via post.
     * callback (function) funcion que sera ejecutada luego de la carga del archivo.
     */
    loadHTML(container, url, data, callback) {
        // Valida los parametros.
        if ($(container).length == 0) {
            this.#consoleInternalError("loadHTML: container, no se encuentra definido");
            return;
        }

        if (typeof(url) != "string") {
            this.#consoleInternalError("loadHTML: url, se esperaba una cadena");
            return;
        }

        if (url == '') {
            this.#consoleInternalError("loadHTML: url, la cadena esta vacía");
            return;
        }

        if (typeof(data) != 'object') {
            data = {};
        }

        if (typeof(callback) != "function") {
            callback = () => {};
        }

        this.showLoading();
        this.apiFunction('isOnline', {}, (response) => {
            if (response.status) {
                $(container).load(url, data, () => {
                    callback();
                    this.hideLoading();
                });
            } else {
                // Agrega el contenido al contenedor.
                $(container).empty();
                $(container).append(this.#getNoConnectionHTML());

                // Enlaza el evento para el boton reintentar.
                $('.btnReload', container).unbind("click");
                $('.btnReload', container).click(() => {
                    this.loadHTML(container, url, data, callback);
                });

                this.hideLoading();
            }
        });
    }


    /**
     * getNoConnectionHTML
     * 
     * Devuelve el codigo html a mostrar cuando no hay conexion con el servidor.
     */
    #getNoConnectionHTML() {
        var css = '', html = '';
        var imgBase64 = 'data:image/jpeg;base64,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';

        css +=
            '<style>' +
                '.noConnectionMainContainer {' +
                    'width: 100%;' +
                    'height: 100%;' +
                '}' +
                '.noInternetLogoContainer img {' +
                    'width: 180px;' +
                    'height: 180px;' +
                '}' +
            '</style>';

        html +=
            '<div class="noConnectionMainContainer flex flex-hcenter flex-vcenter">' +
                '<div>' +
                    '<div class="flex flex-hcenter">' +
                        '<h4>Sin Conexión</h4>' +
                    '</div>' +
                    '<br>' +
                    '<div class="noInternetLogoContainer flex flex-hcenter">' +
                        '<img src="' + imgBase64 + '" alt="">' +
                    '</div>' +
                    '<br>' +
                    '<div class="flex flex-hcenter">' +
                        '<button class="btn btn-dark btnReload ">Reintentar</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        return css + html;
    }

    
    /**
     * Inicializa el dialogo de confirmacion.
     */
    #confirmSetUp() {
        var cnt = '#dlg-confirm';
        var params = core.data.restore(cnt, 'params');

        if (!this.isEmpty(params.icon)) {
            // Apunta al span que muestra el icono.
            var icon = $('.dialogConfirmTitleIcon', cnt);
        
            // Elimina todas las clases.
            icon.removeClass();
        
            // Agrega la clase id.
            icon.addClass('dialogConfirmTitleIcon');
        
            // Si hay un icono para mostrar agrega la clase.
            if (params.icon != '') {
                icon.addClass(params.icon);
            }
        }

        // Establece el titulo.
        $('.dialogConfirmTitleText', cnt).text(params.title);
        
        // Establece el texto del mensaje.
        $('.dialogConfirmBodyText', cnt).text(params.message);

        // Enlaza los eventos.
        $('.btnDialogConfirmOk', cnt).unbind('click');
        $('.btnDialogConfirmOk', cnt).click(() => {
            var cnt = '#dlg-confirm';
            var params = core.data.restore(cnt, 'params');
            var element = document.getElementById('dlg-confirm');
            element.close();
            params.callbackOk();
        });
    
        $('.btnDialogConfirmCancel', cnt).unbind('click');
        $('.btnDialogConfirmCancel', cnt).click(() => {
            var cnt = '#dlg-confirm';
            var params = core.data.restore(cnt, 'params');
            var element = document.getElementById('dlg-confirm');
            element.close();
            params.callbackCancel();
        });
    }

    /**
     * Crea un menu.
     * 
     * cnt:     Contenedor donde será alojado el menu.
     * struct:  Estructura del menu.
     * 
     * struct {
     *      title: string,
     *      tags: {
     *          {
     *             icon: string,           // Icono del tag.
     *             text: string            // Texto del tag.
     *             command: function       // Comando a ejecutar.
     *             options: {
     *                 {
     *                     text: string        // Texto de la opcion.
     *                     command: function   // Comando a ejecutar.
     *                 }, ...
     *             }
     *         }, ...
     *      }
     * }
     */
    #buildMenu(cnt, struct) {
        // Valida la existencia del contenedor.
        if ($(cnt).length == 0) {
            this.#consoleInternalError("#buildMenu: cnt, no se encuentra definido");
            return;
        }

        // Valida la estructura.
        if (typeof(struct) != 'object') {
            this.#consoleInternalError("#buildMenu: struct, se esperaba un objeto");
            return;
        }

        if (!struct.hasOwnProperty('title')) {
            this.#consoleInternalError("#buildMenu: no contiene la propiedad title");
            return;
        }

        if (typeof(struct.title) != 'string') {
            this.#consoleInternalError("#buildMenu: la propiedad tags debe ser un string");
            return;
        }

        if (!struct.hasOwnProperty('tags')) {
            this.#consoleInternalError("#buildMenu: no contiene la propiedad tags");
            return;
        }

        if (typeof(struct.tags) != 'object') {
            this.#consoleInternalError("#buildMenu: la propiedad tags debe ser un objeto");
            return;
        }

        for (var i = 0; i < Object.keys(struct.tags).length; i++) {
            // Valida que el tag sea un objeto.
            if (typeof(struct.tags[i]) != 'object') {
                this.#consoleInternalError("#buildMenu: la propiedad tags debe contener objetos");
                return;
            }

            // Valida la existencia y el tipo de la propiedad icon.
            if (!struct.tags[i].hasOwnProperty('icon')) {
                this.#consoleInternalError("#buildMenu: no se encuentra la propiedad icon dentro del tag " + (i + 1).toString());
                return;
            }
            if (typeof(struct.tags[i].icon) != 'string') {
                this.#consoleInternalError("#buildMenu: la propiedad icon del tag " + (i + 1).toString() + ' debe ser un string');
                return;
            }

            // Valida la existencia y el tipo de la propiedad text.
            if (!struct.tags[i].hasOwnProperty('text')) {
                this.#consoleInternalError("#buildMenu: no se encuentra la propiedad text dentro del tag " + (i + 1).toString());
                return;
            }
            if (typeof(struct.tags[i].text) != 'string') {
                this.#consoleInternalError("#buildMenu: la propiedad text del tag " + (i + 1).toString() + ' debe ser un string');
                return;
            }

            // Valida la existencia y el tipo de la propiedad command.
            if (!struct.tags[i].hasOwnProperty('command')) {
                this.#consoleInternalError("#buildMenu: no se encuentra la propiedad command dentro del tag " + (i + 1).toString());
                return;
            }
            if (typeof(struct.tags[i].command) != 'function') {
                this.#consoleInternalError("#buildMenu: la propiedad command del tag " + (i + 1).toString() + ' debe ser una funcion');
                return;
            }

            // Si tiene opciones.
            if (struct.tags[i].hasOwnProperty('options')) {
                // Valida que la propiedad options sea un objeto.
                if (typeof(struct.tags[i].options) != 'object') {
                    this.#consoleInternalError("#buildMenu: la propiedad options del tag " + (i + 1).toString() + ' debe ser un objeto');
                    return;
                }

                // Valida las opciones del tag.
                for (var k = 0; k < Object.keys(struct.tags[i].options).length; k++) {
                    // Valida la existencia y el tipo de la propiedad text.
                    if (!struct.tags[i].options[k].hasOwnProperty('text')) {
                        this.#consoleInternalError("#buildMenu: no se encuentra la propiedad text dentro de la opcion " + (k + 1).toString() + " del tag " + (i + 1).toString());
                        return;
                    }
                    if (typeof(struct.tags[i].options[k].text) != 'string') {
                        this.#consoleInternalError("#buildMenu: la propiedad text dentro de la opcion " + (k + 1).toString() + " del tag " + (i + 1).toString() + ' debe ser un string');
                        return;
                    }

                    // Valida la existencia y el tipo de la propiedad command.
                    if (!struct.tags[i].options[k].hasOwnProperty('command')) {
                        this.#consoleInternalError("#buildMenu: no se encuentra la propiedad command dentro de la opcion " + (k + 1).toString() + " del tag " + (i + 1).toString());
                        return;
                    }
                    if (typeof(struct.tags[i].options[k].command) != 'function') {
                        this.#consoleInternalError("#buildMenu: la propiedad command dentro de la opcion " + (k + 1).toString() + " del tag " + (i + 1).toString() + ' debe ser una funcion');
                        return;
                    }
                }
            }
        }

        // Genera el menu.
        var html = '<div class="coreMenuContainer">';

        // Agrega el titulo.
        html +=
            '<div class="coreMenuTitle">' +
                '<span>' + struct.title + '</span>' +
            '</div>';

        var tagRightIcon, subMenu, dropDownTag, id, tagId, optId;
        for (var i = 0; i < struct.tags.length; i++) {
            // Si el tag tiene opciones.
            if (struct.tags[i].options.length > 0) {
                tagRightIcon = '<span class="icon icon-circle-down"></span>';

                // Construye el sub-menu.
                subMenu = '';
                for (var k = 0; k < struct.tags[i].options.length; k++) {
                    id = 'opt-' + this.getUniqueId();
                    optId = 'id="' + id + '"';
                    subMenu +=
                        '<div class="coreMenuOption" ' + optId + '>' +
                            '<span>' + struct.tags[i].options[k].text + '</span>' +
                        '</div>';
                    struct.tags[i].options[k].id = id;
                }
                dropDownTag = 'dropDownTag';
                id = '';
                tagId = '';
                struct.tags[i].id = '';
            } else {
                tagRightIcon = '';
                subMenu = '';
                dropDownTag = '';
                id = 'tag-' + this.getUniqueId();
                tagId = 'id="' + id + '"';
                struct.tags[i].id = id;
            }

            // Construye el tag.
            html +=
                '<div class="coreMenuTag">' +
                    '<div class="coreMenuTagBox ' + dropDownTag + '" ' + tagId + '>' +
                        '<div class="coreMenuTagLeft">' +
                            '<div class="coreMenuTagIcon">' +
                                '<span class="' + struct.tags[i].icon + '"></span>' +
                            '</div>' +
                            '<div class="coreMenuTagText">' +
                                '<span>' + struct.tags[i].text + '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="coreMenuTagRight">' +
                            tagRightIcon +
                        '</div>' +
                    '</div>' +
                    '<div class="coreMenuOptionsBox">' +
                        subMenu +
                    '</div>' +
                '</div>';
        }

        html += '</div>';

        $(cnt).html(html);

        // Enlaza los eventos dropDown.
        $('.dropDownTag', cnt).unbind('click');
        $('.dropDownTag', cnt).click((t) => {
            this.#dropDownTag(t);
        });

        // Enlaza las funciones para los tags del menu.
        for (var i = 0; i < struct.tags.length; i++) {
            // Si tiene un id.
            if (struct.tags[i].id != '') {
                id = struct.tags[i].id;
                $('#' + id).unbind('click');
                $('#' + id).click(struct.tags[i].command);
            }

            // Enlaza las funciones para las opciones del menu.
            for (var k = 0; k < struct.tags[i].options.length; k++) {
                if (struct.tags[i].options[k].id != '') {
                    id = struct.tags[i].options[k].id;
                    $('#' + id).unbind('click');
                    $('#' + id).click(struct.tags[i].options[k].command);
                }
            }
        }
    }

    /**
     * 
     * @param {object} t Objeto con la clase dropDownTag.
     */
    #dropDownTag(t) {
        var parent = $(t.currentTarget).closest('.coreMenuTag');
        var element = $(parent).find('.coreMenuOptionsBox');
        var state = core.data.restore(parent, 'state');

        if (typeof(state) == 'undefined' || state == 0) {
            $(parent).find('.coreMenuTagRight>span').removeClass('icon-circle-down');
            $(parent).find('.coreMenuTagRight>span').addClass('icon-circle-up');
            core.data.save(parent, 'state', 1);
        } else {
            $(parent).find('.coreMenuTagRight>span').removeClass('icon-circle-up');
            $(parent).find('.coreMenuTagRight>span').addClass('icon-circle-down');
            core.data.save(parent, 'state', 0);
        }

        $(element).slideToggle();
    }
}


/**
 * Clase Queue.
 */
class Queue {
    #dataStore;

    constructor(elements) {
        this.#dataStore = [];

        if (typeof(elements) == 'object' && elements != null && Array.isArray(elements)) {
            for (var i = 0; i < elements.length; i++) {
                this.enqueue(elements[i]);
            }
        }
    }

    // Definicion de metodos.
    enqueue(element) {
        this.#dataStore.push(element);
    }

    dequeue() {
        return this.#dataStore.shift();
    }

    empty() {
        return this.#dataStore = [];
    }

    isEmpty() {
        return this.#dataStore.length == 0;
    }

    length() {
        return this.#dataStore.length;
    }

    toArray() {
        return this.#dataStore;
    }
}
