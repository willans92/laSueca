<?php

include_once('../Libreria/variables.php');

if ($proceso === "ciudades") {
     $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    $ciudad = new ciudad($con);
    $resultado= array();
    $resultado["ciudad"] = $ciudad->todo();
    if($empresa["empresaADM"]==="ADM"){
        $resultado["xpress"]="<div class='col-3'><label>Lim. Xpress</label><input type='number' class='form-control' name='express' autocomplete='off'></div>";
    };
}
if ($proceso === "buscarDelivery") {
    $delivery = new delivery($con);
    $resultado = $delivery->buscarDelivery($buscador, $estado, $ciudad_id, $contador,$sessionUsuario["empresa_id"]);
}
if ($proceso === "registrarProvedor") {
    $delivery = new delivery($con);
    $fechaactual = date("d/m/Y H:i:s");
    $empresa= new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    $afiliacion=$empresa["empresaADM"]==="ADM"?"emprendedor":"empresa";
    $delivery->contructor($id_delivery, $nombre, $cuenta, $contra, $tipo, $tpestado
            , $fechaactual, $telefono, "", "inactivo", $ciudad, $direccion
            , $sessionUsuario["id_usuario"], $ci, $limite,$express,$afiliacion,$sessionUsuario["empresa_id"]);
    if ($cuenta !== "" && $delivery->existecuenta($cuenta, $id_delivery) !== "0") {
        $error = "La cuenta ya se encuentra ocupada. cambiela y vuelva intentar";
    } else {
        if ($id_delivery === "0") {
            if (!$delivery->insertar()) {
                $error = "No se logró registrar el nuevo delivery";
            }
        } else {
            if (!$delivery->modificar()) {
                $error = "No se logró modificar el nuevo delivery";
            }
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







