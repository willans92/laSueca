<?php

include_once('../Libreria/variables.php');


if ($proceso === "buscarMas") {
    $producto = new producto($con);
    $resultado = $producto->nuestrosProductosHome($id_tienda, $txtbusqueda
            , $categoria, $subcategoria, $pibote, 30);
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
            $lista=$_POST["lista"];
            for ($i = 0; $i < count($lista); $i++) {
                $obj=$lista[$i];
                $detalle=new detallePedidoApp($con);
                $detalle->contructor(0, "", $obj["cantidad"], $obj["precio"], "activo", $pedido->id_pedidoApp, $obj["id"]);
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







