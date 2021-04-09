<?php

class mensajeGuardado {

    var $id_mensajeGuardado;
    var $detalle;
    var $tipo;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function buscarXtipo($tipo) {
        $consulta = "select * from lasueca.mensajeGuardado where estado like 'activo' and tipo like '$tipo'";
        return $this->CON->consulta2($consulta);
    }
    

}
