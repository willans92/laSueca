<?php

class horarioAtencion {

    var $id_horarioAtencion;
    var $tipo;
    var $horarioDe;
    var $HorarioHasta;
    var $horarioDe2;
    var $HorarioHasta2;
    var $dia;
    var $id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_horarioAtencion,$tipo,$horarioDe,$HorarioHasta,$dia, $id,$horarioDe2,$HorarioHasta2) {
        $this->id_horarioAtencion = $id_horarioAtencion;
        $this->tipo= $tipo;
        $this->horarioDe= $horarioDe;
        $this->HorarioHasta= $HorarioHasta;
        $this->horarioDe2= $horarioDe2;
        $this->HorarioHasta2= $HorarioHasta2;
        $this->dia = $dia;
        $this->id = $id;
    }

    function buscarXid($idSucursal,$tipo) {
        $consulta = "select * from lasueca.horarioAtencion where id=$idSucursal and tipo like '$tipo'";
        return $this->CON->consulta2($consulta);
    }
    
    function eliminarSucursal($idSucursal) {
        $consulta = "delete from lasueca.horarioAtencion where id=$idSucursal and tipo like 'sucursal'";
        return $this->CON->manipular($consulta);
    }
    function eliminarProducto($idProducto) {
        $consulta = "delete from lasueca.horarioAtencion where id=$idProducto and tipo like 'producto'";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.horarioatencion (id_horarioAtencion,tipo,horarioDe,HorarioHasta,dia,id,horarioDe2,HorarioHasta2) VALUES ('$this->id_horarioAtencion','$this->tipo','$this->horarioDe','$this->HorarioHasta','$this->dia','$this->id','$this->horarioDe2','$this->HorarioHasta2');";
        return $this->CON->manipular($consulta);
    }

}
