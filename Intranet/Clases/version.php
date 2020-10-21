<?php

class version {

    var $id_version;
    var $nombre;
    var $version;
    var $id;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_version, $nombre, $version, $id) {
        $this->id_version = $id_version;
        $this->nombre = $nombre;
        $this->version = $version;
        $this->id = $id;
    }

    function insertar() {
        $consulta = "delete from lasueca.version where version.nombre='$this->nombre' and id='$this->id'";
        if(!$this->CON->manipular($consulta)){
            return false;
        }
        $consulta = "insert into lasueca.version(id_version, nombre, version,id,empresa_id) values(" . $this->id_version . ",'" . $this->nombre . "'," . $this->version . ",$this->id,".$this->CON->empresa_id.")";
        return $this->CON->manipular($consulta);
    }

}
