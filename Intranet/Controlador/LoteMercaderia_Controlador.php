<?php

include_once('../Libreria/variables.php');


if ($proceso === "buscarLote") {
    $lote = new lotemercaderia($con);
    $resultado = $lote->buscarLotes($estado);
}
if ($proceso === "BuscarRegistroHistoricoLote") {
    $lote = new lotemercaderia($con);
    $resultado = $lote->buscarXidDetalleCompra($id_detalleCompra);
}
if ($proceso === "cambiarLote") {
    $con->transacion();
    $lote = new lotemercaderia($con);
    $loteAntiguo=$lote->buscarXid($idLote);
    $fechaactual = date("d/m/Y H:i:s");
    $lote->contructor(0, $codigoLote, $vencimiento, "activo", $loteAntiguo["cantidad"], $fechaactual,  $sessionUsuario["id_usuario"], $sessionUsuario["id_usuario"], $fechaactual, $loteAntiguo["detallecompra_id"]);
    if(!$lote->insertar()){
        $error = "No se logro registrar el cambio. Intente Nuevamente";
    }else{
        if(!$lote->cambiarLote($idLote,$fechaactual,$sessionUsuario["id_usuario"])){
            $error = "No se logro registrar el cambio. Intente Nuevamente";
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}




$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







