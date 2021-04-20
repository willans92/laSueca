<?php

include_once('../Libreria/variables.php');


if ($proceso === "reporteCobranza") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteCobranza($tipo, $de, $hasta);
}




$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







