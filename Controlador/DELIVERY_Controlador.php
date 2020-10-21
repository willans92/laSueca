<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Content-Type: application/json; charset=utf-8");


error_reporting(0);
include_once "../Libreria/CONN.php";
include_once "../Clases/delivery.php";
include_once "../Clases/pedidoApp.php";
include_once "../Clases/detallePedidoApp.php";
include_once "../Clases/Sucursal.php";
include_once "../Clases/clienteapp.php";
include_once "../Clases/usuario.php";
include_once "../Clases/pedidoCurrier.php";
$error = "";
$resultado = "";
$proceso = "";

$con = new CONN(0);
if (!$con->estado) {
    $error = "No se pudo acceder a la base de datos. Intente mas tarde o contactese con el administrador.";
    $reponse = array("error" => $error, "result" => $resultado);
    return;
}
foreach ($_POST as $nombre_campo => $valor) {
    $data = str_replace("\\", "\\\\\\\\", htmlspecialchars(trim($valor), ENT_QUOTES, "UTF-8"));
    $data = str_replace("\t", " ", $data);
    $asignacion = "\$" . $nombre_campo . "= \"" . $data . "\";";
    eval($asignacion);
}
foreach ($_GET as $nombre_campo => $valor) {
    $data = str_replace("\\", "\\\\\\\\", htmlspecialchars(trim($valor), ENT_QUOTES, "UTF-8"));
    $data = str_replace("\t", " ", $data);
    $asignacion = "\$" . $nombre_campo . "= \"" . $data . "\";";
    eval($asignacion);
}

