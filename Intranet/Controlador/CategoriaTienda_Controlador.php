<?php

include_once('../Libreria/variables.php');

if ($proceso === "linea") {
    $linea = new linea_producto($con);
    $resultado = $linea->lineaNroProducto();
}
if ($proceso === "buscarXtext") {
    $categoria = new catalogoProducto($con);
    $catalogoLinea=new categoriaProducto_linea($con);
    $resultado= array();
    $resultado["categoria"] = $categoria->buscarXtext($text,$estado);
    $resultado["linea"] = $catalogoLinea->buscarXTexto($text,$estado);
}
if ($proceso === "registrar") {
    $con->transacion();
    $categoria = new catalogoProducto($con);
    $categoria->contructor($categoria_id, $nombre, $estado, $foto,$tipo,$posicion);
    if ($categoria_id == "0") {
        if (!$categoria->insertar()) {
            $error = "No se logro registra. Intente nuevamente";
        }
    } else {
         if (!$categoria->modificar()) {
            $error = "No se logro modificar. Intente nuevamente";
        }else{
            $catalogoLinea=new categoriaProducto_linea($con);
            if(!$catalogoLinea->eliminarxCategoria($categoria_id)){
                $error = "No se logro modificar. Intente nuevamente";
            }
        }
    }
    if ($error === "") {
        $urlLogo = $con->base64_to_jpeg($foto, "Categoria", "p_" . $categoria->id_categoriaProducto . "_foto");
        if (!$categoria->modificarFoto($categoria->id_categoriaProducto, $urlLogo)) {
            $error = "ocurrio un problema al registrar la foto. Intente nuevamente";
        }else{
            $linea=$_POST["Listalinea"];
            for ($i = 0; $i < count($linea); $i++) {
                $catalogoLinea=new categoriaProducto_linea($con);
                if(!$catalogoLinea->insertar($categoria->id_categoriaProducto, $linea[$i])){
                    $error = "ocurrio un problema al registrar la lineas. Intente nuevamente";
                    break;
                }
            }
        }
        if ($error === "") {
            $con->commit();
        }else{
            $con->rollback();
        }
    } else {
        $con->rollback();
    }
}


$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
echo json_encode($reponse);







