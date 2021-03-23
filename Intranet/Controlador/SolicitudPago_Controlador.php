<?php

include_once('../Libreria/variables.php');


if ($proceso === "iniciar") {
    $tienda = new tienda($con);
    $resultado = $tienda->todo();
}
if ($proceso === "solicitudPago") {
    $solicitud = new solicitudComision($con);
    $resultado = $solicitud->buscarSolicitudes($estado, $tienda, $de, $hasta);
}
if ($proceso === "registrarPago") {
    $con->transacion();
    $solicitud = new solicitudComision($con);
    $fechaActualizado= date("d/m/Y H:i:s");
    if(!$solicitud->cambioEstado($id_solicitud,$fechaP,$nroDoc,"pagado",$fechaActualizado,$sessionUsuario["id_usuario"])){
        $error="No se logro registrar el pago.";
    }else{
        $detalle=new detalleSolicitudComision($con);
        if(!$detalle->cambioEstado($id_solicitud,'pagado')){
            $error="No se logro registrar el pago.";
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "cancelarSolicitud") {
    $con->transacion();
    $solicitud = new solicitudComision($con);
    $fechaActualizado= date("d/m/Y H:i:s");
    if(!$solicitud->cambioEstado($id_solicitud,'','',"cancelado",$fechaActualizado,$sessionUsuario["id_usuario"])){
        $error="No se logro registrar el pago.";
    }else{
        $detalle=new detalleSolicitudComision($con);
        if(!$detalle->cambioEstado($id_solicitud,'cancelado')){
            $error="No se logro registrar el pago.";
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







