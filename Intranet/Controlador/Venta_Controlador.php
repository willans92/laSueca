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
if ($proceso === "buscarCobranza") {
    $cobranza = new cobranza($con);
    $detalle = new detalleCobranza($con);
    $resultado = array();
    $resultado["cobranza"] = $cobranza->buscarXidVenta($idventa);
    $resultado["detalle"] = $detalle->buscarXidCobranza( $resultado["cobranza"]["id_cobranza"]);
}
if ($proceso === "buscarProducto") {
    $producto = new producto($con);
    $lote = new lotemercaderia($con);
    $resultado = array();
    $resultado["producto"] = $producto->stockXsucursal($idsucursal,false);
    $resultado["lote"] = $lote->lotesConStock($idsucursal);
}
if ($proceso === "registrarVenta") {
    $con->transacion();
    $sucursalObj = new Sucursal($con);
    $autorizacion = "";
    $codigoControl = "";
    $fechaLimiteEmision = "";
    $mensajeImpuesto = "";
    $actividadEconomica = "";
    $venta = new venta($con);
    if ($nit === "") {
        $nit = "";
    }
    if ($nombre === "") {
        $nombre = "Sin Nombre";
    }
    if ($tipoDocumento === 'Factura') {
        $dosificacionObj = new DosificacionSucursal($con);
        $dosif = $dosificacionObj->buscarXFechaSucursal($sucursal, $fecha);
        if (count($dosif) === 0) {
            $error = "La Dosificacion de la sucursal se encuentra vencida. ";
        } else {
            $autorizacion = $dosif[0]["nroAutorizacion"];
            $llavedosificacion = $dosif[0]["LlaveDosificacion"];
            $fechaLimiteEmision = $dosif[0]["fechaLimiteEmision"];
            $mensajeImpuesto = $dosif[0]["mensajeImpuesto"];
            $actividadEconomica = $dosif[0]["actividadEconomica"];
            if ($id_Venta === "0" || $tipoDocumento2 === "Nota de Venta") {// aqui ver para modificar la nota de venta a factura
                $nroDocumento = $venta->generarNroFactura($sucursal, $autorizacion, $fecha);
                if ($nroDocumento === "0") {
                    $error = "No puede generar una factura en esa fecha porque ya se han realizado ventas en fechas poseteriores a lo marcado. ";
                }
            }
            if ($error == "") {
                list($dia, $mes, $ano) = explode('/', $fecha);
                $controlCode = new ControlCode();
                try {
                    $codigoControl = $controlCode->generate($autorizacion, "$nroDocumento", trim($nit), "$ano$mes$dia", "$totalFacturado", $llavedosificacion);
                } catch (Exception $exc) {
                    $error = "Su Dosificación afiliada a la sucursal se encuentra con datos erroneos.";
                }
            }
        }
    }
    if ($id_Venta == "0") {
        $nroVenta = $venta->generarNroDocumento($sucursal);
    }
    if ($tipoDocumento !== 'Factura') {
        $nroDocumento = 0;
    }
    if ($error === "") {
        $venta = new venta($con);
        $fechaactual = date("d/m/Y H:i:s");
        $horaactual = date("H:i:s");
        $cliente = new cliente($con);
        if (!$cliente->modificarDatosFacturacion($id_Cliente, $nit, $nombre)) {
            $error = "No se logro registrar. Intente nuevamente.";
        } else {
            $version = new version($con);
            $ultVersion = $cliente->ultimaVersion();
            $version->contructor(0, "cliente", $ultVersion, $id_Cliente);
            if (!$version->insertar()) {
                $error = "No se logro registrar. Intente nuevamente.";
            }
        }
        $venta->contructor($id_Venta, $detalle, $tipoVenta, "$fecha $horaactual", $vendedor, $fechaactual, $nit, $nombre
                , $autorizacion, $codigoControl, 'activo', $id_Cliente, $sucursal, $tipoPago, $nroDocumento, $fechaLimiteEmision, $mensajeImpuesto
                , $actividadEconomica, $estadoentrega, $fechaEntrega, $entregaDireccion, $Comentario, $tipoDocumento, $nroVenta,$sessionUsuario["id_usuario"]);
        if ($id_Venta === "0") {
            if (!$venta->insertar()) {
                $error = "No se logro registrar la venta. Intente Nuevamente ";
            } else {
                $id_Venta = $venta->id_venta;

                // valido no exeda limite
                $cobranza = new cobranza($con);
                $resultado = $cobranza->deudaCliente($id_Cliente);
                if (count($resultado) > 0) {
                    $deuda = floatval($resultado[0]["deuda"]);
                    $pagado = floatval($resultado[0]["pagado"]);
                    $deuda = $deuda - $pagado;
                    $limite = floatval($resultado[0]["limiteCredito"]);
                    $montoCobrado = floatval($montoCobrado);
                    $montoFacturado = floatval($totalFacturado);
                    $saldoDeuda = $montoFacturado - $montoCobrado;
                    if ($saldoDeuda < 0.01) {
                        $saldoDeuda = 0;
                        $montoCobrado = $montoFacturado;
                    }
                    if ($limite - $deuda - $saldoDeuda < 0) {
                        $saldo = $limite - $deuda;
                        $error = "El cliente esta al limite de capacidad, con una deuda de $deuda Bs y solo tiene disponible de credito para usar $saldo Bs.";
                    }
                }
                if (floatval($montoCobrado) > 0) {
                    $cobranza = new cobranza($con);
                    $nroDoc = $cobranza->generarNroComprobante();
                    $usuario = new usuario($con);
                    $usuario = $usuario->buscarXid($cobrador);
                    $sucursal_id = $usuario["sucursal_id"];
                    $cobranza->contructor(0, $nroDoc, "Cobranza", $fechaactual, $cobrador, $fechaactual, $sessionUsuario["id_usuario"], $sucursal_id, $tipoPago,'activo');
                    if (!$cobranza->insertar()) {
                        $error = "No se logro registrar la cobranza. Intente de nuevo";
                    } else {
                        $detalle = new detalleCobranza($con);
                        $detalle->contructor(0, $cobranza->id_cobranza, $id_Venta, $montoCobrado, "Se cobro al realizar la venta",'activo');
                        if (!$detalle->insertar()) {
                            $error = "No se logro registrar la cobranza. Intente de nuevo";
                        }
                    }
                }
            }
        } else {
            if (!$venta->modificar($id_Venta)) {
                $error = "No se logro modificar la venta";
            } else {
                $detalle = new detalleCobranza($con);
                $cantCobranza = $detalle->buscarXidVenta($id_Venta);
                if (count($cantCobranza) > 0) {
                    $error = "La venta tiene cobranzas. Para modificar la factura elimine las cobranzas primero.";
                } else {
                    $detalleVenta = new detalleventa($con);
                    if (!$detalleVenta->eliminar($id_Venta)) {
                        $error = "No se logro modificar la venta";
                    }
                }
            }
        }
        if ($error === "") {
            $listaVenta = $_POST["listaVenta"];
            $repetir=false;
            for ($i = 0; $i < count($listaVenta); $i++) {
                $item = $listaVenta[$i];
                $iddetalle = $item["idDetalle"];
                $cant = (int) ($item["cant"]);
                $historico = (int) ($item["historico"]);
                $desc = floatval($item["descuento"]);
                $precio = floatval($item["precio"]);
                $detallecompra = new detalleCompra($con);
                if($repetir){// si tiene activado stock negativo
                    $repetir=false;
                }else{
                    $listaEnlace = $detallecompra->buscarEnlaceParaVenta($item["id"], $sucursal, $iddetalle);
                }
                if ($iddetalle !== "0") {
                    $listaEnlace[0]["cantidad"] = (int) ($listaEnlace[0]["cantidad"]) + $historico;
                }
                for ($j = 0; $j < count($listaEnlace) && $cant > 0; $j++) {
                    $enlace = $listaEnlace[$j];
                    $cantidadEnlace = floatval($enlace["cantidad"]);
                    $id_detallecompra = $enlace["id_detallecompra"];
                    $almacen_id = $enlace["almacen_id"];
                    $cantAux = 0;
                    if ($cant > $cantidadEnlace) {
                        $cant -= $cantidadEnlace;
                        $cantAux = $cantidadEnlace;
                    } else {
                        $cantAux = $cant;
                        $cant = 0;
                    }
                    $preciototal = ($precio * $cantAux)-$desc;
                    $detalleVenta = new detalleventa($con);
                    $detalleVenta->contructor(0, $item["id"], $cantAux, $precio, $almacen_id, $id_detallecompra, $desc, $preciototal, $id_Venta,'activo',"$fecha $horaactual");
                    if (!$detalleVenta->insertar()) {
                        $error = "No se logro registrar la venta. Intente Nuevamente ";
                        break;
                    }
                }
                if ($cant > 0) {
                    $datosEmpresa = new empresa($con);
                    $permiso=$datosEmpresa->tieneConfiguracion(4);
                    if($permiso>0){// si tiene activado stock negativo
                        $listaEnlace = $detallecompra->buscarEnlaceParaVentaUltimaCompra($item["id"]);
                        if (count($listaEnlace) === 0) {
                            $almacen=new almacen($con);
                            $almacenDisponible=$almacen->buscarXsucursal($sucursal);
                            if(count($almacenDisponible)===0){
                                $error = "La sucursal no cuenta con ningun almácen.";
                                break;
                            }
                            $listaEnlace=array();
                            $listaEnlace[]=array("id_detallecompra"=>null,"almacen_id"=>$almacenDisponible[0]["id_almacen"],"cantidad"=>7777);
                            //$error = "El producto solo puede vender en negativo cuando tiene por lo menos una compra realizada y que cada venta se enlaza con las compras para sacar costo.";
                            //break;
                        }
                        $repetir=true;
                        $listaVenta[$i]["cant"]=$cant;
                        $i-=1;
                    }else{
                        $error = "No se logro registrar la venta por falta de stock. Intente Nuevamente ";
                        break;
                    }
                }
                if ($error !== "")
                    break;
            }
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = $id_Venta;
    } else {
        $con->rollback();
    }
}
if ($proceso === "buscarVenta") {
    $resultado = array();
    $venta = new Venta($con);
    $detalleVenta = new detalleVenta($con);
    $producto = new producto($con);
    $lote = new lotemercaderia($con);
    $resultado["venta"] = $venta->busquedaAccionXidVenta($idventa, $tipo,$idsucursal);
    $resultado["detalle"] = $detalleVenta->buscarXidventa($resultado["venta"]["id_venta"]);
    $resultado["producto"] = $producto->stockXsucursal($idsucursal,true);
    $resultado["lote"] = $lote->lotesConStock($idsucursal);
    $resultado["clienteV"] = -1;
    $cliente=new Cliente($con);
    $idCliente=$resultado["venta"]["cliente_id"];
    if($cliente->existeVersion($idCliente,$con->empresa_id,"cliente")==="0"){
        $resultado["clienteV"] = $cliente->buscarXid($idCliente);
        $version = new version($con);
        $ultVersion = $cliente->ultimaVersion();
        $version->contructor(0, "cliente", $ultVersion, $idCliente);
        if (!$version->insertar()) {
            $error = "No se logro traer la información, Problema en el version del cliente.Intente nuevamente.";
        }
    }
}
if ($proceso === "anularFactura") {
    $resultado = array();

    $detalle = new detalleCobranza($con);
    $cantCobranza = $detalle->buscarXidVenta($id_venta);
    if (count($cantCobranza) > 0) {
        $error = "La venta tiene cobranzas. Para anular la factura elimine las cobranzas primero.";
    }
    if ($error === "") {
        $venta = new Venta($con);
        $detalleVenta = new detalleVenta($con);
        $fechaactual = date("d/m/Y H:i:s");
        $con->transacion();
        if (!$venta->anularFactura($id_venta, $fechaactual)) {
            $error = "No se logro anular la factura.Intente nuevamente.";
        } else {
            if (!$detalleVenta->anularFactura($id_venta, $fechaactual)) {
                $error = "No se logro anular la factura.Intente nuevamente.";
            }
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = $id_Venta;
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







