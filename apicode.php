<?php
	require_once __DIR__ . '/mysql-data-manager.php';

	define('__mysql_host', 'localhost');
	define('__mysql_prefix', '');
	define('__mysql_user', 'root');
	define('__mysql_pwd', 'admin');
	
	// Configuración de conexión a MySQL.
	function getMySqlDbInfo($dbname) {
		$dbInfo = array();
		$dbInfo['host'] = __mysql_host;
		$dbInfo['prefix'] = __mysql_prefix;
		$dbInfo['dbname'] = $dbname;
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
	 * Carga la configuracion.
	 */
	function configLoad() {
		if (!isset($_SESSION['user'])) {
			return getResultObject(false, 'Acceso denegado');
		}

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand = "select t.* from config as t where t.id = '1'";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si no existe el id lo agrega.
		if (count($cursor) == 0) {
			$sqlCommand =
				"insert into config (
					id, host, prefix, dbname, user, pwd)
				values (
					'1', '', '', '', '', '');";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$data['id'] = '1';
			$data['host'] = '';
			$data['prefix'] = '';
			$data['dbname'] = '';
			$data['user'] = '';
			$data['pwd'] = '';
		} else {
			$data = $cursor[0];
		}

		$conn->Close();

		return getResultObject(true, '', $data);
	}


	/**
	 * Guarda la configuracion.
	 */
	function configSave($jsonParams) {
		$host = $jsonParams['host'];
		$prefix = $jsonParams['prefix'];
		$dbname = $jsonParams['dbname'];
		$user = $jsonParams['user'];
		$pwd = $jsonParams['pwd'];

		// Calcula el hash del password.
		// $pwdHashed = hash("sha3-512", $pwd);

		$dbInfo = getMySqlDbInfo('cxc');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "update config set
				host = '$host',
				prefix = '$prefix',
				dbname = '$dbname',
				user = '$user',
				pwd = '$pwd'
			where
				id = '1'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro guardado con exito');
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
			$sqlCommand .= "where t.id = '$id'";
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
	 * Carga el detalle de un documento y sus abonos.
	 */
	function loadDetalleAbonos($jsonParams) {
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
?>
