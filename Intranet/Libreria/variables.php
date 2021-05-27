<?php

header("Content-Type: text/html;charset=utf-8");
error_reporting(0);
include_once "../Libreria/CONN.php";
include_once "../Clases/empresa.php";
include_once "../Clases/arqueo.php";
include_once "../Clases/detalleArqueo.php";
include_once "../Clases/mensajeGuardado.php";
include_once "../Clases/horarioEntrega.php";
include_once "../Clases/prestamo.php";
include_once "../Clases/solicitudComision.php";
include_once "../Clases/detalleSolicitudComision.php";
include_once "../Clases/linea_producto_tienda.php";
include_once "../Clases/planPrestamo.php";
include_once "../Clases/tienda.php";
include_once "../Clases/categoriaProducto_linea.php";
include_once "../Clases/catalogoProducto.php";
include_once "../Clases/horarioAtencion.php";
include_once "../Clases/tarifarioApp.php";
include_once "../Clases/pedidoCurrier.php";
include_once "../Clases/delivery.php";
include_once "../Clases/clienteapp.php";
include_once "../Clases/pedidoApp.php";
include_once "../Clases/precioVenta.php";
include_once "../Clases/categoriapermiso.php";
include_once "../Clases/usuario.php";
include_once "../Clases/detallePedidoApp.php";
include_once "../Clases/Perfil.php";
include_once "../Clases/ciudad.php";
include_once "../Clases/categoriaapp.php";
include_once "../Clases/linea_producto.php";
include_once "../Clases/marca.php";
include_once "../Clases/version.php";
include_once "../Clases/permiso.php";
include_once "../Clases/Provedor.php";
include_once "../Clases/producto.php";
include_once "../Clases/Sucursal.php";
include_once "../Clases/almacen.php";
include_once "../Clases/cliente.php";
include_once "../Clases/Compra.php";
include_once "../Clases/detalleCompra.php";
include_once "../Clases/DosificacionSucursal.php";
include_once "../Clases/Cliente.php";
include_once "../Clases/venta.php";
include_once "../Clases/detalleventa.php";
include_once "../Clases/cobranza.php";
include_once "../Clases/detalleCobranza.php";
include_once "../Clases/loteMercaderia.php";
include_once "../Clases/configuracion.php";
include_once "../Clases/traspasoProducto.php";
include_once "../Clases/detalleTraspasoProducto.php";
include_once "../Clases/ajusteInventario.php";
include_once "../Clases/detalleAjusteInventario.php";

$error = "";
$resultado = "";

session_start();
if (empty($activar)) {
    if (isset($_COOKIE["PHPSESSID"])) {
        $tipoSession=$tipoSession?$tipoSession:"usuario";
        $sessionUsuario = $_SESSION[$tipoSession];
        $has_session = session_status() == PHP_SESSION_ACTIVE;
        if ($sessionUsuario == null || !$has_session) {
            $error = "Error Session";
            $proceso = "Error Session";
            $reponse = array("error" => $error, "result" => $resultado);
            echo json_encode($reponse);
            return;
        }
    }else{
        $error = "Error Session";
        $proceso = "Error Session";
        $reponse = array("error" => $error, "result" => $resultado);
        echo json_encode($reponse);
        return;
    }
}
$empId=$sessionUsuario?$sessionUsuario["empresa_id"]:0;
$con = new CONN($sessionUsuario["empresa_id"]);
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

