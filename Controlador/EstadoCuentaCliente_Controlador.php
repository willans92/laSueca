<?php

include_once('../Libreria/variables.php');

if ($proceso === "cuentaxcobrarCliente") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->estadoCuentaCliente($idcliente);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







