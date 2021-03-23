<?php

include_once('../Libreria/variables.php');

if ($proceso === "configuracion") {
    $datosEmpresa = new empresa($con);
    $configuracion = new configuracion($con);
    $categoriaApp = new categoriaapp($con);
    $resultado = array();
    $resultado["empresa"] = $datosEmpresa->buscarXid($sessionUsuario["empresa_id"]);
}
if ($proceso === "registrar") {
    $datosEmpresa = new empresa($con);
    if(!$datosEmpresa->modificarDatos($telefono, $comisionHijo, $comisionNieto)){
        $error="No se logro cambiar los datos de configuracion.";
    }
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







