<?php
	/**
	 * Funcion para imprimir la cabecera de la pagina.
	 */
	function pdfMovimientosPeriodoPrintPageHeader($pdf, $params, $page) {
		// Nombre de la empresa.
		$pdf->SetFont('Arial', '', 10);
		$y = 10;
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, 'Almacenadora Saiver, C.A.', 0, 1, 'L');

		$pdf->SetFont('Arial', '', 7);

		// Pagina.
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, "Pagina: $page", 0, 1, 'R');

		// Direccion
		$y += 4;
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, 'CARRETERA VIA LA RAYA, LOCAL SIN NUMERO', 0, 1, 'L');

		// Fecha de emision.
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, "Fecha de Emision: " . date('d-m-Y'), 0, 1, 'R');

		// RIF.
		$y += 4;
		$pdf->SetXY(10, $y);
		$text = 'RIF: J-30677669-9';
		$pdf->Cell(0, 0, $text, 0, 1, 'L');

		// Titulo del reporte.
		$pdf->SetFont('Arial', 'B', 12);
		$y += 8;
		$pdf->SetXY(10, $y);
		$text = 'Reporte Movimientos por Periodo (DETALLADO)';
		$pdf->Cell(0, 0, utf8_decode($text), 0, 1, 'C');

        // Periodo
        $y += 4;
		$pdf->SetFont('Arial', '', 8);
		$pdf->SetXY(10, $y);
        $text = 'DESDE: ';
        if ($params['desde'] == '') {
            $text .= 'TODOS';
        } else {
            $text .= reverseDate($params['desde']);
        }
        $text .= ' - HASTA: ';
        if ($params['hasta'] == '') {
            $text .= 'TODOS';
        } else {
            $text .= reverseDate($params['hasta']);
        }
        $pdf->Cell(0, 0, 'PERIODO => ' . $text, 0, 0, 'C');

        // Empresa.
        $y += 4;
		$pdf->SetFont('Arial', '', 8);
		$pdf->SetXY(10, $y);
        $text = ($params['idemp'] == '0') ? 'TODAS LAS EMPRESAS' : $params['nomemp'];
        $pdf->Cell(0, 0, 'EMPRESA: ' . $text, 0, 0, 'C');
		
		// Tipo de transaccion y moneda.
        $y += 4;
		$pdf->SetFont('Arial', '', 8);
		$pdf->SetXY(10, $y);
        $text = 'TIPO TRANSACCION: ';
		$text .= ($params['tipo'] == '0') ? 'TODAS LAS TRANSACCIONES' : strtoupper($params['nomtipo']);
		$text .= ' / ';
        $text .= 'MONEDA: ';
		$text .= ($params['idmon'] == '0') ? 'TODAS LAS MONEDAS' : $params['siglas'];
        $pdf->Cell(0, 0, $text, 0, 0, 'C');
		
        // Cliente.
        $y += 4;
		$pdf->SetFont('Arial', '', 8);
		$pdf->SetXY(10, $y);
        $text = ($params['idcli'] == '') ? 'TODOS LOS CLIENTES' : $params['nomcli'];
        $text .= ' - INCL. ESPECIALES: ';
        if (normalizeBooleanInteger($params['esp']) == '0') {
            $text .= 'NO';
        } else {
            $text .= 'SI';
        }
        $pdf->Cell(0, 0, 'CLIENTE: ' . $text, 0, 0, 'C');

		return $y + 5;
	}

	/**
	 * Funcion para imprimir la cabecera de las columnas.
	 */
	function pdfMovimientosPeriodoPrintColumnHeader($pdf, $y) {
		$pdf->SetFont('Arial', '', 8);
		$pdf->SetFillColor(200, 200, 200);

		$x = 10;
		$cellWidth = 16;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'FECHA', 0, 0, 'L', true);
		
		$x += $cellWidth;
		$cellWidth = 18;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'TIPO', 0, 0, 'L', true);

		$x += $cellWidth;
		$cellWidth = 14;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'MONEDA', 0, 0, 'L', true);

		$x += $cellWidth;
		$cellWidth = 44;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'CLIENTE', 0, 0, 'L', true);

		$x += $cellWidth;
		$cellWidth = 84;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'DESCRIPCION', 0, 0, 'L', true);

		$x += $cellWidth;
		$cellWidth = 22;
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, 'MONTO', 0, 0, 'C', true);

		return $y + 5;
	}

	// 
	// Librerias.
	// 
	require_once __DIR__ . '/pdf/fpdf.php';
	require_once __DIR__ . "/common.php";
	require_once __DIR__ . "/apicode.php";

	// Toma los parametros.
	$params = $_SESSION['reportData'];
	$data = repMovimientosPeriodoDetallado($params);

	if (!$data['status']) {
		$pdf->AddPage();
		$pdf->SetFont('Arial', '', 14);
		$y = 100;
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, $data['message'], 0, 1, 'C');
		$pdf->Output();
		die();
	}

	$data = $data['data'];

	define("__max_items", 32);

	// Calcula el numero total de items.
	$totalItems = count($data);

	// Instancia el objeto para manejar el pdf.
	$pdf = new FPDF('P', 'mm', 'Letter');
	
	// Si no hay datos que mostrar.
	if ($totalItems == 0) {
		$pdf->AddPage();
		$pdf->SetFont('Arial', '', 14);
		$y = 100;
		$pdf->SetXY(10, $y);
		$pdf->Cell(0, 0, 'No hay datos para mostrar', 0, 1, 'C');
		$pdf->Output();
		die();
	}

	$k = 0;
	$page = 0;
	$leftMargin = 10;
	$idemp = '';

	// Mientras queden registros.
	while ($k < $totalItems) {
		// Si cambio la empresa.
		if ($idemp != $data[$k]['idemp']) {
			$idemp = $data[$k]['idemp'];
			
			// Agrega una nueva pagina.
			$pdf->AddPage();
			$pdf->SetFont('Arial', '', 8);
			$page++;
			
			// Imprime la cabecera de la pagina.
			$y = pdfMovimientosPeriodoPrintPageHeader($pdf, $params, $page);

			// Imprime la empresa.
			$x = $leftMargin;
			$cellWidth = 20;
			$pdf->SetXY($x, $y);
			$text = $data[$k]['nomemp'];
			$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');

			$y += 4;
		}

		// Imprime la cabecera de las columnas.
		$y = pdfMovimientosPeriodoPrintColumnHeader($pdf, $y);

		// Mientras queden registros y sea la misma moneda.
		$idmon = $data[$k]['idmon'];
		$siglas = $data[$k]['siglas'];
		$totalMoneda = 0;
		while ($k < $totalItems && $idmon == $data[$k]['idmon']) {
			// Mientras queden registros y sea el mismo cliente.
			$idcli = $data[$k]['idcli'];
			$nomcli = $data[$k]['nomcli'];
			$totalCliente = 0;
			while ($k < $totalItems && $idmon == $data[$k]['idmon'] && $idcli == $data[$k]['idcli']) {
				$pdf->SetFont('Arial', '', 8);
	
				// Fecha.
				$x = 10;
				$cellWidth = 16;
				$pdf->SetXY($x, $y);
				$text = reverseDate($data[$k]['fecha']);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');
	
				// Tipo.
				$x += $cellWidth;
				$cellWidth = 18;
				switch ($data[$k]['tipo']) {
					case '1':
						$text = 'PERSONAL';
						break;
					case '2':
						$text = 'COMERCIAL';
						break;
					default:
						$text = '---';
						break;
				}
				$pdf->SetXY($x, $y);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');
	
				// Moneda.
				$x += $cellWidth;
				$cellWidth = 14;
				$text = $data[$k]['siglas'];
				$pdf->SetXY($x, $y);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'C');
	
				// Cliente.
				$x += $cellWidth;
				$cellWidth = 44;
				$text = truncateString($data[$k]['nomcli'], 25);
				$pdf->SetXY($x, $y);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');
	
				// Descripcion.
				$x += $cellWidth;
				$cellWidth = 84;
				$text = truncateString($data[$k]['descrip'], 35);
				$pdf->SetXY($x, $y);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');
	
				// Monto.
				$x += $cellWidth;
				$cellWidth = 22;
				$text = number_format($data[$k]['monto'], 2, '.', ',');
				$pdf->SetXY($x, $y);
				$pdf->Cell($cellWidth, 4, $text, 0, 0, 'R');
	
				$totalCliente += floatval($data[$k]['monto']); 
				$totalMoneda += floatval($data[$k]['monto']);

				$y += 4;
				$k++;

				if ($y > 230) {
					// Agrega una nueva pagina.
					$pdf->AddPage();
					$pdf->SetFont('Arial', '', 8);
					$page++;
					
					// Imprime la cabecera de la pagina.
					$y = pdfMovimientosPeriodoPrintPageHeader($pdf, $params, $page);

					// Imprime la empresa.
					$x = $leftMargin;
					$cellWidth = 20;
					$pdf->SetXY($x, $y);
					$text = $data[$k]['nomemp'];
					$pdf->Cell($cellWidth, 4, $text, 0, 0, 'L');

					$y += 4;

					// Imprime la cabecera de las columnas.
					$y = pdfMovimientosPeriodoPrintColumnHeader($pdf, $y);
				}
			}

			// Imprime el total del cliente.
			$x = $leftMargin + 16 + 18 + 14 + 34 + 50 + 22 + 22;
			$y++;
			$cellWidth = 22;
			$pdf->SetXY($x, $y);
			$pdf->Line($x, $y, $x + $cellWidth, $y);
			$y++;
	
			$pdf->SetFont('Arial', 'B', 8);
			$x = $leftMargin + 16 + 18 + 14 + 34;
			$cellWidth = 94;
			$text = "TOTAL $nomcli $siglas";
			$pdf->SetXY($x, $y);
			$pdf->Cell($cellWidth, 4, $text, 0, 0, 'R');
	
			$x += $cellWidth;
			$cellWidth = 22;
			$text = number_format($totalCliente, 2, '.', ',');
			$pdf->SetXY($x, $y);
			$pdf->Cell($cellWidth, 4, $text, 0, 0, 'R', true);
	
			$y += 6;
		}

		// Imprime el total de la moneda.
		$x = $leftMargin + 16 + 18 + 14 + 34 + 50 + 22 + 22;
		$y++;
		$cellWidth = 22;
		$pdf->SetXY($x, $y);
		$pdf->Line($x, $y, $x + $cellWidth, $y);
		$y++;

		$x = $leftMargin + 16 + 18 + 14 + 34 + 50;
		$cellWidth = 44;
		$text = "TOTAL $siglas";
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, $text, 0, 0, 'R');

		$x += $cellWidth;
		$cellWidth = 22;
		$text = number_format($totalMoneda, 2, '.', ',');
		$pdf->SetXY($x, $y);
		$pdf->Cell($cellWidth, 4, $text, 0, 0, 'R', true);

		$y += 8;
	}

	$pdf->Output();
?>
