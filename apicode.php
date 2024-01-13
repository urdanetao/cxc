<?php
	require_once __DIR__ . '/mysql-data-manager.php';
	require_once __DIR__ . '/dbinfo.php';

	/**
	 * Devuelve true en señal de que el server esta en linea.
	 */
    function isOnline() {
        return getResultObject(true, '');
    }

	/**
	 * Guarda los datos del reporte en la sesion del usuario.
	 */
	function prepareReport($jsonParams) {
		$_SESSION['reportData'] = $jsonParams;
		return getResultObject(true, "");
	}

	/**
	 * Devuelve los ultimos 5 registros de una tabla.
	 */
	function getLast5Records($jsonParams) {
		// Valida los parametros.
		if (!isset($jsonParams['tableName'])) {
			return getResultObject(false, "getLast5Records: No se indico: 'tableName'");
		}

		$tableName = $jsonParams['tableName'];

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "select t.* from  $tableName as t order by t.id desc limit 5";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}


	/**
	 * Inicio de sesion de usuario.
	 */
	function login($jsonParams) {
		$nickname = $jsonParams['nickname'];
		$pwd = $jsonParams['pwd'];

		if ($nickname == '') {
			return getResultObject(false, 'Debe indicar un nombre de usuario');
		}
		if ($pwd == '') {
			return getResultObject(false, 'Debe indicar una contraseña');
		}

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Busca el usuario.
		$sqlCommand = "select t.* from usuarios as t where t.nickname = '$nickname'";
		$cursor = $conn->Query($sqlCommand);

        if ($cursor === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

        if (count($cursor) == 0) {
			$msg = "El usuario '$nickname' no se encuentra registrado";
            $conn->Close();
            return getResultObject(false, $msg);
        }

		// Finaliza la conexion.
		$conn->Close();

		// Calcula el hash del password.
		$pwdHashed = hash("sha3-512", $pwd);

		// Comprueba la contraseña.
		if ($pwdHashed == $cursor[0]['pwd']) {
			// Inicia la sesion del usuario.
			$_SESSION['user'] = $cursor[0];
			return getResultObject(true, 'Sesión iniciada con exito...');
		} else {
			return getResultObject(false, 'Contraseña invalida');
		}
	}


	/**
     * Finaliza la sesion del usuario.
     */
    function logout() {
	    // Destruye la sesion activa.
	    if (isset($_SESSION['user'])) {
	        unset($_SESSION['user']);
	    }
	    
		session_destroy();
	    return getResultObject(true, "La sesión ha finalizado...");
	}


	/**
	 * Cambio de email - paso 1.
	 */
	function changeEmail01($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		// Toma los parametros.
		$pwd = $jsonParams['pwd'];
		$email = $jsonParams['email'];

		if ($pwd == '') {
			return getResultObject(false, 'Debe indicar su contraseña');
		}

		if ($email == '') {
			return getResultObject(false, 'Debe indicar la nueva dirección de correo electrónico');
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return getResultObject(false, 'El nuevo correo electrónico no es válido');
		}

		// Valida la contraseña.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Busca el usuario.
		$nickname = $_SESSION['user']['nickname'];
		$sqlCommand = "select t.* from usuarios as t where t.nickname = '$nickname'";
		$cursor = $conn->Query($sqlCommand);

        if ($cursor === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

        if (count($cursor) == 0) {
			$msg = "El usuario '$nickname' no se encuentra registrado";
            $conn->Close();
            return getResultObject(false, $msg);
        }

		// Finaliza la conexion.
		$conn->Close();

		// Calcula el hash del password.
		$pwdHashed = hash("sha3-512", $pwd);

		if ($pwdHashed != $cursor[0]['pwd']) {
			return getResultObject(false, 'La contraseña no es válida');
		}

		$pinCode = generatePin();

		// Guarda la informacion temporal.
		$_SESSION['userData'] = array(
			'pinCode' => $pinCode,
			'email' => $email
		);

		$userName = $_SESSION['user']['nombre'];

		// sendMail retorna un objeto getResultObject.
		$sent = sendMail(__DIR__ . '/templates/email-template.txt', 'Codigo de Seguridad', $email, $userName, $pinCode);

		return $sent;
	}


	/**
	 * Cambio de email - paso 2.
	 */
	function changeEmail02($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		if (!isset($_SESSION['userData']) || !isset($_SESSION['userData']['pinCode']) || !isset($_SESSION['userData']['email'])) {
			die();
		}

		// Toma los parametros.
		$pinCode = $jsonParams['pinCode'];

		if ($pinCode == '') {
			return getResultObject(false, 'Debe indicar el pin de seguridad');
		}

		$pinCode = $_SESSION['userData']['pinCode'];
		$email = $_SESSION['userData']['email'];

		if ($jsonParams['pinCode'] != $pinCode) {
			return getResultObject(false, 'Codigo de seguridad inválido');
		}

		// Guarda el nuevo correo electronico.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Actualiza el correo electronico del usuario.
		$nickname = $_SESSION['user']['nickname'];
		$sqlCommand = "update usuarios set email = '$email' where nickname = '$nickname'";

        if ($conn->Query($sqlCommand) === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

		// Carga nuevamente el registro del usuario en la sesion.
		$sqlCommand = "select t.* from usuarios as t where t.nickname = '$nickname'";

		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

		if (count($cursor) == 0) {
			$msg = 'Usuario no existe';
            $conn->Close();
            return getResultObject(false, $msg);
		}

		$_SESSION['user'] = $cursor[0];

		// Finaliza la conexion.
		$conn->Close();

		unset($_SESSION['userData']);

		return getResultObject(true, 'El correo electrónico ha sido cambiado con exito');
	}


	/**
	 * Cambio de contraseña.
	 */
	function changePwd($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$pwd = $jsonParams['pwd'];
		$pwdNew = $jsonParams['pwdNew'];
		$pwdVerify = $jsonParams['pwdVerify'];

		// Valida la contraseña actual.
		if ($pwd == '') {
			return getResultObject(false, 'Debe indicar su contraseña actual');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Busca el usuario.
		$nickname = $_SESSION['user']['nickname'];
		$sqlCommand = "select t.* from usuarios as t where t.nickname = '$nickname'";
		$cursor = $conn->Query($sqlCommand);

        if ($cursor === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

        if (count($cursor) == 0) {
			$msg = "El usuario '$nickname' no se encuentra registrado";
            $conn->Close();
            return getResultObject(false, $msg);
        }

		// Calcula el hash del password actual.
		$pwdHashed = hash("sha3-512", $pwd);

		if ($pwdHashed != $cursor[0]['pwd']) {
			$conn->Close();
			return getResultObject(false, 'La contraseña no es válida');
		}

		// Valida la nueva contraseña.
		if ($pwdNew == '') {
			$conn->Close();
			return getResultObject(false, 'Debe indicar una nueva contraseña');
		}

		if ($pwdNew != $pwdVerify) {
			$conn->Close();
			return getResultObject(false, 'No coincide la nueva contraseña con la verificación');
		}

		// Calcula el hash del nuevo password.
		$pwdHashed = hash("sha3-512", $pwdNew);

		$sqlCommand = "update usuarios set pwd = '$pwdHashed' where nickname = '$nickname'";
		if ($conn->Query($sqlCommand) === false) {
			$msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
		}

		// Finaliza la conexion.
		$conn->Close();

		return getResultObject(true, 'Contraseña cambiada con exito');
	}


	/**
	 * Cambio de contraseña offline (recuperar contraseña).
	 */
	function changePwdOffline($jsonParams) {
		if (isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		if (!isset($_SESSION['userData']) || !isset($_SESSION['userData']['pinCode']) || !isset($_SESSION['userData']['email'])) {
			die();
		}
		
		$pinCode = $jsonParams['pinCode'];
		$pwdNew = $jsonParams['pwdNew'];
		$pwdVerify = $jsonParams['pwdVerify'];

		// Valida el codigo de seguridad.
		if ($pinCode == '') {
			return getResultObject(false, 'Debe indicar el codigo de seguridad');
		}

		if ($pinCode != $_SESSION['userData']['pinCode']) {
			return getResultObject(false, 'Código de seguridad inválido');
		}

		// Valida la nueva contraseña.
		if ($pwdNew == '') {
			return getResultObject(false, 'Debe indicar la nueva contraseña');
		}

		if ($pwdNew != $pwdVerify) {
			return getResultObject(false, 'No coinciden las contraseñas');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Calcula el hash del password actual.
		$pwdHashed = hash("sha3-512", $pwdNew);

		// Actualiza la contraseña del usuario.
		$email = $_SESSION['userData']['email'];
		$sqlCommand = "update usuarios set pwd = '$pwdHashed' where email = '$email'";
		
        if ($conn->Query($sqlCommand) === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
        }

		// Finaliza la conexion.
		$conn->Close();

		unset($_SESSION['userData']);

		return getResultObject(true, 'Contraseña establecida con exito');
	}


	/**
	 * Cambio de contraseña temporal.
	 */
	function changeTmpPwd($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$pwdNew = $jsonParams['pwdNew'];
		$pwdVerify = $jsonParams['pwdVerify'];

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		// Valida la nueva contraseña.
		if ($pwdNew == '') {
			$conn->Close();
			return getResultObject(false, 'Debe indicar una nueva contraseña');
		}

		if ($pwdNew != $pwdVerify) {
			$conn->Close();
			return getResultObject(false, 'No coincide la nueva contraseña con la verificación');
		}

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		// Calcula el hash del nuevo password.
		$nickname = $_SESSION['user']['nickname'];
		$pwdHashed = hash("sha3-512", $pwdNew);

		$sqlCommand =
			"update usuarios set
				pwd = '$pwdHashed',
				chpwd = '0'
			where
				nickname = '$nickname'";
		if ($conn->Query($sqlCommand) === false) {
			$msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
		}

		// Finaliza la conexion.
		$conn->Close();

		// Establece los nuevos datos en la sesion.
		$_SESSION['user']['pwd'] = $pwdHashed;
		$_SESSION['user']['chpwd'] = '0';

		return getResultObject(true, 'Contraseña temporal cambiada con exito');
	}


	/**
	 * Envia un correo con el codigo de seguridad.
	 */
	function sendEmail($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$email = $jsonParams['email'];

		if ($email == '') {
			return getResultObject(false, 'Debe indicar la dirección de correo electrónico');
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return getResultObject(false, 'El correo electrónico no es válido');
		}

		$pinCode = generatePin();

		// Guarda la informacion temporal.
		$_SESSION['userData'] = array(
			'pinCode' => $pinCode,
			'email' => $email
		);

		$userName = $_SESSION['user']['nombre'];

		// sendMail retorna un objeto getResultObject.
		$sent = sendMail(__DIR__ . '/templates/email-template.txt', 'Codigo de Seguridad', $email, $userName, $pinCode);

		return $sent;
	}


	/**
	 * Envia un correo con el codigo de seguridad sin el usuario logueado.
	 */
	function sendEmailOffline($jsonParams) {
		if (isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$email = $jsonParams['email'];

		if ($email == '') {
			return getResultObject(false, 'Debe indicar el correo electrónico asociado a la cuenta de usuario');
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return getResultObject(false, 'El correo electrónico no es válido');
		}

		// Busca el registro del usuario.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);
		
		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
			die();
		}

		$sqlCommand = "select t.* from usuarios as t where email = '$email'";
		$result = $conn->Query($sqlCommand);
				
		if ($result === false) {
			$msg = $conn->GetErrorMessage();
            $conn->Close();
            return getResultObject(false, $msg);
		}

		if (count($result) == 0) {
			$msg = 'La dirección de correo electrónico no se encuentra registrada';
            $conn->Close();
            return getResultObject(false, $msg);
		}

		// Finaliza la conexion.
		$conn->Close();

		// Genera el codigo de seguridad.
		$pinCode = generatePin();

		// Guarda la informacion temporal.
		$_SESSION['userData'] = array(
			'pinCode' => $pinCode,
			'email' => $email
		);

		$userName = $result[0]['nombre'];

		// sendMail retorna un objeto getResultObject.
		$sent = sendMail(__DIR__ . '/templates/email-template.txt', 'Codigo de Seguridad', $email, $userName, $pinCode);

		return $sent;
	}


	/**
	 * Busca una moneda.
	 */
	function monedasSearch($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from monedas as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }


	/**
	 * Carga una moneda.
	 */
	function monedasLoad($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$unique = false;
		if (isset($jsonParams['id'])) {
			$unique = true;
			$id = $jsonParams['id'];
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				t.*
			from
				monedas as t";
		
		if ($unique) {
			$sqlCommand .= " where t.id = '$id'";
		}

		$sqlCommand .= ';';
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if ($unique && count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}


	/**
	 * Guarda una moneda.
	 */
	function monedasSave($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];
		$siglas = $jsonParams['siglas'];
		$nombre = $jsonParams['nombre'];

		// Valida los campos requeridos.
		if ($siglas == '') {
			return getResultObject(false, 'Debe indicar las siglas de la moneda');
		}

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre de la moneda');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro registro con el mismo valor en las siglas o el nombre.
		$sqlCommand =
			"select
				t.*
			from
				monedas as t
			where
				(t.siglas = '$siglas' or t.nombre = '$nombre')";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una moneda registrada con estas mismas siglas o nombre');
		}

		// Si no tiene correlativo.
		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from monedas as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into monedas (
					id, siglas, nombre)
				values (
					'$id', '$siglas', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update monedas set
					siglas = '$siglas',
					nombre = '$nombre'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}


	/**
	 * Elimina una moneda.
	 */
	function monedasDelete($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que la moneda no se encuentre registrada en ninguna transaccion.
		$sqlCommand = "select t.id from cxc as t where t.idmon = '$id' limit 1";
		$result = $conn->Query($sqlCommand);
		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			$msg = 'Existen transacciones registradas con esta moneda, no se puede eliminar';
			return getResultObject(false, $msg);
		}

		$sqlCommand = "delete from monedas where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Busca una empresa.
	 */
	function empresasSearch($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from empresas as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }


	/**
	 * Busca un producto desde saint.
	 */
	function saintProductosSearch($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('saiverdb');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select
				t.codprod as codigo,
				t.descrip as descrip
			from
				saprod as t
			where
				t.descrip like '%$textToFind%'
			order by
				t.descrip";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }


	/**
	 * Carga una empresa.
	 */
	function empresasLoad($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$unique = false;
		if (isset($jsonParams['id'])) {
			$unique = true;
			$id = $jsonParams['id'];
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				t.*
			from
				empresas as t";

		if ($unique) {
			$sqlCommand .= " where t.id = '$id'";
		}

		$sqlCommand .= ' order by t.nombre;';
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if ($unique && count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}


	/**
	 * Guarda una empresa.
	 */
	function empresasSave($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];

		// Valida los campos requeridos.
		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre de la empresa');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro registro con el mismo valor en las siglas o el nombre.
		$sqlCommand =
			"select
				t.*
			from
				empresas as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una empresa registrada con este mismo nombre');
		}

		// Si no tiene correlativo.
		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from empresas as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into empresas (
					id, nombre)
				values (
					'$id', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update empresas set
					nombre = '$nombre'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}


	/**
	 * Elimina una empresa.
	 */
	function empresasDelete($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que la empresa no tenga registrada ninguna transaccion.
		$sqlCommand = "select t.id from cxc as t where t.idemp = '$id' limit 1";
		$result = $conn->Query($sqlCommand);
		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			$msg = 'Existen transacciones registradas en esta empresa, no se puede eliminar';
			return getResultObject(false, $msg);
		}

		$sqlCommand = "delete from empresas where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Busca un cliente.
	 */
	function clientesSearch($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from clientes as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }


	/**
	 * Carga un clientes.
	 */
	function clientesLoad($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				t.*
			from
				clientes as t
			where
				t.id = '$id';";
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if (count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}


	/**
	 * Guarda un cliente.
	 */
	function clientesSave($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];
		$esp = normalizeBooleanInteger($jsonParams['esp']);

		// Valida los campos requeridos.
		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del cliente');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro registro con el mismo valor en las siglas o el nombre.
		$sqlCommand =
			"select
				t.*
			from
				clientes as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe un cliente registrado con este mismo nombre');
		}

		// Si no tiene correlativo.
		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from clientes as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into clientes (
					id, nombre, esp)
				values (
					'$id', '$nombre', '$esp');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update clientes set
					nombre = '$nombre',
					esp = '$esp'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}


	/**
	 * Elimina un cliente.
	 */
	function clientesDelete($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que el cliente no tenga registrada ninguna transaccion.
		$sqlCommand = "select t.id from cxc as t where t.idcli = '$id' limit 1";
		$result = $conn->Query($sqlCommand);
		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			$msg = 'Este cliente tiene transacciones registradas, no se puede eliminar';
			return getResultObject(false, $msg);
		}

		$sqlCommand = "delete from clientes where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Toma el saldo general por moneda.
	 */
	function saldoGeneralMoneda($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$idemp = $jsonParams['idemp'];
		$tipo = $jsonParams['tipo'];

		if ($tipo == '0') {
			$condTipo = 'true';
		} else {
			$condTipo = "c.tipo = '$tipo'";
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				x.*,
				(x.debitos - x.creditos) as saldo
			from
				(select
					t.idmon,
					t.siglas,
					t.nommon,
					sum(t.debitos) as debitos,
					sum(t.creditos) as creditos
				from
					(select
						c.idmon,
						m.siglas,
						m.nombre as nommon,
						(select sum(d.monto) from cxcdet as d where d.idparent = c.id) as debitos,
						coalesce((select sum(p.monto) from cxcpag as p where p.idparent = c.id), 0) as creditos
					from
						cxc as c
						left join monedas as m on m.id = c.idmon
					where
						c.idemp = '$idemp' and
						$condTipo) as t
				group by
					t.idmon,
					t.siglas,
					t.nommon) as x
			order by
				x.nommon";

		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();
		return getResultObject(true, '', $cursor);
	}


	/**
	 * Obtiene el saldo general por cliente.
	 */
	function saldoGeneralCliente($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$idemp = $jsonParams['idemp'];
		$tipo = $jsonParams['tipo'];
		$idmon = $jsonParams['idmon'];
		$idcli = $jsonParams['idcli'];

		if ($tipo == '0') {
			$condTipo = 'true';
		} else {
			$condTipo = "c.tipo = '$tipo'";
		}

		if ($idcli == '') {
			$condCliente = 'true';
		} else {
			$condCliente = "c.idcli = '$idcli'";
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				x.idcli,
				x.nomcli,
				sum(x.debitos) as debitos,
				sum(x.creditos) as creditos,
				sum(x.saldo) as saldo
			from
				(select
					t.*,
					(t.debitos - t.creditos) as saldo
				from
					(select
						c.idcli,
						cl.nombre as nomcli,
						(select sum(t.monto) from cxcdet as t where t.idparent = c.id) as debitos,
						coalesce((select sum(t.monto) from cxcpag as t where t.idparent = c.id), 0) as creditos
					from
						cxc as c
						left join clientes as cl on cl.id = c.idcli
					where
						c.idemp = '$idemp' and
						$condTipo and
						c.idmon = '$idmon' and
						$condCliente) as t) as x
			group by
				x.idcli,
				x.nomcli
			order by
				x.nomcli";
		
		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();
		return getResultObject(true, '', $cursor);
	}


	/**
	 * Carga el detalle de un cliente.
	 */
	function loadDetalleCliente($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$idemp = $jsonParams['idemp'];
		$idmon = $jsonParams['idmon'];
		$idcli = $jsonParams['idcli'];
		$tipo = $jsonParams['tipo'];
		$ver = $jsonParams['ver'];

		if ($tipo == '0') {
			$condTipo = 'true';
		} else {
			$condTipo = "c.tipo = '$tipo'";
		}

		$condPagado = 'true';
		switch ($ver) {
			case '0':
				$condPagado = "c.pagado = '0'";
				break;
			case '1':
				$condPagado = "c.pagado = '1'";
				break;
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
		$sqlCommand =
			"select
				t.*,
				(t.debitos - t.creditos) as saldo
			from
				(select
					c.*,
					case
						when c.tipo = '1' then 'PERSONAL'
						when c.tipo = '2' then 'COMERCIAL'
						else ''
					end as tipotexto,
					(select sum(d.monto) from cxcdet as d where d.idparent = c.id) as debitos,
					coalesce((select sum(p.monto) from cxcpag as p where p.idparent = c.id), 0) as creditos
				from
					cxc as c
				where
					c.idemp = '$idemp' and
					c.idmon = '$idmon' and
					c.idcli = '$idcli' and
					$condTipo and
					$condPagado) as t
			order by
				t.fecha";

		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();
		return getResultObject(true, '', $cursor);
	}


	/**
	 * Carga productos desde SAINT.
	 */
	function saintProductosLoad($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$codigo = $jsonParams['codigo'];

		// Conecta con la tabla de productos local.
		$dbInfo = getMySqlDbInfo('saiverdb');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Carga los productos desde la tabla remota.
		$sqlCommand =
			"select
				t.codprod as codigo,
				t.descrip as descrip
			from
				saprod as t
			where
				t.codprod = '$codigo' or
				t.refere = '$codigo' or
				t.descrip like '%$codigo%'
			order by
				t.descrip";
		$cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$msg = count($cursor) . " Registros encontrados";
		return getResultObject(true, $msg, $cursor);
	}


	/**
	 * Carga un documento con su detalle y abonos.
	 */
	function documentosLoad($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		// Id del documento.
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$data = array();

		// Carga la cabecera.
		$sqlCommand = "select t.* from cxc as t where t.id = '$id';";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) == 0) {
			$conn->Close();
			return getResultObject(false, 'No se encuentra el registro');
		}

		$data['registro'] = $result[0];

		// Carga el detalle.
		$sqlCommand =
			"select
				t.*
			from
				cxcdet as t
			where
				t.idparent = '$id'
			order by
				t.id";

		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$data['detalle'] = $cursor;

		// Carga los abonos.
		$sqlCommand =
			"select
				t.*
			from
				cxcpag as t
			where
				t.idparent = '$id'
			order by
				t.id";

		$cursor = $conn->Query($sqlCommand);
		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$data['abonos'] = $cursor;

		$conn->Close();
		return getResultObject(true, '', $data);
	}


	/**
	 * Guarda una CxC.
	 */
	function documentosSave($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$r = $jsonParams['r'];

		if (isset($jsonParams['d'])) {
			$d = $jsonParams['d'];
		} else {
			$d = array();
		}

		if (isset($jsonParams['deletedItems'])) {
			$deletedItems = $jsonParams['deletedItems'];
		} else {
			$deletedItems = array();
		}

		// Procesa la cabecera.
		$id = $r['id'];
		$idemp = $r['idemp'];
		$idmon = $r['idmon'];
		$idcli = $r['idcli'];
		$tipo = $r['tipo'];
		$fecha = $r['fecha'];
		$descrip = $r['descrip'];

		if ($idemp == '') {
			return getResultObject(false, 'No hay empresa seleccionada');
		}
		if ($idmon == '') {
			return getResultObject(false, 'No hay moneda seleccionada');
		}
		if ($idcli == '') {
			return getResultObject(false, 'No hay cliente seleccionado');
		}
		if ($fecha == '') {
			return getResultObject(false, 'Debe indicar la fecha de la transacción');
		}
		if ($descrip == '') {
			return getResultObject(false, 'Debe indicar una descripcion para la transacción');
		}
		if ($tipo == '0') {
			return getResultObject(false, 'Debe indicar el tipo de transacción');
		}

		// Si no hay registros en el detalle.
		if (count($d) == 0) {
			return getResultObject(false, 'No hay ningún item registrado en el documento');
		}

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia una transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si el registro es nuevo.
		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from cxc as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el registro.
			$sqlCommand =
				"insert into cxc (
					id, idemp, idmon, idcli, tipo, fecha, descrip, pagado)
				values (
					'$id', '$idemp', '$idmon', '$idcli', '$tipo', '$fecha', '$descrip', '0');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update cxc set
					tipo = '$tipo',
					fecha = '$fecha',
					descrip = '$descrip'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Procesa el detalle.
		$idparent = $id;
		for ($i = 0; $i < count($d); $i++) {
			// Toma los valores del registro.
			$iditem = $d[$i]['id'];
			$codigo = $d[$i]['codigo'];
			$descrip = $d[$i]['descrip'];
			$precio = $d[$i]['precio'];
			$cantidad = $d[$i]['cantidad'];
			$monto = $d[$i]['monto'];

			// Si el item es nuevo.
			if (strlen($iditem) == 36) {
				// Busca el correlativo.
				$sqlCommand = "select t.id from cxcdet as t order by t.id desc limit 1";
				$result = $conn->Query($sqlCommand);

				if ($result === false) {
					$conn->Query('rollback;');
					$conn->Close();
					return getResultObject(false, $conn->GetErrorMessage());
				}

				if (count($result) == 0) {
					$iditem = 1;
				} else {
					$iditem = intval($result[0]['id']) + 1;
				}

				// Agrega el registro.
				$sqlCommand =
					"insert into cxcdet (
						id, idparent, codigo, descrip, precio, cantidad, monto)
					values (
						'$iditem', '$id', '$codigo', '$descrip', '$precio', '$cantidad', '$monto');";
			} else {
				// Actualiza el regisro.
				$sqlCommand =
					"update cxcdet set
						codigo = '$codigo',
						descrip = '$descrip',
						precio = '$precio',
						cantidad = '$cantidad',
						monto = '$monto'
					where
						id = '$iditem';";
			}

			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
		}

		// Procesa los items eliminados.
		for ($i = 0; $i < count($deletedItems); $i++) {
			$iditem = $deletedItems[$i];
			$sqlCommand = "delete from cxcdet where id = '$iditem'";

			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro guardado con exito');
	}


	/**
	 * Elimina un documento completo.
	 */
	function documentosDelete($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia una transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina los abonos.
		$sqlCommand = "delete from cxcpag where idparent = '$id';";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el detalle del documento.
		$sqlCommand = "delete from cxcdet where idparent = '$id';";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el documento.
		$sqlCommand = "delete from cxc where id = '$id';";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Guarda un abono.
	 */
	function abonosSave($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];
		$idparent = $jsonParams['idparent'];
		$fecha = $jsonParams['fecha'];
		$descrip = $jsonParams['descrip'];
		$monto = floatval($jsonParams['monto']);

		// Valida los campos requeridos.
		if ($idparent == '') {
			return getResultObject(false, 'No hay codigo de transacción');
		}

		if ($fecha == '') {
			return getResultObject(false, 'Debe indicar la fecha del abono');
		}

		if ($descrip == '') {
			return getResultObject(false, 'Debe indicar una descripción para el abono');
		}

		if (floatval($monto) <= 0) {
			return getResultObject(false, 'El monto del abono debe ser mayor a cero (0)');
		}

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia una transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si el abono existe busca el valor del monto original.
		if ($id == '') {
			$montoOriginal = 0;
		} else {
			$sqlCommand = "select t.monto from cxcpag as t where t.id = '$id'";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, 'No existe el registro del abono');
			}

			$montoOriginal = floatval($result[0]['monto']);
		}

		// Busca el saldo del documento.
		$sqlCommand =
			"select
				t.*,
				(t.debitos - t.creditos) as saldo
			from
				(select
					(select sum(t.monto) from cxcdet as t where t.idparent = '$idparent') as debitos,
					coalesce((select sum(t.monto) from cxcpag as t where t.idparent = '$idparent'), 0) as creditos) as t";

		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) == 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'No se encuentra el registro del documento');
		}
		
		$saldo = floatval($result[0]['saldo']) + $montoOriginal;

		if ($monto > $saldo) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'El monto del abono supera el saldo del documento');
		}
		
		// Establece el valor del campo "pagado".
		if ($monto == $saldo) {
			$pagado = 1;
		} else {
			$pagado = 0;
		}

		// Si el registro es nuevo.
		if ($id == '') {
			// Busca el correlativo.
			$sqlCommand = "select t.id from cxcpag as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el registro.
			$sqlCommand =
				"insert into cxcpag (
					id, idparent, fecha, descrip, monto)
				values (
					'$id', '$idparent', '$fecha', '$descrip', '$monto')";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update cxcpag set
					fecha = '$fecha',
					descrip = '$descrip',
					monto = '$monto'
				where
					id = '$id';";
		}

		// Ejecuta el comando.
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si debe marcar el documento como pagado.
		$sqlCommand = "update cxc set pagado = '$pagado' where id = '$idparent';";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro guardado con exito');
	}


	/**
	 * Elimina un abono.
	 */
	function abonosDelete($jsonParams) {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$id = $jsonParams['id'];
		$idparent = $jsonParams['idparent'];

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia una transaccion.
		if ($conn->Query('start transaction read write;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el abono.
		$sqlCommand = "delete from cxcpag where id = '$id';";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Actualiza el documento como "no pagado".
		$sqlCommand = "update cxc set pagado = '0' where id = '$idparent';";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Reporte general de saldos 01.
	 */
	function repGeneralSaldos($params) {
		$idemp = $params['idemp'];
		$tipo = $params['tipo'];
		$idcli = $params['idcli'];
		$esp = normalizeBooleanInteger($params['esp']);
		$pagados = normalizeBooleanInteger($params['pagados']);

		if ($esp == '1') {
			$whereEsp = "true";
		} else {
			$whereEsp = "cl.esp = '0'";
		}

		if ($pagados == '1') {
			$wherePagados = "true";
		} else {
			$wherePagados = "c.pagado = '0'";
		}

		if (isset($params['idmon'])) {
			$idmon = $params['idmon'];
		} else {
			$idmon = '0';
		}

		// Condicion de empresa.
		if ($idemp == '0') {
			$whereEmpresa = 'true';
		} else {
			$whereEmpresa = "c.idemp = '$idemp'";
		}

		// Condicion tipo transaccion.
		switch ($tipo) {
			case '0':
				$condicionTipo = 'true';
				break;
			case '1':
				$condicionTipo = "c.tipo = '1'";
				break;
			case '2':
				$condicionTipo = "c.tipo = '2'";
				break;
		}

		// Condicion del cliente.
		if ($idcli == '') {
			$condicionCliente = 'true';
		} else {
			$condicionCliente = "c.idcli = '$idcli'";
		}

		// Condicion de la moneda.
		if ($idmon == '0') {
			$condicionMoneda = 'true';
		} else {
			$condicionMoneda = "c.idmon = $idmon";
		}

		// Conecta con la base de datos.
		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				t.*,
				(t.debitos - t.creditos) as saldo
			from
				(select
					c.*,
					e.nombre as nomemp,
					m.siglas as siglas,
					m.nombre as nommon,
					cl.nombre as nomcli,
					(select sum(db.monto) from cxcdet as db where db.idparent = c.id) as debitos,
					coalesce((select sum(cr.monto) from cxcpag as cr where cr.idparent = c.id), 0) as creditos
				from
					cxc as c
					left join empresas as e on e.id = c.idemp
					left join monedas as m on m.id = c.idmon
					left join clientes as cl on cl.id = c.idcli
				where
					$wherePagados and
					$whereEsp and
					$whereEmpresa and
					$condicionTipo and
					$condicionCliente and
					$condicionMoneda) as t
			order by
				t.idemp,
				t.siglas,
				t.nomcli,
				t.fecha";
	
		$result = $conn->Query($sqlCommand);
		
		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}
?>
