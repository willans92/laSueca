<?php

include_once('../Libreria/variables.php');

if ($proceso === "iniciar") {
    $resultado = array();
    $linea = new linea_producto($con);
    $categoria = new catalogoProducto($con);
    $producto= new producto($con);
    $resultado["categoria"] = $categoria->buscarTienda();
    $resultado["linea"] = $linea->todo();
}
if ($proceso === "buscarProducto") {
    $sessionUsuario = $_SESSION["tienda"];
    $produco = new producto($con);
    $resultado = $produco->productoTienda($sessionUsuario["id_tienda"],$linea,$categoria,$text,$contador);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







