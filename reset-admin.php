<?php
    // Constantes.
    define('__nickname', 'admin');
    define('__nombre', 'OSCAR URDANETA');
    define('__pwd', '12345');

	require_once __DIR__ . '/common.php';
	require_once __DIR__ . '/apicode.php';

    // Calcula el hash de la clave.
    $pwdHashed = hash("sha3-512", __pwd);

    // Conecta con la base de datos.
	$dbInfo = getMySqlDbInfo('cxc');
	$conn = new MySqlDataManager($dbInfo);

	if (!$conn->IsConnected()) {
		echo($conn->GetErrorMessage());
        die();
	}

    // Inicia una transaccion.
    $sqlCommand = "start transaction read write;";
    if ($conn->Query($sqlCommand) === false) {
        $msg = $conn->GetErrorMessage();
        $conn->Close();
        echo($msg);
        die();
    }

    // Valida si existe el usuario.
    $nickname = __nickname;
    $nombre = __nombre;
	$sqlCommand = "select usuarios.* from usuarios where usuarios.nickname = '$nickname'";
	$cursor = $conn->Query($sqlCommand);

    if ($cursor === false) {
        $msg = $conn->GetErrorMessage();
        $conn->Query("rollback");
        $conn->Close();
        echo($msg);
        die();
    }

    // Si el usuario no existe.
	if (count($cursor) == 0) {
        // Busca el siguiente correlativo.
        $sqlCommand = "select t.* from usuarios as t order by t.id desc limit 1";
        $cursor = $conn->Query($sqlCommand);

        if ($cursor === false) {
            $msg = $conn->GetErrorMessage();
            $conn->Query("rollback");
            $conn->Close();
            echo($msg);
            die();
        }

        if (count($cursor) == 0) {
            $id = 1;
        } else {
            $id = intval($cursor[0]['id']) + 1;
        }

        // Inserta el registro del usuario.
		$sqlCommand =
			"insert into usuarios (
                id, nickname, nombre, pwd,
				email, chpwd)
			values (
				'$id', '$nickname', '$nombre', '$pwdHashed',
				'', '1')";
	} else {
		$sqlCommand =
			"update usuarios set
                nombre = '$nombre',
                pwd = '$pwdHashed',
                email = '',
                chpwd = '1'
            where
                nickname = '$nickname'";
	}

    // Ejecuta la consulta.
    if ($conn->Query($sqlCommand) === false) {
        $msg = $conn->GetErrorMessage();
        $conn->Query("rollback");
        $conn->Close();
        echo($msg);
        die();
    }

    // Realiza el commit.
    $sqlCommand = "commit";
    if ($conn->Query($sqlCommand) === false) {
        $msg = $conn->GetErrorMessage();
        $conn->Close();
        echo($msg);
        die();
    }

    // Termina la conexion.
	$conn->Close();

    echo('Completado con exito!')
?>
