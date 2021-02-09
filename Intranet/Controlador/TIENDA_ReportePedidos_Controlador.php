

<?php
$tipoSession="tienda";
include_once('../Libreria/variables.php');

if ($proceso === "buscador") {
    $pedido= new pedidoApp($con);
    $resultado=$pedido->buscarPedidoTienda($estado, $de, $hasta, $buscador);
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







