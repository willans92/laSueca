<?php

include_once('../Libreria/variables.php');


if ($proceso === "cargarData") {
    $almacen = new almacen($con);
    $usuario = new usuario($con);
    $provedor = new Provedor($con);
    $producto = new producto($con);
    $todosAlmacenes=$usuario->buscarPermisoUsuarioXidpermiso($sessionUsuario["id_usuario"],177);
    $sucursal_id="";
    if($todosAlmacenes==="0"){
        $sucursal_id=$sessionUsuario["sucursal_id"];
    }
    $resultado = array();
    $resultado["almacenes"] = $almacen->buscarXestado($estado,$sucursal_id);
    $resultado["provedores"] = $provedor->buscarParaCompra($estado);
    $resultado["productos"] = $producto->ultimoprecioCompraXproducto($estado);
}
if ($proceso === "imprimirCompra") {
    $compra = new compra($con);
    $detalle = new detalleCompra($con);
    $almacen = new Almacen($con);
    $sucursal = new Sucursal($con);
    $resultado = array();
    $resultado["compra"] = $compra->buscarXid($id_Compra);
    $resultado["detalle"] = $detalle->buscarXidcompra($id_Compra);
    $resultado["almacen"] = $almacen->buscarXid($resultado["compra"]["almacen_id"]);
}
if ($proceso === "buscarCompra") {
    $resultado = array();
    $compra = new Compra($con);
    $detalleCompra = new detalleCompra($con);
    
    $usuario = new usuario($con);
    $todosAlmacenes=$usuario->buscarPermisoUsuarioXidpermiso($sessionUsuario["id_usuario"],177);
    $sucursal_id="";
    if($todosAlmacenes==="0"){
        $sucursal_id=$sessionUsuario["sucursal_id"];
    }
    
    $resultado["compra"] = $compra->busquedaAccionXidCompra($idcompra,$tipo,$sucursal_id);
    if($resultado["compra"]){
        $resultado["detalle"] = $detalleCompra->buscarXidcompra($resultado["compra"]["id_compra"]);
    }
}
if ($proceso === "eliminarCompra") {
    $con->transacion();
    $compra = new Compra($con);
    $detalleCompra = new detalleCompra($con);// validar no tenga pago proveedor si tiene lnazar un mensaje no se puede eliminar
     if($compra->eliminar($id_Compra)){
        if(!$detalleCompra->eliminadoLogico($id_Compra)){
            $error="No se logró  eliminar el registro de compra. Intente nuevamente. COD.0x23";
            $con->rollback();
        }else{
            $con->commit();
        }
    }else{
        $error="No se logró  eliminar el registro de compra. Intente nuevamente. COD.0x24";
        $con->rollback();
    }
}
if ($proceso === "registrarCompra") {
    $compra = new Compra($con);
    $con->transacion();
    $fechaactual = date("d/m/Y H:i:s");
    $horaactual = date("H:i:s");
    $info = "";
    $compra->contructor($id_compra, "$fecha $horaactual", $detalle, $nroFactura, $nroAutorizacion, $tpdoc, $fechaactual, $tppago, $sessionUsuario["id_usuario"], $encargado, $almacen, $provedor, $tpcambio,$codigoControl,'activo');
    if ($id_compra === '0') {
        if ($tpdoc==="Compra Facturada" && $compra->existeNroAutorizacionYFactura($nroAutorizacion, $nroFactura)) {
            $error = 'Ya se ha registrado el nro de factura.';
        } else {
            $info = "registrar";
            $id_compra = $compra->insertar();
            if ($id_compra === '0') {
                $error = 'No se logró registrar la compra. Intente Nuevamente COD.0x25';
            }
        }
    } else {
        $info = "modificar";
        if (!$compra->modificar()) {
            $error = 'No se logró modificar la compra. Intente Nuevamente COD.0x26';
        }
    }
    if ($error === '') {
        $lista = $_POST['listaCompra'];
        $eliminacion="";
        for ($i = 0; $i < count($lista); $i++) {
            $aux = $lista[$i];
            $iddetalle = $aux["idDetalle"];
            $detalleCompra = new detalleCompra($con);
            $detalleCompra->contructor(0, $aux['cant'], $aux['precio'], $id_compra, $almacen, $aux['id'], $fechaactual, "$fecha $horaactual",'activo');
            if ($iddetalle === "0") {
                if (!$detalleCompra->insertar()) {
                    $error = "No se logró $info la compra. Intente Nuevamente COD.0x27";
                    break;
                }
                $eliminacion.=$detalleCompra->id_detalleCompra.",";
                
                if($aux["nroLote"]!=""){
                    $lote=new lotemercaderia($con);
                    $lote->contructor(0, $aux["nroLote"], $aux["vencimiento"],'activo', $aux['cant'], $fechaactual, $sessionUsuario["id_usuario"], $sessionUsuario["id_usuario"], $fechaactual, $detalleCompra->id_detalleCompra);
                    if(!$lote->insertar()){
                        $error = "No se logró $info la compra. Intente Nuevamente COD.0x28";
                    }    
                }
            } else {
                $eliminacion.="$iddetalle,";
                if (!$detalleCompra->modificar($iddetalle)) {
                    $error = "No se logró $info la compra. Intente Nuevamente COD.0x29";
                    break;
                }
            }
            
        }
        if ($eliminacion!="") {
            $eliminacion=substr($eliminacion,0,strlen($eliminacion)-1);
            if (!$detalleCompra->eliminarXidDetalleCompra($id_compra,$eliminacion)) {
                $error = "No se logró modificar ya que la compra ya cuenta con ventas relacionadas.";
            }
        }
    }
    if ($error === "") {
        $resultado = $id_compra;
        $con->commit();
    } else {
        $con->rollback();
    }
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







