<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Required meta tags. -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="CodigoWeb.net - Casa de Software">
    <meta name="author" content="Oscar Urdaneta">

    <!-- Evita el cache (Solo para Produccion) -->
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">

    <!-- Hojas de estilos. -->
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/iziToast.min.css">
    <link rel="stylesheet" type="text/css" href="./css/icons.css">
    <link rel="stylesheet" type="text/css" href="./css/common.css">
    <link rel="stylesheet" type="text/css" href="./css/core.css">

    <link rel="icon" href="#">
    <title translate="no">Saiver - Módulo CxC</title>

    <!-- Javascript. -->
    <script type="text/javascript" src="./js/jquery-3.5.1.min.js"></script>
    <script type="text/javascript" src="./js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="./js/iziToast.min.js"></script>
    <script type="text/javascript" src="./js/uuid.min.js"></script>
    <script type="text/javascript" src="./js/qrcode.js"></script>
    <script type="text/javascript" src="./js/chart.min.js"></script>
</head>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/index.css'; ?>
</style>

<body>

    <!-- Core. -->
    <script>
        <?php include __DIR__ . '/js/core.js'; ?>
        var core = new Core();
    </script>

    <!-- Cuerpo principal. -->
    <div class="indexBody">
        <?php
            if (isset($_SESSION['user'])) {
                // Si el usuario no tiene mail registrado.
                if ($_SESSION['user']['email'] == '') {
                    include __DIR__ . '/set-email.php';
                }

                // Si el usuario tiene un password temporal.
                elseif ($_SESSION['user']['chpwd'] == '1') {

                }
                
                // Si todo ok.
                else {
                    include __DIR__ . '/engine.php';
                }
            } else {
                include __DIR__ . '/home.php';
            }
        ?>
    </div>
</body>
</html>
