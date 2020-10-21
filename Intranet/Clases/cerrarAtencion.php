<?php

class cerrarAtencion {

    var $id_cerrarAtencion;
    var $fecha;
    var $estado;
    var $usuario_id;
    var $sucursal_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_cerrarAtencion, $fecha, $estado, $usuario_id,$sucursal_id) {
        $this->id_cerrarAtencion= $id_cerrarAtencion;
        $this->fecha=$fecha;
        $this->estado=$estado;
        $this->usuario_id=$usuario_id;
        $this->sucursal_id=$sucursal_id;
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.cerraratencion(id_cerrarAtencion,fecha,estado,usuario_id,sucursal_id)VALUES('$this->id_cerrarAtencion','$this->fecha','$this->estado','$this->usuario_id','$this->sucursal_id')";
        return $this->CON->manipular($consulta);
    }
    function abrir() {
        $fechaactual = date("d/m/Y");
        $consulta = "update lasueca.cerraratencion set estado='inactivo' where sucursal_id=$this->sucursal_id and substring(fecha,1,10) = '$fechaactual' ";
        return $this->CON->manipular($consulta);
    }
    function hoyEstaCerrado($sucursal_id) {
        $consulta = "SELECT count(id_cerrarAtencion) cantidad FROM lasueca.cerraratencion where sucursal_id=$sucursal_id and STR_TO_DATE(fecha,'%e/%c/%Y')=CURDATE() and estado like 'activo'";
        $cantidad= $this->CON->consulta($consulta);
        return $cantidad->fetch_assoc()['cantidad'];
    }
}
