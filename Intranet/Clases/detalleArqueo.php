<?php

class detalleArqueo {

    var $arqueo_id;
    var $cobranza_id;
    var $monto;
    var $CON;

    
    function __construct($con) {
        $this->CON = $con;
    }
    

    function contructor($arqueo_id,$cobranza_id,$monto) {
        $this->arqueo_id = $arqueo_id;
        $this->cobranza_id = $cobranza_id;
        $this->monto = $monto;
    }

    function buscarXidCobranza($idcobranza) {
        $consulta = "select d.*,v.cliente_id,v.fecha fechaFacturacion ,if(v.tipoDocumento='Factura',CONCAT('VF-',v.nroDocumento),CONCAT('NV-',v.nroNota)) nroDocVenta from lasueca.detallecobranza d, lasueca.venta v  where cobranza_id=$idcobranza and d.venta_id=v.id_venta";
        return $this->CON->consulta2($consulta);
    }
    
    function eliminar($id_arqueo) {
        $consulta = "delete from lasueca.detalleArqueo where arqueo_id=" . $id_arqueo;
        return $this->CON->manipular($consulta);
    }
    
    function insertar() {
        $consulta = "insert into lasueca.detallecobranza (arqueo_id,cobranza_id,monto) values ('$this->arqueo_id','$this->cobranza_id','$this->monto')";
        return $this->CON->manipular($consulta);
    }
    
}
