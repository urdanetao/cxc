<?php
	require_once __DIR__ . '/mysql-data-manager.php';

	define('__mysql_host', 'localhost');
	define('__mysql_prefix', '');
	define('__mysql_user', 'root');
	define('__mysql_pwd', 'admin');
	
	// Configuración de conexión a MySQL.
	function getMySqlDbInfo($dbName) {
		$dbInfo = array();
		$dbInfo['host'] = __mysql_host;
		$dbInfo['prefix'] = __mysql_prefix;
		$dbInfo['dbname'] = $dbName;
		$dbInfo['user'] = __mysql_user;
		$dbInfo['pwd'] = __mysql_pwd;

		return $dbInfo;
	}

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
				monedas as t
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
		if ($conn->Query('start transaction;') === false) {
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
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
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
	 * Carga una empresa.
	 */
	function empresasLoad($jsonParams) {
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
				empresas as t
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
		if ($conn->Query('start transaction;') === false) {
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
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
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
		if ($conn->Query('start transaction;') === false) {
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
					id, nombre)
				values (
					'$id', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update clientes set
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
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
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
?>
