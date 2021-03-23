<?php

include_once('../Libreria/variables.php');

if ($proceso === "buscarTienda") {
    $tienda= new tienda($con);
    $resultado = $tienda->todo();
}
if ($proceso === "registrar") {
    $con->transacion();
    $clienteObj = new cliente($con);
    $clienteObj->contructor($cliente_id, "", $ci, $cliente, $telefono, $direccion,"", 0, $ci, $cliente, 0, "", "", 0, $correo, "", "Cliente con Tienda");
    $estado2="modificar";
    if ($cliente_id === "0") {
        $estado2="registrar";
        if (!$clienteObj->insertar()) {
            $error = "No se logro registrar al cliente.";
        } else {
            $cliente_id = $clienteObj->id_cliente;
        }
    } else {
        if (!$clienteObj->modificarBasica($cliente_id)) {
            $error = "No se logro modificar al cliente.";
        }
    }
    if ($error === "") {
        $version = new version($con);
        $ultVersion = $clienteObj->ultimaVersion();
        $version->contructor(0, "cliente", $ultVersion, $cliente_id);
        if (!$version->insertar()) {
            $error = "No se logro $estado el cliente.Intente nuevamente.";
        }
    }
    
    if ($error === "") {
        $fechaactual = date("d/m/Y H:i:s");
        $tienda=new tienda($con);
        $tienda->contructor($tienda_id, $nombre, $cuenta, $contrasena, $estado
                , $fechaactual, "", $fechaactual, $sessionUsuario["id_usuario"]
                , $sessionUsuario["id_usuario"], $cliente_id,$codigoPadre);
        if ($tienda_id === "0") {
            if (!$tienda->insertar()) {
                $error = "No se logro registrar la tienda.";
            }
        }else{
            if (!$tienda->modificar()) {
                $error = "No se logro registrar la tienda.";
            }
        }
    }
    if ($error === "") {
        $urlLogo = $con->base64_to_jpeg($logo, "Tienda", "t_" . $tienda->id_tienda . "_logo");
        if (!$tienda->modificarFoto($tienda->id_tienda, $urlLogo)) {
            $error = "ocurrio un problema al registrar el logo. Intente nuevamente";
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







