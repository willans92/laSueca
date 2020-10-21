<?php

include_once('../Libreria/variables.php');

if ($proceso === "ciudades") {
    $ciudad = new ciudad($con);
    $resultado= array();
    $resultado["ciudad"] = $ciudad->todo();
    $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    if($empresa["empresaADM"]==="ADM"){
        $resultado["tipo"]="<div class='negrilla'>Tipo</div><select id='tipo' class='normal' onchange=\"buscar('', 1)\"><option value='pedido' selected>Pedido</option><option value='currier' >Express</option></select>";
    }
}
if ($proceso === "pedidosDelivery") {
    if($tipoDelivery==="pedido"){
        $delivery = new delivery($con);
        $resultado = $delivery->ingresosDeliveryXPedido($buscador, $de,$hasta, $ciudad_id, $contador,$sessionUsuario["empresa_id"]);
    }else{
        $delivery = new delivery($con);
        $resultado = $delivery->ingresosDeliveryXCurrier($buscador, $de,$hasta, $ciudad_id, $contador,$sessionUsuario["empresa_id"]);
    }
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







