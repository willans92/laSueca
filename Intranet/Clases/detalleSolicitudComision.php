<?php

class detalleSolicitudComision {

    var $SolicitudComision_id;
    var $pedido_id;
    var $estado;
    var $montoPago;
    var $tienda_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($SolicitudComision_id, $pedido_id,$estado, $montoPago,$tienda_id) {
        $this->SolicitudComision_id = $SolicitudComision_id;
        $this->pedido_id = $pedido_id;
        $this->estado = $estado;
        $this->montoPago = $montoPago;
        $this->tienda_id = $tienda_id;
    }

    function todas() {
        $consulta = "select * from lasueca.detalleSolicitudComision";
        return $this->CON->consulta2($consulta);
    }
    
    function detalleSolicitudXid($idSolicitud) {
        $consulta = "select p.fechaProgramada,p.totalPedido , c.nombre cliente,d.montoPago comision";
        $consulta .= " from lasueca.detalleSolicitudComision d,lasueca.pedidoapp p, lasueca.clienteapp c";
        $consulta .= " where d.pedido_id=p.id_pedidoApp and p.cliente=c.id_clienteApp";
        $consulta .= " and d.solicitudcomision_id=$idSolicitud";
        return $this->CON->consulta2($consulta);
    }
        
    function insertar() {
        $consulta = "INSERT INTO lasueca.detalleSolicitudComision (SolicitudComision_id,pedido_id,estado,montoPago,tienda_id) VALUES ('$this->SolicitudComision_id','$this->pedido_id','$this->estado','$this->montoPago','$this->tienda_id')";
        return $this->CON->manipular($consulta);
    }
    
    function cambioEstado($id_solicitud,$estado) {
        $consulta = "update lasueca.detalleSolicitudComision set estado='$estado' where SolicitudComision_id=$id_solicitud";
        return $this->CON->manipular($consulta);
    }

}
