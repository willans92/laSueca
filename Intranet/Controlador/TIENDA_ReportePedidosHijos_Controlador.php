

<?php

$tipoSession = "tienda";
include_once('../Libreria/variables.php');

if ($proceso === "buscador") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->buscarPedidoHijo($de, $hasta, $buscador, $sessionUsuario["id_tienda"]);
}
if ($proceso === "solicitarPago") {
    $con->transacion();
    $solicitud=new solicitudComision($con);
    $fechaactual = date("d/m/Y H:i:s");
    $solicitud->contructor(0, $fechaactual, "pendiente", "","" , $sessionUsuario["id_tienda"] , "", $monto,"Comision Hijo",$fechaactual);
    if(!$solicitud->insertar()){
        $error="No se logro procesar la solicitud. Intente nuevamente";
    }else{
        $lista=$_POST["listaPago"];
        for ($i = 0; $i < count($lista); $i++) {
            $id=$lista[$i]["id"];
            $monto=$lista[$i]["monto"];
            $detalle= new detalleSolicitudComision($con);
            $detalle->contructor($solicitud->id_SolicitudComision, $id, "pendiente", $monto,$sessionUsuario["id_tienda"]);
            if(!$detalle->insertar()){
                $error="No se logro procesar la solicitud. Intente nuevamente";
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







