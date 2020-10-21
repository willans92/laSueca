<?php

class configuracion {

    var $id_configuracion;
    var $detalle;
    var $tipo;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_empresa,$detalle,$tipo,$estado) {
        $this->id_empresa = $id_empresa;
        $this->detalle = $detalle;
        $this->tipo = $tipo;
        $this->estado = $estado;
    }
   
   
    function todos() {
        $consulta = "select * from lasueca.configuracion where estado like 'activo'";
        return $this->CON->consulta2($consulta);
    }
   
    
}
