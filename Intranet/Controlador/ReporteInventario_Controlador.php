<?php

include_once('../Libreria/variables.php');


if ($proceso === "reporteInventario") {
     $almacen = new almacen($con);
    $resultado = $almacen->reporteInventario($almacen_id, $de, $hasta);
}
if ($proceso === "inicializar") {
    $resultado = array();
    $linea = new linea_producto($con);
    $marca = new marca($con);
    $almacen = new almacen($con);
    $resultado["marca"] = $marca->todo();
    $resultado["linea"] = $linea->todo();
    if($todo==="1"){
        $resultado["almacen"] = $almacen->todo();
    }else{
        $resultado["almacen"] = $almacen->buscarXsucursal($sessionUsuario["sucursal_id"]);
    }
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







