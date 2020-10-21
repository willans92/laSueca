<?php

class ciudad {

    var $id_ciudad;
    var $nombre;
    var $lon;
    var $lat;
    var $estado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function todo() {
        $consulta = "select * from lasueca.ciudad where estado like 'activo'";
        return $this->CON->consulta2($consulta);
    }
    function todoOption() {
        $consulta = "select id_ciudad,nombre from lasueca.ciudad ";
        return $this->CON->consulta2($consulta);
    }

}
