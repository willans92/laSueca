<?php

header("Content-Type: text/html;charset=utf-8");
error_reporting(0);
include_once "../Libreria/CONN.php";
include_once "../Intranet/Clases/catalogoProducto.php";
include_once "../Intranet/Clases/clienteapp.php";
include_once "../Intranet/Clases/producto.php";
include_once "../Intranet/Clases/linea_producto_tienda.php";
include_once "../Intranet/Clases/pedidoApp.php";
include_once "../Intranet/Clases/detallePedidoApp.php";
include_once "../Intranet/Clases/horarioEntrega.php";

$error = "";
$resultado = "";

$con = new CONN(0);
if (!$con->estado) {
    $error = "No se pudo acceder a la base de datos. Intente mas tarde o contactese con el administrador.";
    $reponse = array("error" => $error, "result" => $resultado);
    echo json_encode($reponse);
    return;
}

foreach ($_POST as $nombre_campo => $valor) {
    $data = str_replace("\\", "\\\\\\\\", htmlspecialchars(trim($valor), ENT_QUOTES, "UTF-8"));
    $data = str_replace("\t", " ", $data);
    $asignacion = "\$" . $nombre_campo . "= \"" . $data . "\";";
    eval($asignacion);
}
foreach ($_GET as $nombre_campo => $valor) {
    $data = str_replace("\\", "\\\\\\\\", htmlspecialchars(trim($valor), ENT_QUOTES, "UTF-8"));
    $data = str_replace("\t", " ", $data);
    $asignacion = "\$" . $nombre_campo . "= \"" . $data . "\";";
    eval($asignacion);
}

