<?php

class DosificacionSucursal {

    var $id_dosificacionSucursal;
    var $sucursal_id;
    var $nroAutorizacion;
    var $fechaLimiteEmision;
    var $tipoFactura;
    var $actividadEconomica;
    var $LlaveDosificacion;
    var $estado ;
    var $creado ;
    var $mensajeImpuesto ;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_dosificacionSucursal, $sucursal_id, $nroAutorizacion, $fechaLimiteEmision, $tipoFactura,  $actividadEconomica, $LlaveDosificacion,$estado,$creado,$mensajeImpuesto) {
        $this->id_dosificacionSucursal = $id_dosificacionSucursal;
        $this->sucursal_id = $sucursal_id;
        $this->LlaveDosificacion = $LlaveDosificacion;
        $this->actividadEconomica = $actividadEconomica;
        $this->nroAutorizacion = $nroAutorizacion;
        $this->fechaLimiteEmision = $fechaLimiteEmision;
        $this->tipoFactura = $tipoFactura;
        $this->estado = $estado;
        $this->creado = $creado;
        $this->mensajeImpuesto = $mensajeImpuesto;
    }

    
    function buscarXestado($estado) {
        $consulta = "select d.*, s.nombre from lasueca.dosificacionsucursal d,lasueca.sucursal s  where d.estado='$estado' and d.sucursal_id=s.id_sucursal and s.empresa_id=".$this->CON->empresa_id." order by STR_TO_DATE(d.fechalimiteemision,'%e/%c/%Y') desc ";
        return $this->CON->consulta2($consulta);
    }
    function buscarXFechaSucursal($idsucursal,$fecha) {
        $consulta = "SELECT * FROM lasueca.dosificacionsucursal where sucursal_id=$idsucursal and estado='activo' and STR_TO_DATE(creado,'%e/%c/%Y') <=STR_TO_DATE('$fecha','%e/%c/%Y') and STR_TO_DATE(fechaLimiteEmision,'%e/%c/%Y') >=STR_TO_DATE('$fecha','%e/%c/%Y')  order by STR_TO_DATE(creado,'%e/%c/%Y') desc limit 0,1 ";
        return $this->CON->consulta2($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.dosificacionsucursal(id_dosificacionSucursal,sucursal_id,nroAutorizacion,fechaLimiteEmision,tipoFactura,actividadEconomica,LlaveDosificacion,estado,creado,mensajeImpuesto) VALUES('$this->id_dosificacionSucursal','$this->sucursal_id','$this->nroAutorizacion','$this->fechaLimiteEmision','$this->tipoFactura','$this->actividadEconomica','$this->LlaveDosificacion','$this->estado','$this->creado','$this->mensajeImpuesto')";
        return $this->CON->manipular($consulta);
    }
    function modificar() {
        $consulta = "UPDATE lasueca.dosificacionsucursal SET mensajeImpuesto='$this->mensajeImpuesto', id_dosificacionSucursal = '$this->id_dosificacionSucursal',sucursal_id = '$this->sucursal_id',nroAutorizacion = '$this->nroAutorizacion',fechaLimiteEmision = '$this->fechaLimiteEmision',tipoFactura = '$this->tipoFactura',actividadEconomica = '$this->actividadEconomica',creado = '$this->creado',LlaveDosificacion = '$this->LlaveDosificacion',estado = '$this->estado' WHERE id_dosificacionSucursal = $this->id_dosificacionSucursal";
        return $this->CON->manipular($consulta);
    }

}
