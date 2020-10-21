<?php

include_once('../Libreria/variables.php');



if ($proceso === "cuentaXcobrar") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->buscarCuentaXCobrar($buscador,$cantidad,$contador);
}
if ($proceso === "detalleCobranza") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->detalleCobranzaXVenta($idventa);
}
if ($proceso === "registrarCobranza") {
    $con->transacion();
    $cobranza = new cobranza($con);
    $nroDoc=$cobranza->generarNroComprobante();
    $usuario=new usuario($con);
    $usuario=$usuario->buscarXid($cobrador);
    $sucursal_id=$usuario["sucursal_id"];
    $fechaactual = date("d/m/Y H:i:s");
    $hora = date("H:i:s");
    $cobranza->contructor(0, $nroDoc,"Cobrado en Cuentas por Cobrar" , "$fecha $hora", $cobrador, $fechaactual, $sessionUsuario["id_usuario"], $sucursal_id,$metodopago,"activo");
    if (!$cobranza->insertar()) {
        $error = "No se logro registrar la cobranza. Intente de nuevo";
    }else{
        $detalle= new detalleCobranza($con);
        $detalle->contructor(0, $cobranza->id_cobranza, $idventa, $monto, $comentario,"activo");
        if (!$detalle->insertar()) {
            $error = "No se logro registrar la cobranza. Intente de nuevo";
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = array();
        $detalleObj = new detalleCobranza($con);
        $resultado["cobranza"] = $cobranza;
        $id_cobranza=$cobranza->id_cobranza;
        $resultado["detalle"] = $detalleObj->buscarXidCobranza($id_cobranza);
    
    
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







