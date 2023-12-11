<?php
	// Si no se establecio el id del procedimiento en los parametros POST.
	if (!isset($_POST['idProc'])) {
		die();
	}

	// Toma el id del procedimiento.
	$idProc = $_POST['idProc'];

	// Si hay parametros adicionales.
	if (isset($_POST['jsonParams'])) {
		$jsonParams = $_POST['jsonParams'];
	} else {
		$jsonParams = '';
	}

	// Establece la respuesta por defecto.
	$response['status'] = false;
	$response['message'] = "Funcion no definida";

	// 
	// Incluye las librerias basicas.
	// 
	require_once __DIR__ . "/common.php";

	// Escapa los caracteres especiales.
	$jsonParams = escapeChars($jsonParams);

	// Libreria.
	require_once __DIR__ . '/apicode.php';

	// 
	// Evalua el idProc en la libreria del sistema.
	// 

	switch ($idProc) {
		// Funciones generales de la api.
		case 'isOnline':
			$response = isOnline();
			break;
		
		// Prepara los datos del reporte.
		case 'prepare-report':
			$response = prepareReport($jsonParams);
			break;
		
		// Lee los ultimos 5 registros.
		case 'getLast5Records':
			$response = getLast5Records($jsonParams);
			break;
		
		// Inicio de sesion de usuario.
		case 'login':
			$response = login($jsonParams);
			break;

		// Finaliza la sesion de usuario.
		case 'logout':
			$response = logout();
			break;
		
		// Carga la configuracion.
		case 'configLoad':
			$response = configLoad();
			break;
			
		// Guarda la configuracion.
		case 'configSave':
			$response = configSave($jsonParams);
			break;

		// Busca una moneda.
		case 'monedasSearch':
			$response = monedasSearch($jsonParams);
			break;

		// Carga una moneda.
		case 'monedasLoad':
			$response = monedasLoad($jsonParams);
			break;

		// Guarda una moneda.
		case 'monedasSave':
			$response = monedasSave($jsonParams);
			break;

		// Elimina una moneda.
		case 'monedasDelete':
			$response = monedasDelete($jsonParams);
			break;
		
		// Busca una empresa.
		case 'empresasSearch':
			$response = empresasSearch($jsonParams);
			break;

		// Carga una empresa.
		case 'empresasLoad':
			$response = empresasLoad($jsonParams);
			break;

		// Guarda una empresa.
		case 'empresasSave':
			$response = empresasSave($jsonParams);
			break;

		// Elimina una empresa.
		case 'empresasDelete':
			$response = empresasDelete($jsonParams);
			break;

		// Busca un cliente.
		case 'clientesSearch':
			$response = clientesSearch($jsonParams);
			break;

		// Carga un cliente.
		case 'clientesLoad':
			$response = clientesLoad($jsonParams);
			break;

		// Guarda un cliente.
		case 'clientesSave':
			$response = clientesSave($jsonParams);
			break;

		// Elimina un cliente.
		case 'clientesDelete':
			$response = clientesDelete($jsonParams);
			break;
		
		// Obtiene el saldo general por moneda.
		case 'saldoGeneralMoneda':
			$response = saldoGeneralMoneda($jsonParams);
			break;

		// Obtiene el saldo general por cliente.
		case 'saldoGeneralCliente':
			$response = saldoGeneralCliente($jsonParams);
			break;

		// Obtiene el resumen de un cliente.
		case 'loadDetalleCliente':
			$response = loadDetalleCliente($jsonParams);
			break;

		// Carga productos desde la base de datos SAINT.
		case 'saintProductosLoad':
			$response = saintProductosLoad($jsonParams);
			break;

		// Busca productos desde la base de datos SAINT.
		case 'saintProductosSearch':
			$response = saintProductosSearch($jsonParams);
			break;
		
		// Carga la cabecera y el detalle de un documento.
		case 'documentosLoad':
			$response = documentosLoad($jsonParams);
			break;

		// Guarda una CxC.
		case 'documentosSave':
			$response = documentosSave($jsonParams);
			break;
		
		// Elimina un documento.
		case 'documentosDelete':
			$response = documentosDelete($jsonParams);
			break;
		
		// Guarda un abono.
		case 'abonosSave':
			$response = abonosSave($jsonParams);
			break;

		// Elimina un abono.
		case 'abonosDelete':
			$response = abonosDelete($jsonParams);
			break;
	}
	
	$jsonData = json_encode($response, JSON_INVALID_UTF8_IGNORE + JSON_UNESCAPED_UNICODE);
	echo($jsonData);
?>