if ($proceso === "logearDelivery") {
    $delivery = new delivery($con);
    $resultado = $delivery->logear($cuenta, $contra);
    if (count($resultado) === 1) {
        $cuenta = $resultado[0];
        if ($cuenta["estado"] === "activo") {
            $resultado = $cuenta;
        } else {
            $error = "El usuario se encuentra bloqueado.";
        }
    } else {
        $error = "El usuario o la contraseña es incorrecta.";
    }
}
if ($proceso === "actualizarToken") {
    $delivery = new delivery($con);
    if (!$delivery->modificarToken($id_delivery, $token)) {
        $error = "Ocurrio un error en las notificaciones. Reiniciar App.";
    }
}
if ($proceso === "cambiarEstadoNotificacion") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $delivery = new delivery($con);
        if (!$delivery->modificarNotificacion($id_delivery, $estado)) {
            $error = "El usuario se encuentra bloqueado.";
        }
    }
}
if ($proceso === "buscarPedidoRecepcion") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $delivery=$delivery->buscarXid($id_delivery);
        $id_emp=0;
        if($delivery["afiliado"]==="empresa"){
            $id_emp=$delivery["empresa_id"];
        }
        $pedidos = new pedidoApp($con);
        $resultado = $pedidos->pedidosRecepcionadosDelivery($ciudad, $contador, 20, $lon, $lat,$id_emp);
    }
}
if ($proceso === "pedidoXid") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $pedidos = new pedidoApp($con);
        $pedidocurrier = new pedidoCurrier($con);
        $detalle = new detallePedidoApp($con);
        $resultado = array();
        $resultado["pedido"] = array();
        $resultado["currier"] = array();
        if ($tipo === "2") {
            $resultado["currier"][] = $pedidocurrier->buscarXid($id_pedido);
            $resultado["detalle"] = "[]";
        } else {
            $resultadoPedido = $pedidos->buscarXid($id_pedido);
            $resultado["pedido"][] = $resultadoPedido;
            $resultado["detalle"] = $detalle->buscarxIdpedido($id_pedido);
            $resultado["currier"] = "[]";
        }
    }
}
if ($proceso === "pedidoEnCurso") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $pedidos = new pedidoApp($con);
        $detalle = new detallePedidoApp($con);
        $pedidocurrier = new pedidoCurrier($con);
        $resultado = array();
        $resultado["pedido"] = $pedidos->pedidoEnCursoDelivery($id_delivery);
        $resultado["detalle"] = $detalle->pedidosEnCursoXdelyvery($id_delivery);
        $resultado["currier"] = $pedidocurrier->pedidoEnCurso($id_delivery);
    }
}
if ($proceso === "nropedidoEncurso") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $pedidos = new pedidoApp($con);
        $resultado = array();
        $resultado["pedido"] = $pedidos->nropedidoEnCursoDelivery($id_delivery);
        $resultado["currier"] = $delivery->pedidoEnCursoCurrier($id_delivery);
    }
}
if ($proceso === "aceptarPedido") {
    $delivery = new delivery($con);
    $pedidocurrier = new pedidoCurrier($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $pedidos = new pedidoApp($con);
        $delivery = new delivery($con);
        if ($tipo === "2") {
            $pedidoenCurso = $delivery->pedidoEnCursoCurrier($id_delivery);
            $cant = intval($pedidoenCurso);
            $limite = $delivery->buscarXid($id_delivery)["limitePedidos"];
            if ($cant >= intval($limite)) {
                $error = "Tu limite de pedidos de currier en curso es de $limite. No puedes aceptar mas pedidos hasta completar los pendientes.";
            } else {
                $fechaactual = date("d/m/Y H:i:s");
                if (!$pedidocurrier->modificarEstado($id_pedido, "aceptado", "aceptado='$fechaactual'", $id_delivery)) {
                    $error = "El pedido ya fue tomado por otro Delivery";
                } else {
                    $clienteapp = new clienteapp($con);
                    $tokencliente = $clienteapp->buscarXtoken($id_cliente);
                    $re = $con->enviarCurlFireBase($tokencliente, array("cliente" => "$id_cliente"), "El repartidor se encuentra en camino.");
                }
            }
        } else {// currier
            $pedidoenCurso = $delivery->pedidoEnCursoSucursal($id_delivery);
            $cant = count($pedidoenCurso);
            if ($cant > 0) {
                if ($id_sucursal != $pedidoenCurso[0]["sucursal_id"]) {
                    $error = "Solo puedes agarrar varios pedidos de la misma sucursal (Empresa).";
                } else {
                    $limite = $delivery->buscarXid($id_delivery)["limitePedidos"];
                    if ($cant >= intval($limite)) {
                        $error = "Tu limite de pedidos en curso es de $limite. No puedes aceptar mas pedidos hasta completar los pendientes.";
                    }
                }
            }
            if ($error === "") {
                if (!$pedidos->aceptarPedidoXdelivery($id_pedido, $id_delivery)) {
                    $error = "El pedido ya fue tomado por otro Delivery";
                } else {
                    $fechaactual = date("d/m/Y H:i:s");
                    $sucursal = new Sucursal($con);
                    $tosucursal = $sucursal->buscarTokenXidSucursal($id_sucursal);
                    $con->enviarCurlFireBase($tosucursal, array("sucursal" => "$id_sucursal", "tipo" => "delivery"), "El repartidor se encuentra en camino");

                    $usuario = new usuario($con);
                    $lista = $usuario->todosUsuarioConTokenXsucursal($id_sucursal);
                    for ($i = 0; $i < count($lista); $i++) {
                        $token = $lista[$i]["tokenFirebase"];
                        $re = $con->enviarCurlFireBase($token, array("tipo" => "delivery"), "El repartidor se encuentra en camino");
                    }
                }
            }
        }
    }
}
if ($proceso === "recogerPedido") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        if ($tipo === "2") {
            $fechaactual = date("d/m/Y H:i:s");
            $pedidocurrier = new pedidoCurrier($con);
            if (!$pedidocurrier->modificarEstado($id_pedido, "recogido", "recogido='$fechaactual'", $id_delivery, false)) {
                $error = "El pedido no se logro recoger.";
            } else {
                $clienteapp = new clienteapp($con);
                $tokencliente = $clienteapp->buscarXtoken($id_cliente);
                $re = $con->enviarCurlFireBase($tokencliente, array("cliente" => "$id_cliente"), "El repartidor recogio el pedido.");
            }
        } else {
            $pedidos = new pedidoApp($con);
            if (!$pedidos->recogerPedidoXdelivery($id_pedido)) {
                $error = "Ocurrio un problema al ingresar la información.Intente nuevamente";
            } else {
                
                $fechaactual = date("d/m/Y H:i:s");
                $clienteapp = new clienteapp($con);
                $clienteapp = $clienteapp->buscarXid($id_cliente);
                $con->enviarCurlFireBase($clienteapp["tokenFirebase"], array("cliente" => $clienteapp["id_clienteApp"]), "Tu pedido esta en camino.");
                /*
                $sucursal = new Sucursal($con);
                $tosucursal = $sucursal->buscarTokenXidSucursal($id_sucursal);
                $con->enviarCurlFireBase($tosucursal, array("sucursal" => "$id_sucursal"), "El repartidor recogio el pedido");

                $usuario = new usuario($con);
                $lista = $usuario->todosUsuarioConTokenXsucursal($id_sucursal);
                for ($i = 0; $i < count($lista); $i++) {
                    $token = $lista[$i]["tokenFirebase"];
                    $re = $con->enviarCurlFireBase($token, array("tipo" => "delivery"), "El repartidor recogio el pedido");
                }
                */
            }
        }
    }
}
if ($proceso === "entregarPedido") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        if ($tipo === "2") {
            $fechaactual = date("d/m/Y H:i:s");
            $pedidocurrier = new pedidoCurrier($con);
            if (!$pedidocurrier->modificarEstado($id_pedido, "entregado", "entregado='$fechaactual'", $id_delivery, false)) {
                $error = "El pedido no se logro entregar.";
            } else {
                $clienteapp = new clienteapp($con);
                $tokencliente = $clienteapp->buscarXtoken($id_cliente);
                $re = $con->enviarCurlFireBase($tokencliente, array("cliente" => "$id_cliente"), "El repartidor entrego el pedido.");
            }
        } else {
            $pedidos = new pedidoApp($con);
            if (!$pedidos->entregarPedidoXdelivery($id_pedido)) {
                $error = "Ocurrio un problema al ingresar la información.Intente nuevamente";
            } else {
                $fechaactual = date("d/m/Y H:i:s");
                $clienteapp = new clienteapp($con);
                $clienteapp = $clienteapp->buscarXid($id_cliente);
                $con->enviarCurlFireBase($clienteapp["tokenFirebase"], array("cliente" => $clienteapp["id_clienteApp"]), "Pedido entregado ¡Gracias por la confianza!");
            }
        }
    }
}
if ($proceso === "vueltaPedido") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $fechaactual = date("d/m/Y H:i:s");
        $pedidocurrier = new pedidoCurrier($con);
        if (!$pedidocurrier->modificarEstado($id_pedido, "finalizado", "vuelta='$fechaactual'", $id_delivery, false)) {
            $error = "El pedido no se logro finalizar.";
        } else {
            $clienteapp = new clienteapp($con);
            $tokencliente = $clienteapp->buscarXtoken($id_cliente);
            $re = $con->enviarCurlFireBase($tokencliente, array("cliente" => "$id_cliente"), "El repartidor finalizo la entrega.");
        }
    }
}
if ($proceso === "misPedidos") {
    $delivery = new delivery($con);
    $resultado = $delivery->cuentaEstaActiva($id_delivery);
    if ($resultado === "0") {
        $error = "Error Session";
    } else {
        $currier= new pedidoCurrier($con);
        $pedidos = new pedidoApp($con);
        if($tipoPedido==="EXPRESS"){
             $resultado = $currier->reporteIngresosDeDelivery($id_delivery, $de, $hasta);
        }else{
            $resultado = $pedidos->reporteIngresosDeDelivery($id_delivery, $de, $hasta);
        }
    }
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







