<?php

include_once('../Libreria/variables.php');

if ($proceso === "configuracion") {
    $datosEmpresa = new empresa($con);
    $configuracion = new configuracion($con);
    $categoriaApp = new categoriaapp($con);
    $resultado = array();
    $resultado["categoriaApp"] = $categoriaApp->todas();
    $resultado["empresacategoriaApp"] = $categoriaApp->categoriaAPPxEmpresa($con->empresa_id);
    $resultado["empresa"] = $datosEmpresa->buscarXid($sessionUsuario["empresa_id"]);
    $resultado["configuracion"] = $configuracion->todos();
    $resultado["configuracionEmpresa"] = $datosEmpresa->configuracionXidempresa();
}
if ($proceso === "registrar") {
    $datosEmpresa = new empresa($con);
    $con->transacion();
    $tarifa=$delivery==="emprendedor"?$delivery:$tarifa;
    $urlLogo = $con->base64_to_jpeg($logo, "Empresa", "e_" . $con->empresa_id . "_logo");
    $datosEmpresa->contructor(0, $nombre, $tpcambio, $fco1
            , $fco2, $fv1, $fv2, $fv3, $fv4, $fc1, $fc2, $fc3, $fc4, 'activo', $online
            , $urlLogo,$onlineFactura,'','','',$delivery,$tarifa);
    if (!$datosEmpresa->modificar()) {
        $error = "No se logró registrar los cambios. COD.0x15";
    } else {
        if (!$datosEmpresa->eliminarFuncionalidad()) {
            $error = "No se logró registrar los cambios. COD.0x16";
        } else {
            $lista = $_POST["lista"];
            for ($i = 0; $i < count($lista); $i++) {
                if (!$datosEmpresa->insertarFuncionalidad($lista[$i])) {
                    $error = "No se logro registrar los cambios. COD.0x17";
                }
            }
        }
    }
    if ($error === "") {
        $categoriaApp = new categoriaapp($con);
        if (!$categoriaApp->eliminarCategoriaAPPEmpresa($con->empresa_id)) {
            $error = "No se logró registrar los cambios. COD.0x32";
        } else {
            $categoria = $_POST["categoria"];
            for ($i = 0; $i < count($categoria); $i++) {
                if (!$categoriaApp->insertarCategoriaAPPEmpresa($con->empresa_id,$categoria[$i])) {
                    $error = "No se logro registrar los cambios. COD.0x33";
                }
            }
        }
    }
    if ($error === "") {
        $con->commit();
        $resultado = array();
        $resultado["empresa"] = $datosEmpresa->buscarXid($sessionUsuario["empresa_id"]);
    } else {
        $con->rollback();
    }
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







