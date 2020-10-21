<?php

class pedidoCurrier {

    var $id_pedidoCurrier;
    var $tipo;
    var $detalle;
    var $referenciaOrigen;
    var $contactoOrigen;
    var $telefonoOrigen;
    var $lon;
    var $lat;
    var $referenciaDestino;
    var $contactoDestino;
    var $telefonoDestino;
    var $lon2;
    var $lat2;
    var $estado;
    var $solicitado;
    var $recogido;
    var $entregado;
    var $cancelado;
    var $vuelta;
    var $costo;
    var $clienteApp_id;
    var $delivery_id;
    var $aceptado;
    var $ciudad_id;
    var $descuento;
    var $usuario_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_pedidoCurrier, $tipo, $detalle, $referenciaOrigen, $contactoOrigen, $telefonoOrigen,
            $lon, $lat, $referenciaDestino, $contactoDestino, $telefonoDestino, $lon2, $lat2, $estado, $solicitado,
            $recogido, $entregado, $cancelado, $vuelta, $costo, $clienteApp_id, $delivery_id, $ciudad_id
            , $descuento = 0, $usuario_id = 0) {
        $this->id_pedidoCurrier = $id_pedidoCurrier;
        $this->tipo = $tipo;
        $this->detalle = $detalle;
        $this->referenciaOrigen = $referenciaOrigen;
        $this->ciudad_id = $ciudad_id;
        $this->contactoOrigen = $contactoOrigen;
        $this->telefonoOrigen = $telefonoOrigen;
        $this->lon = $lon;
        $this->lat = $lat;
        $this->referenciaDestino = $referenciaDestino;
        $this->contactoDestino = $contactoDestino;
        $this->telefonoDestino = $telefonoDestino;
        $this->lon2 = $lon2;
        $this->lat2 = $lat2;
        $this->estado = $estado;
        $this->solicitado = $solicitado;
        $this->recogido = $recogido;
        $this->entregado = $entregado;
        $this->cancelado = $cancelado;
        $this->vuelta = $vuelta;
        $this->costo = $costo;
        $this->clienteApp_id = $clienteApp_id;
        $this->delivery_id = $delivery_id;
        $this->descuento = $descuento;
        $this->usuario_id = $usuario_id;
    }

    function todas() {
        $consulta = "select * from lasueca.pedidocurrier";
        return $this->CON->consulta2($consulta);
    }

    function buscarXid($idpedido) {
        $consulta = " select p.*,c.ciudad_id, c.nombre cliente, c.telefono from lasueca.pedidocurrier p, lasueca.clienteapp c where p.clienteApp_id=c.id_clienteApp and id_pedidoCurrier=$idpedido";
        return $this->CON->consulta2($consulta)[0];
    }

    function pedidoEnCurso($iddelivery) {
        $consulta = " select p.*,c.ciudad_id, c.nombre cliente, c.telefono from lasueca.pedidocurrier p, lasueca.clienteapp c where  (p.estado like 'aceptado' or p.estado like 'recogido' or (p.estado like 'entregado' and p.tipo like 'IDA Y VUELTA')) and p.delivery_id=$iddelivery  and p.clienteApp_id=c.id_clienteApp";
        return $this->CON->consulta2($consulta);
    }

    function reporteIngresosDeDelivery($id_delivery, $de, $hasta) {
        $consulta = "select estado, count(id_pedidoCurrier) pedidos, sum(costo) ingresos from pedidoCurrier";
        $consulta .= " where delivery_id=$id_delivery and STR_TO_DATE(solicitado,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by estado";
        return $this->CON->consulta2($consulta);
    }
    
    function insertar() {
        $consulta = "INSERT INTO lasueca.pedidocurrier(id_pedidoCurrier,tipo,detalle,referenciaOrigen,contactoOrigen,telefonoOrigen,lon,lat,referenciaDestino,contactoDestino,telefonoDestino,lon2,lat2,estado,solicitado,recogido,entregado,cancelado,vuelta,costo,clienteApp_id,aceptado,ciudad_id,descuento,usuario_id) VALUES ('$this->id_pedidoCurrier','$this->tipo','$this->detalle','$this->referenciaOrigen','$this->contactoOrigen','$this->telefonoOrigen','$this->lon','$this->lat','$this->referenciaDestino','$this->contactoDestino','$this->telefonoDestino','$this->lon2','$this->lat2','$this->estado','$this->solicitado','$this->recogido','$this->entregado','$this->cancelado','$this->vuelta','$this->costo','$this->clienteApp_id','',$this->ciudad_id,$this->descuento,$this->usuario_id);";
        return $this->CON->manipular($consulta);
    }

    function modificarEstado($id_pedidoCurrier, $estado, $fecha, $delivery_id, $validar = true) {
        if ($validar) {
            $consulta = "select count(id_pedidoCurrier) cantidad from pedidocurrier where id_pedidoCurrier=$id_pedidoCurrier and (delivery_id=0 || delivery_id is null)";
            $resultado = $this->CON->consulta($consulta);
            $disponible = $resultado->fetch_assoc()['cantidad'];
            if ($disponible === 1 || $disponible === "1" || $validar) {
                $consulta = "update lasueca.pedidocurrier set delivery_id='$delivery_id', estado='$estado',$fecha where id_pedidoCurrier=$id_pedidoCurrier";
                return $this->CON->manipular($consulta);
            }
        } else {
            $consulta = "update lasueca.pedidocurrier set estado='$estado',$fecha where id_pedidoCurrier=$id_pedidoCurrier";
            return $this->CON->manipular($consulta);
        }

        return false;
    }

    function modificarLocalizacion($id_pedidoCurrier, $lon, $lat, $lon2, $lat2,$costo,$desc,$usuario_id) {
        $consulta = "update lasueca.pedidocurrier set usuario_id=$usuario_id ,costo=$costo,descuento=$desc,lon='$lon', lat='$lat',lon2='$lon2',lat2='$lat2' where id_pedidoCurrier=$id_pedidoCurrier";
        return $this->CON->manipular($consulta);
    }

    function historialoCurrier($id_cliente, $contador, $cantidad) {
        $consulta .= "select id_pedidoCurrier,tipo,estado,costo,detalle,solicitado from lasueca.pedidocurrier where clienteApp_id=$id_cliente  order by id_pedidoCurrier desc limit $contador,$cantidad";

        $data = $this->CON->consulta2($consulta);
        $consulta = " select count(*) cantidad from lasueca.pedidocurrier where clienteApp_id=$id_cliente";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

}
