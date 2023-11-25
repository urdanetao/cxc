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
	}
	
	$jsonData = json_encode($response, JSON_INVALID_UTF8_IGNORE + JSON_UNESCAPED_UNICODE);
	echo($jsonData);
?>
