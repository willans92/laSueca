<?php

class solicitudComision {

    var $id_SolicitudComision;
    var $solicitado;
    var $estado;
    var $nroDocumento;
    var $fechaPagado;
    var $id_tienda;
    var $actualizadoPor;
    var $montoPago;
    var $tipoPago;
    var $fechaActualizado;
    var $motivo;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_SolicitudComision, $solicitado, $estado, $nroDocumento, $fechaPagado, $id_tienda, $actualizadoPor, $montoPago,$tipoPago,$fechaActualizado,$motivo="") {
        $this->id_SolicitudComision = $id_SolicitudComision;
        $this->solicitado = $solicitado;
        $this->estado = $estado;
        $this->nroDocumento = $nroDocumento;
        $this->fechaPagado = $fechaPagado;
        $this->id_tienda = $id_tienda;
        $this->actualizadoPor = $actualizadoPor;
        $this->montoPago = $montoPago;
        $this->tipoPago = $tipoPago;
        $this->fechaActualizado = $fechaActualizado;
    }

    function buscarSolicitudes($estado,$tienda,$de,$hasta) {
        $fechas="";
        if($estado!="pendiente"){
            $fechas=" and STR_TO_DATE(s.solicitado,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y') ";    
        }
        $tiendaSrt="";
        if($tienda!="0"){
            $tiendaSrt=" and s.id_tienda=$tienda ";    
        }
        $consulta = "SELECT s.motivo,s.id_SolicitudComision,s.solicitado,s.nroDocumento,s.fechaPagado,s.montoPago,t.nombre tienda,s.tipoPago,t.banco, t.cuentaBancaria, t.moneda, t.nombreCuenta ";
        $consulta .= " FROM lasueca.solicitudcomision s , lasueca.tienda t";
        $consulta .= " where s.estado like '$estado' $tiendaSrt $fechas and s.id_tienda=t.id_tienda";
        return $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.solicitudcomision (id_SolicitudComision,solicitado,estado,nroDocumento,id_tienda,montoPago,tipoPago,fechaActualizado,motivo) VALUES ('$this->id_SolicitudComision','$this->solicitado','$this->estado','$this->nroDocumento','$this->id_tienda','$this->montoPago','$this->tipoPago','$this->fechaActualizado','')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_SolicitudComision = $resultado->fetch_assoc()['id'];
        return true;
    }
    
    function cambioEstado($id_solicitud,$fecha,$nroTrans,$estado,$fechaActualizado,$id_usuario,$motivo="") {
        $consulta = "update lasueca.solicitudcomision set motivo='$motivo',fechaActualizado='$fechaActualizado',actualizadoPor='$id_usuario',estado='$estado',fechaPagado='$fecha' ,nroDocumento='$nroTrans' where id_SolicitudComision='$id_solicitud'";
        return $this->CON->manipular($consulta);
    }

}