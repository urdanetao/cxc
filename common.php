<?php
    /**
     * Definicion de funciones generales.
     */
    use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

    /**
     * Guarda un texto en el log.
     */
    function saveLog($text) {
        $file = fopen(__DIR__ . "/log.txt", "a");
        fwrite($file, $text . PHP_EOL);
        fclose($file);
    }

    /**
     * Convierte una fecha de excel a string yyyy-mm-dd.
     */
    function convertExcelDate($excelDate, $sep = '/') {
        $dateArray = explode($sep, $excelDate);
        if (count($dateArray) != 3) {
            return '';
        }
        $date =
            str_pad($dateArray[2], 4, '0', STR_PAD_LEFT) . '-' .
            str_pad($dateArray[1], 2, '0', STR_PAD_LEFT) . '-' .
            str_pad($dateArray[0], 2, '0', STR_PAD_LEFT);
        return $date;
    }

    //
    // generatePin
    // -----------
    // Genera un codigo de validacion aleatorio de 6 digitos donde el primero digito
    // nunca es cero (0).
    //
    function generatePin()
    {
        $pin =
        strval(rand(1, 9)) .
        strval(rand(0, 9)) .
        strval(rand(0, 9)) .
        strval(rand(0, 9)) .
        strval(rand(0, 9)) .
        strval(rand(0, 9));
        return $pin;
    }

    // 
    // Devuelve el nombre del mes.
    // 
    function getMonthName($month) {
        $monthName = '';
        $month = intval($month);
        switch ($month) {
            case 1:
                $monthName = 'ENERO';
                break;
            case 2:
                $monthName = 'FEBRERO';
                break;
            case 3:
                $monthName = 'MARZO';
                break;
            case 4:
                $monthName = 'ABRIL';
                break;
            case 5:
                $monthName = 'MAYO';
                break;
            case 6:
                $monthName = 'JUNIO';
                break;
            case 7:
                $monthName = 'JULIO';
                break;
            case 8:
                $monthName = 'AGOSTO';
                break;
            case 9:
                $monthName = 'SEPTIEMBRE';
                break;
            case 10:
                $monthName = 'OCTUBRE';
                break;
            case 11:
                $monthName = 'NOVIEMBRE';
                break;
            case 12:
                $monthName = 'DICIEMBRE';
                break;
        }

        return $monthName;
    }

    /**
     * Convierte una fecha con formato yyyy-mm-dd en dd-mm-yyyy.
     */
    function reverseDate($date) {
        $result = '';

        if (gettype($date) == 'string' && strlen($date) == 10) {
            $year = substr($date, 0, 4);
            $month = substr($date, 5, 2);
            $day = substr($date, 8, 2);
            $result = $day . '-' . $month . '-' . $year;
        }

        return $result;
    }


    /**
     * Trunca una cadena a un numero de caracteres incluyendo la terminacion '...'.
     */
    function truncateString($str, $maxLength, $setEllipsis = true) {
        if ($setEllipsis) {
            $str = substr($str, 0, $maxLength - 3);
            if (strlen($str) == $maxLength - 3) {
                $str .= '...';
            }
        } else {
            $str = substr($str, 0, $maxLength);
        }

        return $str;
    }

    /**
     * Calcula la diferencia de dias entre 2 fechas.
     */
    function getDaysBetween2Dates(DateTime $date1, DateTime $date2, $absolute = false) {
        $interval = $date2->diff($date1);
        return (!$absolute and $interval->invert) ? - $interval->days : $interval->days;
    }


    /**
     * Envia un correo electronico con un codigo de validacion.
     */
    function sendMail($template, $subject, $email, $nombre, $pinCode) {
		// Carga la plantilla de correo.
		$sent = false;
		$body = file_get_contents($template);

		// Establece el nombre del usuario y el codigo de validacion.
		$body = str_replace("{userName}", $nombre, $body);
		$body = str_replace("{pinCode}", $pinCode, $body);

		// Envia el correo electronico con el codigo de validacion.
		require_once __DIR__ . '/PHPMailer/PHPMailer.php';
		require_once __DIR__ . '/PHPMailer/SMTP.php';
		require_once __DIR__ . '/PHPMailer/Exception.php';

		$Mail = new PHPMailer();
		$Mail->IsSMTP();
		$Mail->Host        = 'mail.almacenadorasaiver.com';
		$Mail->SMTPAuth    = true;
		$Mail->SMTPSecure  = 'ssl';
		$Mail->Helo        = "smtp.almacenadorasaiver.com";
		$Mail->Port        = 465;
		$Mail->Username    = 'soporte@almacenadorasaiver.com';
		$Mail->Password    = '';
		$Mail->Priority    = 1;
		$Mail->CharSet     = 'UTF-8';
		$Mail->Encoding    = '8bit';
		$Mail->Subject     = $subject;
		$Mail->ContentType = 'text/html; charset=utf-8\r\n';
		$Mail->From        = 'soporte@almacenadorasaiver.com';
		$Mail->FromName    = "almacenadorasaiver.com";
		$Mail->AddAddress($email, $nombre);
		$Mail->isHTML(true);
		$Mail->Body = $body;

		if ($Mail->Send()) {
			$sent = true;
		}

		$Mail->SmtpClose();

		if ($sent) {
			return getResultObject(true, "Correo enviado con exito");
		}

		return getResultObject(false, "No se ha podido enviar el email, intente mas tarde");
	}


    //
    // Funcion inRange
    // Devuelve true si una cadena contiene solo caracteres dentro de un rango.
    //
    // Parametros:
    // $str: (string) Cadena a evaluar.
    // $leftTopChar: (string) Caracter de inicio del rango.
    // rightTopChar: (string) Caracter final del rango.
    //
    // Retorna true si todos los caracteres de la cadena $str se encuentran dento del rango, de
    // lo contrario retorna false.  Si $str no es de tipo string la funcion retorna false.
    //
    function inRange($str, $leftTopChar, $rightTopChar)
    {
        if (gettype($str) != "string") {
            return false;
        }

        $lTop = ord($leftTopChar);
        $rTop = ord($rightTopChar);

        for ($i = 0; $i < strlen($str); $i++) {

            $char = substr($str, $i, 1);

            if (ord($char) < $lTop || ord($char) > $rTop) {
                return false;
            }
        }

        return true;
    }

    /**
     * Remueve un caracter de una cadena.
     */
    function removeChar($str, $charToRemove) {
        $strResult = '';
        for ($i = 0; $i < strlen($str); $i++) {

            $char = substr($str, $i, 1);

            if ($char == $charToRemove) {
                continue;
            }
            $strResult .= $char;
        }
        return $strResult;
    }

    // 
    // Funcion normalizeBooleanInteger
    // Devuelve la normalizacion de una variable a '1' o '0'.
    // 
    // Parametros:
    // $data: (mixed) Variable con el valor a normalizar.
    // 
    // Retorna una cadena con '0' o '1' según el caso.
    // 
    function normalizeBooleanInteger($data) {
        if ((gettype($data) == 'boolean' && $data) ||
            (gettype($data) == 'integer' && $data == 1) ||
            (gettype($data) == 'string' && ($data == 'true' || $data == '1'))) {
            return '1';
        } else {
            return '0';
        }
    }

    // 
    // Procesa un arreglo para escapar caracteres especiales.
    // 
    function escapeChars($data) {
        $type = gettype($data);
        switch ($type) {
            case 'string':
                $data = addslashes($data);
                break;
            case 'array':
                foreach ($data as $k => $p) {
                    if (gettype($p) == 'string') {
                        $data[$k] = addslashes($p);
                    }
                }
                break;
        }
        return $data;
    }

    // 
    // Genera un id unico.
    // 
    function getUniqueId() {
        $strong = true;
        $bytes = openssl_random_pseudo_bytes(8, $strong);
        $hex = bin2hex($bytes);
        $first = substr($hex, 0, 4);
        $second = substr($hex, 4, 4);
        $rest = substr($hex, 8);
        $id = "$first-$second-$rest";
        return $id;
    }

    // 
    // Rellena una cadena con caracteres a la izquierda.
    // 
    function fillLeft($string, $char, $len) {
        while (strlen($string) < $len) {
            $string = $char . $string;
        }
        return $string;
    }
    
    //
    // Funcion getResultObject
    // Devuelve el objeto array de respuesta ajax.
    //
    // Parametros:
    // $status: (boolean) Resultado de la operacion, true => exitoso o false => ocurrio un error.
    // $message: (string) Cadena con la descripcion del resultado de la operacion.
    // data: Array asociativo con la respuesta del server.
    //
    // Retorna un array asociativo con la estructura {status, message, data}.
    //
    function getResultObject($status, $message, $data = array())
    {
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
?>
