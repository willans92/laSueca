

<?php

include_once('../Libreria/variables.php');

if ($proceso === "iniciar") {
    $catalogoProducto = new catalogoProducto($con);
    $subcategoria = new categoriaProducto_linea($con);
    $linea_producto_tienda = new linea_producto_tienda($con);
    $resultado = array();
    $resultado["categoria"] = $catalogoProducto->buscarTienda();
    $resultado["subcategoria"] = $subcategoria->subCategoriaTienda();
    $sessionUsuario = $_SESSION["tienda"];
    $resultado["tienda"] = $linea_producto_tienda->buscarXtienda($sessionUsuario["id_tienda"]);
}
if ($proceso === "registrar") {
    $con->transacion();
    $sessionUsuario = $_SESSION["tienda"];
    $linea_producto_tienda = new linea_producto_tienda($con);
    if (!$linea_producto_tienda->eliminarxCategoria($sessionUsuario["id_tienda"])) {
        $error = "No se logro registra. Intente nuevamente";
    }else{
        $lista=$_POST["Listalinea"];
        for ($i = 0; $i < count($lista); $i++) {
            if (!$linea_producto_tienda->insertar($sessionUsuario["id_tienda"],$lista[$i])) {
                $error = "No se logro registra. Intente nuevamente";
                break;
            }
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







