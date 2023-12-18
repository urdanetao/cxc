<?php
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
?>
