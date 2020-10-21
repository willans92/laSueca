<?php

include_once('../Libreria/variables.php');


if ($proceso === "iniciar") {
    $ciudad = new ciudad($con);
    $resultado=array();
    $resultado["ciudad"] = $ciudad->todoOption();
    $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    if($empresa["empresaADM"]==="ADM"){
        $empresa= new empresa($con);
        $resultado["empresa"] = $empresa->todasEmpresas();
        $resultado["buscadorEmp"]="<span class='negrillaenter'>Empresa</span><input type='text' class='grande' name='empresa' placeholder='--Empresa--' autocomplete='off'/> ";
    }else{
        $resultado["idempresa"] = $sessionUsuario["empresa_id"];
    }
}
if ($proceso === "reportePedido") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->reportePedido($tipo, $de, $hasta,$empresa,$ciudad,$estado);
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







