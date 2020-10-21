<?php

class categoriapermiso {

    var $id_CategoriaPermiso;
    var $nombre;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_CategoriaPermiso, $nombre) {
        $this->id_CategoriaPermiso = $id_CategoriaPermiso;
        $this->nombre = $nombre;
    }

    function todo($tipo) {
        $tipoEmpresa = " where  estado like 'activo' ";
        if ($tipo === "ADM") {
            $tipoEmpresa = "";
        }
        $consulta = "select * from lasueca.categoriapermiso $tipoEmpresa order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

}
