<?php

class detalleCobranza {

    var $id_detalleCobranza;
    var $cobranza_id;
    var $venta_id;
    var $monto;
    var $detalle;
    var $estado;
    var $CON;

    
    function __construct($con) {
        $this->CON = $con;
    }
    

    function contructor($id_detalleCobranza,$cobranza_id,$venta_id,$monto,$detalle,$estado) {
        $this->id_detalleCobranza = $id_detalleCobranza;
        $this->cobranza_id = $cobranza_id;
        $this->venta_id = $venta_id;
        $this->monto = $monto;
        $this->detalle = $detalle;
        $this->estado = $estado;
    }

    function buscarXidCobranza($idcobranza) {
        $consulta = "select d.*,v.cliente_id,v.fecha fechaFacturacion ,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocVenta from lasueca.detallecobranza d, lasueca.venta v  where cobranza_id=$idcobranza and d.venta_id=v.id_venta";
        return $this->CON->consulta2($consulta);
    }
    
    
    function buscarXidVenta($idVenta) {
        $consulta = "select c.fecha,d.detalle,d.monto,u.nombre from detallecobranza d, cobranza c,usuario u where  c.empresa_id=".$this->CON->empresa_id." and d.venta_id=$idVenta and d.cobranza_id=c.id_cobranza and u.id_usuario=c.cobradoPor and c.estado like 'activo'";
        return $this->CON->consulta2($consulta);
    }
    
    function eliminar($id_cobranza) {
        $consulta = "delete from lasueca.detallecobranza where cobranza_id=" . $id_cobranza;
        return $this->CON->manipular($consulta);
    }
    function eliminadoLogico($id_cobranza) {
        $consulta = "update lasueca.detallecobranza set estado='inactivo' where cobranza_id=" . $id_cobranza;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into lasueca.detallecobranza (id_detalleCobranza,cobranza_id,venta_id,monto,detalle,estado) values ('$this->id_detalleCobranza','$this->cobranza_id','$this->venta_id','$this->monto','$this->detalle','$this->estado')";
        return $this->CON->manipular($consulta);
    }
    
}
