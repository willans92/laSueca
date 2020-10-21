<?php

include_once('../Libreria/variables.php');

if ($proceso === "CategoriaPermisos") {
    $permisos = new permiso($con);
    $resultado = array();
    $usuario = new usuario($con);
    $perfil = new perfil($con);
    $empresa=new empresa($con);
    $empresa=$empresa->buscarXid($sessionUsuario["empresa_id"]);
    $resultado["permisos"] = $permisos->todo($sessionUsuario["empresaADM"],$empresa["delivery"],$empresa["tarifaDelivery"]);
    $resultado["categoria"] = $permisos->Categoria($sessionUsuario["empresaADM"]);
    $resultado["perfil"] = $perfil->todos();
}
if ($proceso === "registarPermiso") {
    $con->transacion();
    $usuario = new usuario($con);
    if (!$usuario->eliminarXPermisos($idusuario)) {
        $error = "No se logró modificar el permiso del usuario. Intente nuevamente. COD.0x1";
    }
    if ($error === "") {
        $lista = empty($_POST["lista"]) ? [] : $_POST["lista"];
        for ($i = 0; $i < count($lista); $i++) {
            if (!$usuario->insertarPermisos($idusuario, $lista[$i])) {
                $error = "No se pudo modificar el usuario. Intente nuevamente. COD.0x2";
                break;
            }
        }
    }

    if ($error == "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
if ($proceso === "permisosAsignadoCuenta") {
    $usuario = new usuario($con);
    $resultado = $usuario->buscarPermisoUsuario($idusu,$sessionUsuario["empresaADM"]);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







