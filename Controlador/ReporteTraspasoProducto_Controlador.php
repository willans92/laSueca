<?php

include_once('../Libreria/variables.php');


if ($proceso === "traspasoDetallado") {
    $traspaso = new traspasoProducto($con);
    $resultado = $traspaso->buscarXFecha($de, $hasta);
}
if ($proceso === "inicializar") {
    $resultado = array();
    $almacen = new almacen($con);
    $marca = new marca($con);
    $resultado["almacen"] = $almacen->todo();
    
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







