<?php

include_once('../Libreria/variables.php');


if ($proceso === "cargarData") {
    $almacen = new almacen($con);
    $usuario = new usuario($con);
    $producto = new producto($con);
    $todosAlmacenes = $usuario->buscarPermisoUsuarioXidpermiso($sessionUsuario["id_usuario"], 207);
    $sucursal_id = "";
    if ($todosAlmacenes === "0") {
        $sucursal_id = $sessionUsuario["sucursal_id"];
    }
    $resultado = array();
    $resultado["almacenes"] = $almacen->buscarXestado($estado, $sucursal_id);
    $resultado["productos"] = $producto->ultimoprecioCompraXproducto($estado);
}
if ($proceso === "imprimirAjuste") {
    $ajuste = new AjusteInventario($con);
    $detalle = new detalleAjusteInventario($con);
    $almacen = new Almacen($con);
    $resultado = array();
    $resultado["ajuste"] = $ajuste->buscarXid($id_Ajuste);
    $resultado["detalle"] = $detalle->buscarXidAjuste($id_Ajuste);
    $resultado["almacen"] = $almacen->buscarXid($resultado["ajuste"]["almacen_id"]);
}
if ($proceso === "buscarAjuste") {
    $resultado = array();
    $ajuste = new AjusteInventario($con);
    $detalleAjuste = new detalleAjusteInventario($con);

    $resultado["ajuste"] = $ajuste->busquedaAccionXidAjuste($idajuste, $tipo);
    if ($resultado["ajuste"]) {
        $resultado["detalle"] = $detalleAjuste->buscarXidAjuste($resultado["ajuste"]["id_ajusteInventario"]);
    }
}
if ($proceso === "eliminarAjuste") {
    $con->transacion();
    $ajuste = new AjusteInventario($con);
    $detalleAjuste = new detalleAjusteInventario($con); // validar no tenga pago proveedor si tiene lnazar un mensaje no se puede eliminar
    if ($ajuste->eliminar($id_Ajuste)) {
        if (!$detalleAjuste->eliminadoLogico($id_Ajuste)) {
            $error = "No se logró  eliminar el registro de compra. Intente nuevamente. COD.0x23";
             $con->rollback();
        }else{
            $con->commit();
        }
    } else {
        $error = "No se logró  eliminar el registro de compra. Intente nuevamente. COD.0x24";
         $con->rollback();
    }
}
if ($proceso === "registrarAjuste") {
    $ajuste = new AjusteInventario($con);
    $con->transacion();
    $fechaactual = date("d/m/Y H:i:s");
    $horaactual = date("H:i:s");
    $info = "";
    $ajuste->contructor($id_AjusteInventario, $nroAjuste, $detalle, "$fecha $horaactual", $fechaactual, $encargado, $sessionUsuario["id_usuario"], $almacen, 'activo', $con->empresa_id);
    if ($id_AjusteInventario === '0') {
        $info = "registrar";
        $nro=$ajuste->obtenerNroDocumento();
        $ajuste->nroDocumento=$nro;
        $id_AjusteInventario = $ajuste->insertar();
        if ($id_AjusteInventario === '0') {
            $error = 'No se logró registrar el ajuste de inventario. Intente Nuevamente COD.0x25';
        }
    } else {
        $info = "modificar";
        if (!$ajuste->modificar()) {
            $error = 'No se logró modificar el ajuste de inventario. Intente Nuevamente COD.0x26';
        } else {
            $detalleAjuste = new detalleAjusteInventario($con);
            if (!$detalleAjuste->eliminarXidAjuste($id_AjusteInventario)) {
                $error = 'No se logró modificar el ajuste de productos. Intente Nuevamente COD.0x26';
            }
        }
    }
    if ($error === '') {
        $lista = $_POST['listaAjuste'];
        for ($i = 0; $i < count($lista); $i++) {
            $aux = $lista[$i];
            $iddetalle = $aux["idDetalle"];
            $detalleAjuste = new detalleAjusteInventario($con);
            $detalleAjuste->contructor($iddetalle, $id_AjusteInventario, $aux['id'], $aux['cant']);
            if (!$detalleAjuste->insertar()) {
                $error = "No se logró $info la compra. Intente Nuevamente COD.0x27";
                break;
            }
        }
    }
    if ($error === "") {
        $resultado = $id_AjusteInventario;
        $con->commit();
    } else {
        $con->rollback();
    }
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







