<?php

include_once('../Libreria/variables.php');

if ($proceso === "stockActual") {
    $resultado = array();
    $linea = new linea_producto($con);
    $marca = new marca($con);
    $producto= new producto($con);
    $resultado["marca"] = $marca->todo();
    $resultado["linea"] = $linea->todo();
    $resultado["stock"] = $producto->stockXsucursal($sucursal,false);
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







