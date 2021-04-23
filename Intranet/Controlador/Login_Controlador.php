<?php

$activar = true;
include_once "../Libreria/variables.php";

if ($proceso === "logear") {
    if ($tipo === "Administrativo") {
        $usuario = new usuario($con);
        if ($usuario->logear($cuenta, $contra) > 0) {
            $re = $usuario->estadoUsuario($cuenta, $contra);
            if ($re !== null) {
                $permisos = $usuario->tienPermisos($re["id_usuario"]);
                if ($permisos === "0") {
                    $error = "La cuenta no cuenta con los permisos necesarios para logearse. Contactese con el administrador.";
                } else {
                    $_SESSION["usuario"] = $re;
                    $resultado = array();
                    $resultado["sucursal_id"] = $re["sucursal_id"];
                    $resultado["nombre"] = $re["nombre"];
                    $resultado["id_usuario"] = $re["id_usuario"];
                    $resultado["ciudad_id"] = $re["ciudad_id"];
                    $resultado["ADM_ciudad_id"] = $re["ADM_ciudad_id"];
                    $resultado["empresaADM"] = $re["empresaADM"];
                }
            } else {
                $error = "La cuenta se encuentra bloqueada. Contactese con el administrador.";
            }
        } else {
            $error = "Usuario o Contraseña es incorrecto. Intente nuevamente.";
        }
    } else {
        $tienda = new tienda($con);
        if ($tienda->logear($cuenta, $contra) > 0) {
            $re = $tienda->estadoUsuario($cuenta, $contra);
            if ($re !== null) {
                $_SESSION["tienda"] = $re;
                $resultado = $re;
            } else {
                $error = "La cuenta se encuentra bloqueada. Contactese con el administrador.";
            }
        } else {
            $error = "Usuario o Contraseña es incorrecto. Intente nuevamente.";
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
 
