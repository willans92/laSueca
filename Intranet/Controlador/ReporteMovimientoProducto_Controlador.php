<?php

include_once('../Libreria/variables.php');

if ($proceso === "inicializar") {
    $almacen= new almacen($con);
    $resultado = array();
    if($todo==="1"){
        $resultado["almacen"] = $almacen->todo();
    }else{
        $resultado["almacen"] = $almacen->buscarXsucursal($sessionUsuario["sucursal_id"]);
    }
}
if ($proceso === "historicoProducto") {
    $producto= new producto($con);
    $resultado = $producto->historicoProducto($idproducto, $de, $hasta);
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







