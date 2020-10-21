<?php

include_once('../Libreria/variables.php');

if ($proceso === "registrarProvedor") {
    $estado = "";
    $provedor = new Provedor($con);
    $fechaactual = date("d/m/Y h:i:s");
    $provedor->contructor($id_provedor, $nombre, $rz, $nit, $direccion, $telefono, $correo, $psContacto, $TelfpsContacto, $tppago, $tpestado, $tpDoc, $fechaactual,$sessionUsuario["id_usuario"]);
    if ($id_provedor === "0") {
        if (!$provedor->insertar()) {
            $error = "No se logró registrar a el provedor.Intente nuevamente. COD.0x21";
        }
    } else {
        if (!$provedor->modificar()) {
            $error = "No se logró modificar a el provedor.Intente nuevamente. COD.0x22";
        }
    }
}
if ($proceso === "buscarProvedor") {
    $provedor = new Provedor($con);
    $resultado = $provedor->buscarXestado($estado);
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







