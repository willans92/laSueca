<?php

include_once('../Libreria/variables.php');

if ($proceso === "registrarSucursal") {
    $con->transacion();
    $estado = "";
    $sucursal = new Sucursal($con);
    $sucursal->contructor($id_sucursal, $nombre, $telefono, $nit, $direccion
            , $correo, "", $formDV, $formImpresion, $tpestado, $pais
            , $ciudad, $horarioDe1, $horarioHasta1, $horarioDe2, $horarioHasta2
            , $app, $lon, $lat, $tipoHorario);
    if ($id_sucursal === "0") {
        if (!$sucursal->insertar()) {
            $error = "No se logró registrar la nueva sucursal.Intente nuevamente. COD.0x30";
        } else {
            $id_sucursal = $sucursal->id_sucursal;
        }
    } else {
        if (!$sucursal->modificar()) {
            $error = "No se logró modificar La sucursal.Intente nuevamente. COD.0x31";
        }
    }
    if ($error === "") {
        $urlLogo = $con->base64_to_jpeg($logo, "Sucursal", "s_" . $id_sucursal . "_logo");
        if (!$sucursal->modificarLogo($id_sucursal, $urlLogo)) {
            $error = "No se logró modificar La sucursal.Intente nuevamente. COD.0x31";
        }
        if ($error === "") {
            $con->commit();
        } else {
            $con->rollback();
        }
    } else {
        $con->rollback();
    }
}
if ($proceso === "buscarSucursal") {
    $sucursal = new Sucursal($con);
    $resultado = $sucursal->buscarXestado($estado);
}
if ($proceso === "horarioPersonalizado") {
    $horario = new horarioAtencion($con);
    $resultado = $horario->buscarXid($id_sucursal, 'sucursal');
}
if ($proceso === "ciudades") {
    $ciudad = new ciudad($con);
    $resultado = $ciudad->todo();
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







