<?php

include_once('../Libreria/variables.php');

if ($proceso === "cuentaxcobrarCliente") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->CuentaXCobrarXcliente($idcliente);
}
if ($proceso === "eliminarCobranza") {
    $cobranza = new cobranza($con);
    $detalleObj = new detalleCobranza($con);
    if($cobranza->eliminar($id_Cobranza)){
        if(!$detalleObj->eliminadoLogico($id_Cobranza)){
            $error="No se logro eliminar la cobranza. Intente nuevamente.";
        }
    }else{
        $error="No se logro eliminar la cobranza. Intente nuevamente.";
    }
}
if ($proceso === "registrarCobranza") {
    $con->transacion();
    $cobranza = new cobranza($con);
    $nroDoc = $cobranza->generarNroComprobante();
    $usuario = new usuario($con);
    $usuario = $usuario->buscarXid($cobrador);
    $sucursal_id = $usuario["sucursal_id"];
    $fechaactual = date("d/m/Y H:i:s");
    $hora = date("H:i:s");
    $cobranza->contructor($id_Cobranza, $nroDoc, $detalle, "$fecha $hora", $cobrador, $fechaactual, $sessionUsuario["id_usuario"], $sucursal_id, $metodopago,"activo");
    if ($id_Cobranza === "0") {
        if (!$cobranza->insertar()) {
            $error = "No se logro registrar la cobranza. Intente de nuevo";
        }
    } else {
        if (!$cobranza->modificar($id_Cobranza)) {
            $error = "No se logro modificar el registro de cobranza. Intente de nuevo";
        } else {
            $detalleObj = new detalleCobranza($con);
            if (!$detalleObj->eliminar($id_Cobranza)) {
                $error = "No se logro modificar el registro de cobranza. Intente de nuevo";
            }
        }
    }
    if ($error === "") {
        $detalleObj = new detalleCobranza($con);
        $detallePago=$_POST["detallePago"];
        for ($i = 0; $i < count($detallePago); $i++) {
            $detalleObj->contructor(0, $cobranza->id_cobranza, $detallePago[$i]["idventa"], $detallePago[$i]["monto"], "registro de pago de ".$detallePago[$i]["desc"],"activo");
            if (!$detalleObj->insertar()) {
                if ($id_Cobranza === "0") {
                    $error = "No se logro registrar la cobranza. Intente de nuevo";
                }else{
                    $error = "No se logro modificar el registro de cobranza. Intente de nuevo";
                }
                break;
            }
        }
    }
    if ($error === "") {
        $resultado=$cobranza->id_cobranza;
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "buscarCobranza") {
    $resultado = array();
    $cobranza = new cobranza($con);
    $detalleObj = new detalleCobranza($con);
    $resultado["cobranza"] = $cobranza->busquedaAccionXidCobranza($idcobranza,$tipo,$sessionUsuario["sucursal_id"]);
    $id_cobranza=$resultado["cobranza"]["id_cobranza"];
    $resultado["detalle"] = $detalleObj->buscarXidCobranza($id_cobranza);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







