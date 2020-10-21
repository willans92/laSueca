<?php

include_once('../Libreria/variables.php');

if ($proceso === "registrarAlmacen") {
    $estado = "";
    $almacen = new almacen($con);
    $fechaactual = date("d/m/Y h:i:s");
    $posicion=$posicion==""?"0":$posicion;
    if($generarCodigo==="1" && $id_almacen === "0"){
        $empresa=new empresa($con);
        $codigo=$empresa->generarCodigo("almacen");
        if ($codigo === -1) {
            $error = "No se logró registrar el producto.Intente nuevamente. COD.0x18";
        }
    }
    $almacen->contructor($id_almacen, $codigo, $nombre, $telefono, $direccion, $posicion, $tpestado,$fechaactual,$sessionUsuario["id_usuario"],$tpsucursal);
    if ($id_almacen === "0") {
        if (!$almacen->insertar()) {
            $error = "No se logro registrar el almacen.Intente nuevamente. COD.0x19";
        }
    } else {
        if (!$almacen->modificar()) {
            $error = "No se logro modificar el almacen.Intente nuevamente. COD.0x20";
        }
    }
}
if ($proceso === "buscarAlmacen") {
    $almacen = new almacen($con);
    $sucursal = new sucursal($con);
    $resultado=array();
    
    $resultado["almacen"] = $almacen->buscarXestado($estado);
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







