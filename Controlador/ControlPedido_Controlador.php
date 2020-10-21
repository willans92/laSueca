<?php

include_once('../Libreria/variables.php');

if ($proceso === "buscarPedido") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->buscarPedido($de, $hasta, $ciudad_id, $estado, $cliente, $empresa, $contador, 50,$express,$ver);
}
if ($proceso === "ciudades") {
    $ciudad = new ciudad($con);
    $tarifarioApp = new tarifarioApp($con);//revisar en caliente
    $resultado=array();
     $resultado["ciudad"] = $ciudad->todo();
    $resultado["tarifario"] = $tarifarioApp->todas();
}
if ($proceso === "cambioUbicacion") {
    if($tipoCarrera==="1"){
        $pedido=new pedidoApp($con);
        if(!$pedido->cambiarUbicacionPedido($id_pedido, $lon2, $lat2,$costo,$descuento,$sessionUsuario["id_usuario"])){
            $error="No se logro registrar el cambio.";
        }
        
    }else{
       $pedidocurrier = new pedidoCurrier($con);
        if(!$pedidocurrier->modificarLocalizacion($id_pedido, $lon, $lat, $lon2, $lat2,$costo,$descuento,$sessionUsuario["id_usuario"])){
            $error="No se logro registrar el cambio.";
        } 
    }
    
}
if ($proceso === "cambioDatosPedido") {
    if ($tipo === "1") {
        $pedido = new pedidoApp($con);
        if (!$pedido->cambiarDeliveryYestadoPedido($id_pedido, $delivery_id, $estado)) {
            $error = "No se logro realizar los cambios";
        }
    } else {
        $pedidocurrier = new pedidoCurrier($con);
        $fechaactual = date("d/m/Y H:i:s");
        if (!$pedidocurrier->modificarEstado($id_pedido, $estado, "aceptado='$fechaactual'", $delivery_id)) {
            $error = "No se logro realizar los cambios";
        }
    }

    if ($notificar === "1") {
        if ($estado === "cancelado") {
            /*  $clienteapp = new clienteapp($con);
              $clienteapp = $clienteapp->buscarXid($id_cliente);
              $re = $con->enviarCurlFireBase($clienteapp["tokenFirebase"], array("cliente" => $clienteapp["id_clienteApp"]), "El pedido fue cancelado por " + $nombreEmpresa);
              $resultado = $pedido->nroPendientes($sucursal_id); */
        }
        if ($estado === "entregado") {
            
        }
        if ($estado === "en camino") {
            
        }
        if ($estado === "recepcionado") {
            
        }
        if ($estado === "recogiendo pedido") {
            
        }
    }
}
if ($proceso === "deliveryXciudad") {
    $delivery = new delivery($con);
    $detalle = new detallePedidoApp($con);
    $resultado = array();
    if ($tipo === "1") {
        $resultado["detalle"] = $detalle->buscarxIdpedido($id_pedido);
    }
    $resultado["delivery"] = $delivery->buscarXciudad($ciudad_id);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







