<?php

include_once('../Libreria/variables.php');


if ($proceso === "reporteCobranza") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteCobranza($tipo, $de, $hasta);
}
if ($proceso === "reporteDetallado") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteCobranzaDetallada($de, $hasta);
}
if ($proceso === "reporteCobrador") {
   $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteCobranzaXCobrador($de, $hasta,$empleado);
}
if ($proceso === "reporteCliente") {
   $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteCobranzaXCliente($de, $hasta,$cliente);
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







