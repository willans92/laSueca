<?php

include_once('../Libreria/variables.php');

if ($proceso === "registrarProducto") {//posicionProducto
    $con->transacion();
    $producto = new producto($con);
    $fechaactual = date("d/m/Y");
    if ($generarCodigo === "1" && $idproducto === "0") {
        $empresa = new empresa($con);
        $codigo = $empresa->generarCodigo("producto");
        if ($codigo === -1) {
            $error = "No se logró registrar el producto.Intente nuevamente. COD.0x11";
        }
    }
    $producto->contructor($idproducto, $detalle, $codigo, $fechaactual, "", ""
            , $marca, $linea, $codigoBarra, $nombre, $estado, $app, $posicionProducto, $tipoHorario);
    if ($idproducto === "0") {
        $estado = "registrar";
        if (!$producto->insertar()) {
            $error = "No se logró registrar el producto.Intente nuevamente. COD.0x12";
        } else {
            $idproducto = $producto->id_producto;
            if ($precioVenta !== "0") {
                $precio = new precioVenta($con);
                $precio->contructor(0, $precioVenta, $fechaactual, $idproducto, $sessionUsuario["id_usuario"],$comision);
                if (!$precio->insertar()) {
                    $error = 'No se logró registrar el precio de venta. Intente nuevamente.';
                }
            }
        }
    } else {
        $estado = "modificar";
        if (!$producto->modificar($idproducto)) {
            $error = "No se logró modificar el producto.Intente nuevamente. COD.0x13";
        }
    }
    if ($error === "") {
        $version = new version($con);
        $ultVersion = $producto->ultimaVersion();
        $version->contructor(0, "producto", $ultVersion, $idproducto);
        if (!$version->insertar()) {
            $error = "No se logró $estado el producto.Intente nuevamente. COD.0x14";
        }
    }
    if ($error === "") {
        $urlLogo = $con->base64_to_jpeg($foto, "Producto", "p_" . $idproducto . "_foto");
        if (!$producto->modificarFoto($idproducto, $urlLogo)) {
            $error = "No se logró modificar el producto.Intente nuevamente. COD.0x31";
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
if ($proceso === "iniciar") {
    $resultado = array();
    $linea = new linea_producto($con);
    $marca = new marca($con);
    $resultado["marca"] = $marca->todo();
    $resultado["linea"] = $linea->todo();
}
if ($proceso === "linea") {
    $linea = new linea_producto($con);
    if ($idlinea == "0") {
        if (!$linea->insertar($nombre, $posicion)) {
            $error = "No se logró registrar la nueva línea. COD.0x7";
        }
    } else {
        if (!$linea->modificar($idlinea, $nombre, $posicion)) {
            $error = "No se logró registrar la nueva línea. COD.0x8";
        }
    }
}
if ($proceso === "marca") {
    $marca = new marca($con);
    if ($idmarca == "0") {
        if (!$marca->insertar($nombre)) {
            $error = "No se logró registrar la nueva marca. COD.0x9";
        }
    } else {
        if (!$marca->modificar($idmarca, $nombre)) {
            $error = "No se logró registrar la nueva marca. COD.0x10";
        }
    }
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







