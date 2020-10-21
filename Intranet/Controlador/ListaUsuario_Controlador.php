<?php

include_once('../Libreria/variables.php');

if ($proceso === "ciudades") {
    $ciudad = new ciudad($con);
    $resultado = $ciudad->todo();
}
if ($proceso === "registrar") {
    $con->transacion();
    $usuario = new usuario($con);
    $fechaactual = date("d/m/Y H:i:s");
    if ($cuenta === "") {
        $contrasena = "";
    }
    if ($cuenta!=="" && $usuario->existecuenta($cuenta, $usuario_id) !== "0") {
        $error = "La cuenta ya se encuentra ocupada. COD.0x5";
    } else {
        $usuario->contructor($usuario_id, $cuenta, $contrasena, $nombre, $ci, $telefono, "../Imagen/ICONOS/cliente.svg", $estado, $sucursal, $fechaactual, $fecha_contratado, $direccion, '', 'perfil',$ciudad);
        $estado = "modificar";
        if ($usuario_id === "0") {
            $estado = "registrar";
            if (!$usuario->insertar()) {
                $error = "No se logró  registrar al usuario. COD.0x3";
            } else {
                $usuario_id = $usuario->id_usuario;
            }
        } else {
            if (!$usuario->modificar($cliente_id)) {
                $error = "No se logró  modificar al usuario. COD.0x4";
            }
        }
    }
    if ($error === "") {
        $version = new version($con);
        $ultVersion = $usuario->ultimaVersion();
        $version->contructor(0, "usuario", $ultVersion, $usuario_id);
        if (!$version->insertar()) {
            $error = "No se logró $estado al usuario.Intente nuevamente. COD.0x6";
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







