<?php

include_once "../Libreria/variables.php";



if ($proceso === "registrarVenta") {
    $con->transacion();
    $sucursalObj = new Sucursal($con);
    $autorizacion = "";
    $codigoControl = "";
    $fechaLimiteEmision = "";
    $mensajeImpuesto = "";
    $actividadEconomica = "";

    $pedido = new pedidoApp($con);
    $pedido = $pedido->buscarXid($idpedido);

    $detallePedido = new detallePedidoApp($con);
    $detallePedido = $detallePedido->buscarxIdpedido($idpedido);

    $fecha = date("d/m/Y");
    $cliente = new Cliente($con);
    $cliente = $cliente->buscarXidClienteApp($pedido["cliente"],$con->empresa_id);
    $id_Cliente = 0;
    if (count($cliente) > 0) {
        $cliente = $cliente[0];
        $id_Cliente = $cliente["id_cliente"];
        $clienteObj = new Cliente($con);
        if ($pedido["nit"] !== "") {
            if (!$clienteObj->modificarDatosFacturacion($cliente["id_cliente"], $pedido["nit"], $pedido["rz"])) {
                $error = "No se logro registrar la venta. Intentelo Nuevamente";
            } else {
                $version = new version($con);
                $ultVersion = $clienteObj->ultimaVersion();
                $version->contructor(0, "cliente", $ultVersion, $id_Cliente);
                if (!$version->insertar()) {
                    $error = "No se logro registrar. Intente nuevamente.";
                }
            }
        }else{
            $cliente=new Cliente($con);
            if($cliente->existeVersion($id_Cliente,$con->empresa_id,"cliente")==="0"){
                $version = new version($con);
                $ultVersion = $cliente->ultimaVersion();
                $version->contructor(0, "cliente", $ultVersion, $id_Cliente);
                if (!$version->insertar()) {
                    $error = "No se logro registrar. Intente nuevamente.";
                }
            }
        }
    } else {
        $clienteApp = new clienteapp($con);
        $clienteApp = $clienteApp->buscarXid($pedido["cliente"]);

        $cliente = new Cliente($con);
        $codigoApp="APP-". $pedido["cliente"];
        $cliente->contructor(0, $codigoApp,"",$clienteApp["nombre"]
                , $clienteApp["telefono"], "", $clienteApp->foto, 0, $pedido["nit"]
                , $pedido["rz"]	, 0, "", "", 0,$clienteApp->correo, $fecha, "Cliente Creado por la APP"
                , $pedido["cliente"]);
        
        if (!$cliente->insertar()) {
            $error = "No se logro registrar la venta. Intentelo Nuevamente";
        } else {
            $id_Cliente = $cliente->id_cliente;
            $version = new version($con);
            $clienteObj = new Cliente($con);
            $ultVersion = $clienteObj->ultimaVersion();
            $version->contructor(0, "cliente", $ultVersion, $id_Cliente);
            if (!$version->insertar()) {
                $error = "No se logro registrar. Intente nuevamente.";
            }
        }
    }

    $venta = new venta($con);

    $sucursal = new Sucursal($con);
    $sucursal = $sucursal->buscarXid($sessionUsuario["sucursal_id"]);
    if ($sucursal["documentoVenta"] === 'Factura') {
        $dosificacionObj = new DosificacionSucursal($con);
        $dosif = $dosificacionObj->buscarXFechaSucursal($sucursal["id_sucursal"], $fecha);
        if (count($dosif) === 0) {
            $error = "La Dosificacion de la sucursal se encuentra vencida. ";
        } else {
            $autorizacion = $dosif[0]["nroAutorizacion"];
            $llavedosificacion = $dosif[0]["LlaveDosificacion"];
            $fechaLimiteEmision = $dosif[0]["fechaLimiteEmision"];
            $mensajeImpuesto = $dosif[0]["mensajeImpuesto"];
            $actividadEconomica = $dosif[0]["actividadEconomica"];

            $nroDocumento = $venta->generarNroFactura($sucursal["id_sucursal"], $autorizacion, $fecha);
            if ($nroDocumento === "0") {
                $error = "No puede generar una factura en esa fecha porque ya se han realizado ventas en fechas poseteriores a lo marcado. ";
            }

            if ($error == "") {
                list($dia, $mes, $ano) = explode('/', $fecha);
                $controlCode = new ControlCode();
                try {
                    $codigoControl = $controlCode->generate($autorizacion, "$nroDocumento", trim($pedido["nit"]), "$ano$mes$dia", $pedido["totalPedido"], $llavedosificacion);
                } catch (Exception $exc) {
                    $error = "Su Dosificación afiliada a la sucursal se encuentra con datos erroneos.";
                }
            }
        }
    }
    $nroVenta = $venta->generarNroDocumento($sucursal["id_sucursal"]);
    if ($sucursal["documentoVenta"] !== 'Factura') {
        $nroDocumento = 0;
    }
    if ($error === "") {
        $venta = new venta($con);
        $fechaactual = date("d/m/Y H:i:s");
        $horaactual = date("H:i:s");


        $venta->contructor(0, "Venta Al Contado APP", "Contado", "$fecha $horaactual", $sessionUsuario["id_usuario"], $fechaactual, $pedido["nit"], $pedido["rz"]
                , $autorizacion, $codigoControl, 'activo', $id_Cliente, $sucursal["id_sucursal"], "Efectivo", $nroDocumento, $fechaLimiteEmision, $mensajeImpuesto
                , $actividadEconomica, "Entregado", $fecha, "", "", $sucursal["documentoVenta"], $nroVenta, $sessionUsuario["id_usuario"]);
        if (!$venta->insertar()) {
            $error = "No se logro registrar la venta. Intente Nuevamente ";
        } else {
            $id_Venta = $venta->id_venta;

            $cobranza = new cobranza($con);
            $nroDoc = $cobranza->generarNroComprobante();
            $usuario = new usuario($con);
            $usuario = $usuario->buscarXid($sessionUsuario["id_usuario"]);
            $sucursal_id = $usuario["sucursal_id"];
            $cobranza->contructor(0, $nroDoc, "Cobranza", $fechaactual, $sessionUsuario["id_usuario"]
                    , $fechaactual, $sessionUsuario["id_usuario"], $sucursal["id_sucursal"], "Efectivo", 'activo');
            if (!$cobranza->insertar()) {
                $error = "No se logro registrar la cobranza. Intente de nuevo";
            } else {
                $detalle = new detalleCobranza($con);
                $detalle->contructor(0, $cobranza->id_cobranza, $id_Venta, $pedido["totalPedido"], "Se cobro al realizar la venta", 'activo');
                if (!$detalle->insertar()) {
                    $error = "No se logro registrar la cobranza. Intente de nuevo";
                }
            }
        }



        if ($error === "") {
            $repetir = false;
            for ($i = 0; $i < count($detallePedido); $i++) {
                $item = $detallePedido[$i];
                $iddetalle = "0";
                $cant = (int) ($item["cantidad"]);
                $historico = 0;
                $desc = 0.00;
                $precio = floatval($item["precioU"]);
                $detallecompra = new detalleCompra($con);

                if ($repetir) {// si tiene activado stock negativo
                    $repetir = false;
                } else {
                    $listaEnlace = $detallecompra->buscarEnlaceParaVenta($item["producto_id"], $sucursal["id_sucursal"], $iddetalle);
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
                    $preciototal = ($precio * $cantAux) - $desc;
                    $detalleVenta = new detalleventa($con);
                    $detalleVenta->contructor(0, $item["producto_id"], $cantAux, $precio, $almacen_id, $id_detallecompra, $desc, $preciototal, $id_Venta, 'activo', "$fecha $horaactual");
                    if (!$detalleVenta->insertar()) {
                        $error = "No se logro registrar la venta. Intente Nuevamente ";
                        break;
                    }
                }
                if ($cant > 0) {
                    $datosEmpresa = new empresa($con);
                    $permiso = $datosEmpresa->tieneConfiguracion(4);
                    if ($permiso > 0) {// si tiene activado stock negativo
                        $listaEnlace = $detallecompra->buscarEnlaceParaVentaUltimaCompra($item["producto_id"]);
                        if (count($listaEnlace) === 0) {
                            $almacen=new almacen($con);
                            $almacenDisponible=$almacen->buscarXsucursal($sucursal["id_sucursal"]);
                            if(count($almacenDisponible)===0){
                                $error = "La sucursal no cuenta con ningun almácen.";
                                break;
                            }
                            $listaEnlace=array();
                            $listaEnlace[]=array("id_detallecompra"=>null,"almacen_id"=>$almacenDisponible[0]["id_almacen"],"cantidad"=>7777);
                            //$error = "El producto solo puede vender en negativo cuando tiene por lo menos una compra realizada y que cada venta se enlaza con las compras para sacar costo.";
                            //break;
                        }
                        $repetir = true;
                        $listaVenta[$i]["cant"] = $cant;
                        $i -= 1;
                    } else {
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
        $pedido = new pedidoApp($con);
        if (!$pedido->realizarVentaPedido($idpedido, $id_Venta)) {
            $error = "No se logro registrar la venta. Intente Nuevamente ";
            $con->rollback();
        } else {
            $con->commit();
            $resultado = $id_Venta;
        }
    } else {
        $con->rollback();
    }
}
if ($proceso === "actualizarToken") {
    $sucursal = new Sucursal($con);
    if (!$sucursal->modificarToken($sessionUsuario["sucursal_id"], $token)) {
        $error = "El sistema se encuentra con las notificaciones de pedidos inactivas. Contáctese con el administrador del sistema.";
    }
}
if ($proceso === "nroPendientes") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->nroPendientes($sessionUsuario["sucursal_id"]);
}
if ($proceso === "cancelarPedido") {
    $pedido = new pedidoApp($con);
    if (!$pedido->cancelarPedido($idpedido, "")) {
        $error = "No se logro cancelar el pedido.Intenetelo Nuevamente.";
    } else {
        $clienteapp = new clienteapp($con);
        $clienteapp = $clienteapp->buscarXid($idcliente);
        $re = $con->enviarCurlFireBase($clienteapp["tokenFirebase"], array("cliente" => $clienteapp["id_clienteApp"]), "El pedido fue cancelado por " . $sessionUsuario["nombreempresa"]);
        $resultado = $pedido->nroPendientes($sessionUsuario["id_usuario"]);
    }
}
if ($proceso === "recepcionarPedido") {
    $pedido = new pedidoApp($con);
    if (!$pedido->recepcionarPedido($idpedido)) {
        $error = "No se logro recepcionar el pedido.Intenetelo Nuevamente.";
    } else {
        $clienteapp = new clienteapp($con);
        $tokencliente = $clienteapp->buscarXtoken($idcliente);
        $re = $con->enviarCurlFireBase($tokencliente, array("cliente" => "$idcliente"), $sessionUsuario["nombreempresa"]." esta preparando tu pedido.");
    }
}
if ($proceso === "llamarRepartidor") {
    $pedido = new pedidoApp($con);
    if (!$pedido->llamarRepartidor($idpedido)) {
        $error = "No se logro recepcionar el pedido.Intenetelo Nuevamente.";
    } else {
        
        $empresa= new empresa($con);
        $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
        $afiliacion=$empresa["delivery"]==="propia"?"empresa":$empresa["delivery"];
        $id_emp=0;
        if($afiliacion==="empresa"){
            $id_emp=$empresa["id_empresa"];
        }
        
        $delivery = new delivery($con);
        $lista = $delivery->deliveryNotificacionActiva($sessionUsuario["ciudad_id"],$afiliacion,$id_emp);
        for ($i = 0; $i < count($lista); $i++) {
            $token = $lista[$i]["tokenFirebase"];
            $re = $con->enviarCurlFireBase($token, array("tipo" => "delivery"), "Un nuevo pedido solicitado por " . $sessionUsuario["nombreempresa"]);
        }
    }
}
if ($proceso === "listaPedidosPendientes") {
    $pedido = new pedidoApp($con);
    $detalle = new detallePedidoApp($con);
    $resultado = array();
    $resultado["pedido"] = $pedido->PendienteXsucursal($sessionUsuario["sucursal_id"]);
    $resultado["detalle"] = $detalle->buscarXsucursal($sessionUsuario["sucursal_id"]);
}
if ($proceso == "version") {
    $usuario = new usuario($con);
    $producto = new producto($con);
    $cliente = new cliente($con);

    $clienteStr = $cliente->version($versionCliente);
    $usuarioStr = $usuario->version($versionUsuario);
    $productoStr = $producto->version($versionProducto);

    $resultado = "{\"cliente\":$clienteStr,\"usuario\":$usuarioStr,\"producto\":$productoStr, \"empresa\":" . $con->empresa_id . "}";
    echo $resultado;
    return;
}
if ($proceso == "iniciar") {
    $resultado = array();
    $sucursal = new sucursal($con);
    $usuario = new usuario($con);
    $datosEmpresa = new empresa($con);
    $categoria = new categoriapermiso($con);
    $permisos = new permiso($con);
    $pedido = new pedidoApp($con);
    $resultado["nroPedidoPendiente"] = $pedido->nroPendientes($sessionUsuario["sucursal_id"]);
    $resultado["sucursal"] = $sucursal->todas();
    $resultado["permisos"] = $permisos->todo($sessionUsuario["empresaADM"]);
    $resultado["permisosUsuario"] = $usuario->buscarPermisoUsuario($sessionUsuario["id_usuario"], $sessionUsuario["empresaADM"]);
    $resultado["categoria"] = $categoria->todo($sessionUsuario["empresaADM"]);
    $resultado["empresa"] = $datosEmpresa->buscarXid($sessionUsuario["empresa_id"]);
    $resultado["configuracionEmpresa"] = $datosEmpresa->configuracionXidempresa();
}
if ($proceso == "buscarSucursal") {
    $resultado = array();
    $sucursal = new sucursal($con);
    $resultado["sucursal"] = $sucursal->todas();
}
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
    $resultado["detalle"] = $detalle->buscarXidCobranza($resultado["cobranza"]["id_cobranza"]);
}
$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);








