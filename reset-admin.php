<?php
	require_once __DIR__ . '/apicode.php';

    // Calcula el hash de la clave.
    $clave = hash("sha3-512", 'admin');

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

    // Valida si existe el usuario 'admin'.
	$sqlCommand = "select usuarios.* from usuarios where usuarios.nickname = 'admin'";
	$cursor = $conn->Query($sqlCommand);

    if ($cursor === false) {
        $msg = $conn->GetErrorMessage();
        $conn->Query("rollback");
        $conn->Close();
        echo($msg);
        die();
    }

    // Si el usuario 'admin' no existe.
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
            $id = intval($cursor['id']) + 1;
        }

        // Inserta el registro del usuario 'admin'.
		$sqlCommand =
			"insert into usuarios (
                id, nickname, nombre, pwd,
				email, chpwd)
			values (
				'$id', 'admin', 'OSCAR URDANETA', '$clave',
				'oscarenriqueurdaneta@gmail.com', '0')";
	} else {
		$sqlCommand =
			"update usuarios set
                pwd = '$clave'
            where
                nickname = 'admin'";
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
