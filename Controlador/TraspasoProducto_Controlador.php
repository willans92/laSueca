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
if ($proceso === "imprimirTraspaso") {
    $traspaso = new traspasoProducto($con);
    $detalle = new detalleTraspasoProducto($con);
    $almacen = new Almacen($con);
    $resultado = array();
    $resultado["traspaso"] = $traspaso->buscarXid($id_Traspaso);
    $resultado["detalle"] = $detalle->buscarXidcompra($id_Traspaso);
    $resultado["almacenOrigen"] = $almacen->buscarXid($resultado["traspaso"]["almacenOrigen"]);
    $resultado["almacenFin"] = $almacen->buscarXid($resultado["traspaso"]["almacenDestino"]);
}
if ($proceso === "buscarTraspaso") {
    $resultado = array();
    $traspaso = new traspasoProducto($con);
    $detalleTraspaso = new detalleTraspasoProducto($con);

    $resultado["traspaso"] = $traspaso->busquedaAccionXidTraspaso($idtraspaso, $tipo);
    if ($resultado["traspaso"]) {
        $resultado["detalle"] = $detalleTraspaso->buscarXidcompra($resultado["traspaso"]["id_traspasoProducto"]);
    }
}
if ($proceso === "eliminarTraspaso") {
    $con->transacion();
    $traspaso = new traspasoProducto($con);
    $detalleTraspaso = new detalleTraspasoProducto($con); // validar no tenga pago proveedor si tiene lnazar un mensaje no se puede eliminar
    if ($traspaso->eliminar($id_Traspaso)) {
        if (!$detalleTraspaso->eliminadoLogico($id_Traspaso)) {
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
if ($proceso === "registrarTraspaso") {
    $traspaso = new traspasoProducto($con);
    $con->transacion();
    $fechaactual = date("d/m/Y H:i:s");
    $horaactual = date("H:i:s");
    $info = "";
    $traspaso->contructor($id_traspasoProducto, $nroTraspaso, $detalle, "$fecha $horaactual", $fechaactual, $encargado, $sessionUsuario["id_usuario"], $almacenOrigen, $almacenFin, 'activo', $con->empresa_id);
    if ($id_traspasoProducto === '0') {
        $info = "registrar";
        $nro=$traspaso->obtenerNroDocumento();
        $traspaso->nroDocumento=$nro;
        $id_traspasoProducto = $traspaso->insertar();
        if ($id_traspasoProducto === '0') {
            $error = 'No se logró registrar el traspaso de productos. Intente Nuevamente COD.0x25';
        }
    } else {
        $info = "modificar";
        if (!$traspaso->modificar()) {
            $error = 'No se logró modificar el traspaso de productos. Intente Nuevamente COD.0x26';
        } else {
            $detalleTraspaso = new detalleTraspasoProducto($con);
            if (!$detalleTraspaso->eliminarXidTraspaso($id_traspasoProducto)) {
                $error = 'No se logró modificar el traspaso de productos. Intente Nuevamente COD.0x26';
            }
        }
    }
    if ($error === '') {
        $lista = $_POST['listaTraspaso'];
        for ($i = 0; $i < count($lista); $i++) {
            $aux = $lista[$i];
            $iddetalle = $aux["idDetalle"];
            $detalleTraspaso = new detalleTraspasoProducto($con);
            $detalleTraspaso->contructor($iddetalle, $id_traspasoProducto, $aux['id'], $aux['cant']);
            if (!$detalleTraspaso->insertar()) {
                $error = "No se logró $info la compra. Intente Nuevamente COD.0x27";
                break;
            }
        }
    }
    if ($error === "") {
        $resultado = $id_traspasoProducto;
        $con->commit();
    } else {
        $con->rollback();
    }
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







