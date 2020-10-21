<?php

include_once('../Libreria/variables.php');


if ($proceso === "reporteVenta") {
    $venta = new venta($con);
    $resultado = $venta->reporteVenta($tipo, $de, $hasta,$sucursal);
}
if ($proceso === "reporteVendedor") {// cliente , vendedor, marca, linea , producto se puede unir en una consulta
    $venta = new venta($con);
    $resultado = $venta->reporteVentaXvendedor( $de, $hasta,$sucursal);
}
if ($proceso === "reporteCliente") {
    $venta = new venta($con);
    $resultado = $venta->reporteVentaXCliente( $de, $hasta,$sucursal);
}
if ($proceso === "reporteProducto") {
    $venta = new venta($con);
    $resultado = $venta->reporteVentaXProducto( $de, $hasta,$sucursal);
}
if ($proceso === "reporteLineaProducto") {
    $venta = new venta($con);
    $resultado = $venta->reporteVentaXLineaProducto( $de, $hasta,$sucursal);
}
if ($proceso === "reporteMarcaProducto") {
    $venta = new venta($con);
    $resultado = $venta->reporteVentaXMarcaProducto( $de, $hasta,$sucursal);
}
if ($proceso === "reporteDetallado") {
    $venta = new venta($con);
    $resultado = $venta->reporteVentaDetallada($de, $hasta);
}
if ($proceso === "inicializar") {
    $resultado = array();
    $linea = new linea_producto($con);
    $marca = new marca($con);
    $resultado["marca"] = $marca->todo();
    $resultado["linea"] = $linea->todo();
}



$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo json_encode($reponse);
} else {
    echo json_encode($reponse);
}







