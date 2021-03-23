<?php

include_once('../Libreria/variables.php');


if ($proceso === "iniciar") {
    $tienda = new tienda($con);
    $resultado = $tienda->todo();
}
if ($proceso === "reportePedidoDiario") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->reportePedidoDiario($de, $hasta,$tienda,$estado);
}
if ($proceso === "reportePedidoMensual") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->reportePedidoMensual($tienda,$estado);
}
if ($proceso === "pedidosDetallados") {
    $pedido= new pedidoApp($con);
    $resultado=$pedido->buscarPedidoTienda($estado, $de, $hasta, $buscador,$tienda);
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







