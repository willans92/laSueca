<?php

include_once('../Libreria/variables.php');


if ($proceso === "reporteArqueo") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->reporteArqueo($de,$hasta,$empleado,$sucursal,$estado);
}
if ($proceso === "reporteCobrado") {
    $arqueo = new arqueo($con);
    $resultado = $arqueo->cobranzaSinArqueo($cobrador,$de,$hasta);
}




$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







