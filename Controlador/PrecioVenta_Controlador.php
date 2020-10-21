<?php

include_once('../Libreria/variables.php');

if ($proceso === "stockActual") {
    $producto= new producto($con);
    $resultado = array();
    $linea = new linea_producto($con);
    $marca = new marca($con);
    $resultado["marca"] = $marca->todo();
    $resultado["linea"] = $linea->todo();
    $resultado["stock"] = $producto->stockXsucursal("0", false);
}
if ($proceso === "registrarPrecio") {
    $precio= new precioVenta($con);
    $fechaactual = date("d/m/Y");
    $precio->contructor(0, $venta, $fechaactual, $idproducto, $sessionUsuario["id_usuario"]);
    if(!$precio->insertar()){
        $error='No se logró registrar el precio de venta. Intente nuevamente. COD.0x33';
    }
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







