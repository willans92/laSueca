<?php
require '../vendor/autoload.php';
use Twilio\Rest\Client;
include_once('../Libreria/variables.php');


if ($proceso === "buscarMas") {
    $producto = new producto($con);
    $resultado = $producto->nuestrosProductosHome($id_tienda, $txtbusqueda
            , $categoria, $subcategoria, $pibote, 30);
}
if ($proceso === "enviarSms") {
    $account_sid = 'ATn3GzC4AWgNah5AWjodngzkSeUoV8gL9F';
    $auth_token = 'ATn3GzC4AWgNah5AWjodngzkSeUoV8gL9F';
    $twilio_number = "+19547154120";
    $client2 = new Client($account_sid, $auth_token);
    $codigoGenerado="123456";
    try {
        $client2->messages->create(
            '+591'.$telefono,
            array(
                'from' => $twilio_number,
                'body' => $codigoGenerado
            )
        ); 
        $resultado =$codigoGenerado;
    } catch (\Throwable $th) {
       $error="No se logro enviar el codigo. Intente mas tarde";
    }
    
}
if ($proceso === "horarioDisponible") {
    $horario = new horarioEntrega($con);
    $resultado = $horario->horarioDisponiblexFecha($fecha);
}
if ($proceso === "horarioDiaSemana") {
    $horario = new horarioEntrega($con);
    $resultado=array();
    $resultado["horario"] = $horario->horarioDisponiblexFecha($fecha);
    $resultado["semana"] = $horario->horarioDiaSemana();
}
if ($proceso === "verPedido") {
    $pedido = new pedidoApp($con);
    $detalle=new detallePedidoApp($con);
    $resultado = array();
    $resultado["pedido"] = $pedido->buscarXid($id_pedido);
    $resultado["detalle"] = $detalle->buscarxIdpedido($id_pedido);
}
if ($proceso === "verificarCodigo") {
    $pedido = new pedidoApp($con);
    $resultado = $pedido->verificarIdpedido($codigo);
    if($resultado!="0"){
        $resultado=str_replace("LS","",$codigo);
    }
}
if ($proceso === "registrarPedido") {
    $con->transacion();
    $pedido = new pedidoApp($con);
    $fechaactual = date("d/m/Y H:i:s");
    $cliente=new clienteapp(($con));
    $cliente->contructor(0, $nombre, $telefono, "", "", "", 0, "activo", 1, "");
    $buscarXtelefono=$cliente->existeTelefono($telefono);
    if(count($buscarXtelefono)==0){
        if(!$cliente->insertar()){
            $error="No se logro realizar el pedido. Intente Nuevamente.";
        }
    }else{
        $cliente->id_clienteApp=$buscarXtelefono[0]["id_clienteApp"];
        if(!$cliente->modificar()){
            $error="No se logro realizar el pedido. Intente Nuevamente.";
        }
    }
    if($error===""){
        $pedido->contructor(0, $fechaactual,"", "", "" , 0, "pendiente", "", $costoDelivery, $totalFinal
                , $sucursal, $cliente->id_clienteApp, 0 , 0, "","" /*$llamarMoto*/
                , "", "", "", 0, 0, $metodoPago, $fechaEntrega, $hora
                , $id_tienda, $direccion, $lon, $lat,$intrucciones);
        if(!$pedido->insertar()){
             $error="No se logro realizar el pedido. Intente Nuevamente.";    
        }else{
            $resultado=$pedido->id_pedidoApp;
            $lista=$_POST["lista"];
            for ($i = 0; $i < count($lista); $i++) {
                $obj=$lista[$i];
                $detalle=new detallePedidoApp($con);//$obj["comision"]
                $detalle->contructor(0, "", $obj["cantidad"], $obj["precio"], "activo", $pedido->id_pedidoApp, $obj["id"], 1);
                if(!$detalle->insertar()){
                    $error="No se logro realizar el pedido. Intente Nuevamente."; 
                    break;
                }
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







