<?php

class categoriaapp {

    var $id_categoriaApp;
    var $nombre;
    var $estado;
    var $icono;
    var $color;
    var $posicion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function todas() {
        $consulta = "select * from lasueca.categoriaapp where estado like 'activo' order by posicion asc";
        return $this->CON->consulta2($consulta);
    }
    function categoriaAPPxEmpresa($idempresa) {
        $consulta = "select categoriaApp_id from lasueca.empresacategoriaApp where empresa_id=$idempresa";
        return $this->CON->consulta2($consulta);
    }
    function eliminarCategoriaAPPEmpresa($idempresa) {
        $consulta = "delete from lasueca.empresacategoriaApp where empresa_id=$idempresa";
        return $this->CON->manipular($consulta);
    }
    function insertarCategoriaAPPEmpresa($idempresa,$categoria_id) {
        $consulta = "insert into lasueca.empresacategoriaApp (empresa_id,categoriaApp_id) values ($idempresa,$categoria_id)";
        return $this->CON->manipular($consulta);
    }

}
