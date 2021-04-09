<?php

include_once('../Libreria/variables.php');

if ($proceso === "buscarPedido") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->buscarPedido($de, $hasta, $estado, $cliente, $tienda, $contador, 50);
}
if ($proceso === "tarifario") {
    $mensajes=new mensajeGuardado($con);
    $resultado = array();
    $resultado["tarifario"] = file_get_contents('http://localhost/Emprendedor/Controlador/Login_Controlador.php?proceso=tarifario');
    $resultado["mensaje"] = $mensajes->buscarXtipo("Cancelacion Pedido");
}
if ($proceso === "cambioUbicacion") {// sincronizar con emprendedor
    $pedido = new pedidoApp($con);
    if (!$pedido->cambiarUbicacionPedido($id_pedido, $lon2, $lat2, $costo, 0, $sessionUsuario["id_usuario"])) {
        $error = "No se logro registrar el cambio.";
    }
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
if ($proceso === "registarCambioProducto") {// sincronizar con emprendedor
    $con->transacion();
    $pedido = new pedidoApp($con);
    if (!$pedido->modifiarTotal($id_pedido, $total)) {
        $error = "No se logro registra los cambio.Intente nuevamente.";
    } else {
        $detalleoBJ = new detallePedidoApp($con);
        if (!$detalleoBJ->eliminarXidPedido($id_pedido)) {
            $error = "No se logro registra los cambio.Intente nuevamente.";
        }
        $detalle = $_POST["detalle"];
        for ($i = 0; $i < count($detalle); $i++) {
            $detalleoBJ = new detallePedidoApp($con);
            $item = $detalle[$i];
            $detalleoBJ->contructor(0, "CAMBIADO POR CONTROL PEDIDO", $item["cant"], $item["precio"], "activo", $id_pedido, $item["id"], $item["comision"]);
            if (!$detalleoBJ->insertar()) {
                $error = "No se logro registra los cambio.Intente nuevamente.";
            }
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "cambioDatosPedido") {
    $con->transacion();
    $venta = new Venta($con);
    if ($venta_id != "0") {
        $fechaactual = date("d/m/Y H:i:s");
        if (!$venta->anularFactura($venta_id, $fechaactual)) {
            $error = "No se logro anular la factura.Intente nuevamente.";
        } else {
            $venta_id = 0;
        }
    }
    if ($estado === "entregado") {
        $con->transacion();
        $pedido = new pedidoApp($con);
        $pedido = $pedido->buscarXid($id_pedido);

        $detallePedido = new detallePedidoApp($con);
        $detallePedido = $detallePedido->buscarxIdpedido($id_pedido);

        $fecha = date("d/m/Y");
        $cliente = new Cliente($con);
        $cliente = $cliente->buscarXidClienteApp($pedido["id_cliente"], $con->empresa_id);
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
            } else {
                $cliente = new Cliente($con);
                if ($cliente->existeVersion($id_Cliente, $con->empresa_id, "cliente") === "0") {
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
            $clienteApp = $clienteApp->buscarXid($pedido["id_cliente"]);

            $cliente = new Cliente($con);
            $codigoApp = "APP-" . $pedido["cliente"];
            $cliente->contructor(0, $codigoApp, "", $clienteApp["nombre"], $clienteApp["telefono"], "", $clienteApp->foto, 0, $pedido["nit"], $pedido["rz"], 0, "", "", 0, $clienteApp->correo, $fecha, "Cliente Creado por la APP", $pedido["id_cliente"]);
            //($id_cliente    ,$codigo    ,$ci    ,$nombre                ,$telefono                  ,$direccion ,$foto              ,$descuento ,$nit            ,$razonSocial  ,$descuentoMax  ,$telefonoContacto  ,$personaContacto   ,$limiteCredito ,$email                 ,$fechaNacimiento   ,$comentario                , $clienteApp_id=0)
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
        $nroVenta = $venta->generarNroDocumento($sucursal["id_sucursal"]);
        $nroDocumento = 0;

        if ($error === "") {
            $venta = new venta($con);
            $fechaactual = date("d/m/Y H:i:s");
            $horaactual = date("H:i:s");


            $venta->contructor(0, "Venta Al Contado APP", "Contado", "$fecha $horaactual", $sessionUsuario["id_usuario"], $fechaactual, $pedido["nit"], $pedido["rz"]
                    , "", "", 'activo', $id_Cliente, $sucursal["id_sucursal"], "Efectivo", $nroDocumento, "", ""
                    , "", "Entregado", $fecha, "", "", $sucursal["documentoVenta"], $nroVenta, $sessionUsuario["id_usuario"]);
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
                                $almacen = new almacen($con);
                                $almacenDisponible = $almacen->buscarXsucursal($sucursal["id_sucursal"]);
                                if (count($almacenDisponible) === 0) {
                                    $error = "La sucursal no cuenta con ningun almácen.";
                                    break;
                                }
                                $listaEnlace = array();
                                $listaEnlace[] = array("id_detallecompra" => null, "almacen_id" => $almacenDisponible[0]["id_almacen"], "cantidad" => 7777);
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
            if (!$pedido->realizarVentaPedido($id_pedido, $id_Venta)) {
                $error = "No se logro registrar la venta. Intente Nuevamente ";
                $con->rollback();
            } else {
                $con->commit();
                $resultado = $id_Venta;
            }
        } else {
            $con->rollback();
        }
        $venta_id = $id_Venta;
    }
    $pedido = new pedidoApp($con);
    if (!$pedido->cambiarDeliveryYestadoPedido($id_pedido, $estado, $venta_id, $motivo)) {
        $error = "No se logro realizar los cambios";
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "buscarProducto") {
    $detalle = new detallePedidoApp($con);
    $producto = new producto($con);
    $resultado = array();
    $resultado["producto"] = $producto->stockXsucursal("0", false);
    $resultado["detalle"] = $detalle->buscarxIdpedido($id_pedido);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







