<?php

include_once('../Libreria/variables.php');

if ($proceso === "ciudades") {
    $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    $ciudad = new ciudad($con);
    $resultado= array();
    $resultado["ciudad"] = $ciudad->todo();
    if($empresa["empresaADM"]==="ADM"){
        $resultado["tipo1"]="<div class='negrilla'>Tipo</div><select id='tipo1' class='normal p-2' onchange=\"buscar('', 1)\"><option value='pedido' selected>Pedido</option><option value='currier' >Express</option></select>";
        $resultado["tipo2"]="<label>Tipo</label><select id='tipo2' class='normal p-2' ><option value='pedido' selected>Pedido</option><option value='currier' >Express</option></select>";//aqui
    }
    
}
if ($proceso === "buscarDelivery") {
    $tarifario = new tarifarioApp($con);
    $resultado = $tarifario->buscarTarifario($estado, $ciudad_id, $contador,$sessionUsuario["empresa_id"],$tipoTarifa);
}
if ($proceso === "registrarTarifa") {
    $tarifario = new tarifarioApp($con);
    $fechaactual = date("d/m/Y H:i:s");
    $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    $afiliacion=$empresa["tarifaDelivery"]==="emprendedor"?"emprendedor":"empresa";
    
    $tarifario->contructor($id_tarifa, $nombre, $tpestado, $de, $hasta, $precio, $tipoTarifa,$afiliacion,$sessionUsuario["empresa_id"],$ciudad);
    if($id_tarifa==="0"){
        if(!$tarifario->insertar()){
            $error="No se logro registar la tarifa. Intente nuevamente";
        }
    }else{
        if(!$tarifario->modificar()){
            $error="No se logro modificar la tarifa. Intente nuevamente";
        }
    }
    
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







