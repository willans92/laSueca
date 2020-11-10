<?php

include_once('../Libreria/variables.php');

if ($proceso === "deudaClientes") {
    $cobranza = new cobranza($con);
    $resultado = $cobranza->deudaCliente();
}
if ($proceso === "historicoVenta") {
    $venta = new venta($con);
    if($tipo==="Venta"){
        $resultado = $venta->ventaXCliente($idcliente);
    }
    if($tipo==="Prestamo"){
        $resultado = $venta->ventaXCliente($idcliente);
    }
}
if ($proceso === "registrar") {
    $con->transacion();
    $limitecredito=$limitecredito==""?0:$limitecredito;
    $descuento=$descuento===""?0:$descuento;
    $descmax=$descmax===""?0:$descmax;
    $cliente = new cliente($con);
    $cliente->contructor($id_cliente, $codigo, $ci, $nombre, $telefono, $direccion, $foto, $descuento, $nit, $rz, $descmax, $telefonocontacto, $personacontacto, $limitecredito, $correo, $fechanacimiento, $comentario);
    $estado="modificar";
    if ($cliente_id === "0") {
        $estado="registrar";
        if (!$cliente->insertar()) {
            $error = "No se logro registrar al cliente.";
        } else {
            $cliente_id = $cliente->id_cliente;
        }
    } else {
        if (!$cliente->modificar($cliente_id)) {
            $error = "No se logro modificar al cliente.";
        }
    }
    if ($error === "") {
        $version = new version($con);
        $ultVersion = $cliente->ultimaVersion();
        $version->contructor(0, "cliente", $ultVersion, $cliente_id);
        if (!$version->insertar()) {
            $error = "No se logro $estado el cliente.Intente nuevamente.";
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "registrarCobranza") {
    $con->transacion();
    $cobranza = new cobranza($con);
    $nroDoc=$cobranza->generarNroComprobante();
    $usuario=new usuario($con);
    $usuario=$usuario->buscarXid($cobrador);
    $sucursal_id=$usuario["sucursal_id"];
    $fechaactual = date("d/m/Y H:i:s");
    $cobranza->contructor(0, $nroDoc, "Cobranza de Listado de cliente", $fecha, $cobrador, $fechaactual, $sessionUsuario["id_usuario"], $sucursal_id,$metodopago,'activo');
    if (!$cobranza->insertar()) {
        $error = "No se logro registrar la cobranza. Intente de nuevo";
    }else{
        $detalle= new detalleCobranza($con);
        $detalle->contructor(0, $cobranza->id_cobranza, $idventa, $monto, $comentario,'activo');
        if (!$detalle->insertar()) {
            $error = "No se logro registrar la cobranza. Intente de nuevo";
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







