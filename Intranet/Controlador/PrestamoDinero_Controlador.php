<?php

include_once('../Libreria/variables.php');



if ($proceso === "imprimirVenta") {
    $venta = new venta($con);
    $detalle = new detalleventa($con);
    $sucursal = new Sucursal($con);
    $resultado = array();
    $resultado["venta"] = $venta->buscarXid($idven);
    $resultado["detalle"] = $detalle->buscarXid($idven);
    $resultado["sucursal"] = $sucursal->buscarXid($resultado["venta"]["sucursal_id"]);
}
if ($proceso === "registrarPrestamo") {
    $con->transacion();
    $prestamo = new Prestamo($con);
    $horaactual = date("H:i:s");
    $fechaactual = date("d/m/Y H:i:s");
    $prestamo->contructor($id_Prestamo, $detalle, "$fecha $horaactual", $fechaactual, "activo",
            $nroDocumento, $entrega, $capital, $nroCuotas, $tasaAnual, $desenbolso,
            $nroDesenbolso, $encargado, $sessionUsuario["id_usuario"], $id_Cliente
            , $sucursal, $con->$empresa_id, $gastoAdministrativos, $primerCuota);
    if ($id_Prestamo === "0") {
        $nroDocumento = $prestamo->obtenerNroDocumento();
        $prestamo->nroDocumento = $nroDocumento;
        if (!$prestamo->insertar()) {
            $error = "No se logro generar el prestamo. Intente nuevamente";
        } else {
            $id_Prestamo = $prestamo->id_prestamo;
            $listadoCuota = $_POST["listaCuota"];
            for ($i = 0; $i < count($listadoCuota); $i++) {
                $plan = $listadoCuota[$i];
                $planpago = new planPrestamo($con);
                $planpago->contructor($plan["id"], $plan["detalle"], $plan["vencimiento"]
                        , $plan["vencimiento"], $plan["cuota"], $plan["cuota"], $plan["capital"]
                        , $plan["capitalVivo"], $plan["interes"], $plan["gastoAdm"], "activo", $id_Prestamo);
                if (!$planpago->insertar()) {
                    $error = "No se logro registar el plan del prestamo. Intente nuevamente";
                    break;
                }
            }
        }
    } else {
        if (!$prestamo->modificar()) {
            $error = "No se logro modificar el prestamo. Intente nuevamente";
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = $id_Venta;
    } else {
        $con->rollback();
    }
}
if ($proceso === "buscarPrestamo") {
    $resultado = array();
    $prestamo = new Prestamo($con);
    $planpago = new planPrestamo($con);
    $resultado["prestamo"] = $prestamo->busquedaAccionXidPrestamo($id_Prestamo, $tipo, $idsucursal);
    $resultado["detalle"] = $planpago->buscarXidPrestamo($resultado["prestamo"]["id_prestamo"]);
    $cliente = new Cliente($con);
    $idCliente = $resultado["prestamo"]["cliente_id"];
    $resultado["clienteV"] = -1;
    if ($cliente->existeVersion($idCliente, $con->empresa_id, "cliente") === "0") {
        $resultado["clienteV"] = $cliente->buscarXid($idCliente);
        $version = new version($con);
        $ultVersion = $cliente->ultimaVersion();
        $version->contructor(0, "cliente", $ultVersion, $idCliente);
        if (!$version->insertar()) {
            $error = "No se logro traer la información, Problema en el version del cliente.Intente nuevamente.";
        }
    }
}
if ($proceso === "anularPrestamo") {
    $resultado = array();

    /*$detalle = new detalleCobranza($con); para anular revisar no haya cobranza
    $cantCobranza = $detalle->buscarXidVenta($id_Prestamo);
    if (count($cantCobranza) > 0) {
        $error = "La venta tiene cobranzas. Para anular la factura elimine las cobranzas primero.";
    }*/
    
    if ($error === "") {
        $prestamo = new Prestamo($con);
        $planpago = new planPrestamo($con);
        $fechaactual = date("d/m/Y H:i:s");
        $con->transacion();
        if (!$prestamo->anularPrestamo($id_Prestamo, $fechaactual,$sessionUsuario["id_usuario"])) {
            $error = "No se logro anular el prestamo.Intente nuevamente.";
        } else {
            if (!$planpago->anularPrestamo($id_Prestamo)) {
                $error = "No se logro anular la factura.Intente nuevamente.";
            }
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = $id_Prestamo;
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







