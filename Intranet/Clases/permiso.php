<?php

class permiso {

    var $id_permiso;
    var $descripcion;
    var $foto;
    var $nombre;
    var $CategoriaPermiso_id;
    var $estado;
    var $permisoPadre;
    var $posicion;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_permiso, $descripcion, $foto, $nombre, $CategoriaPermiso_id) {
        $this->id_permiso = $id_permiso;
        $this->descripcion = $descripcion;
        $this->foto = $foto;
        $this->nombre = $nombre;
        $this->CategoriaPermiso_id = $CategoriaPermiso_id;
    }
    

    function todo($tipo="",$delivery="",$tarifario="") {
        $tipoEmpresa=" and  estado like 'activo' ";
        if($tipo==="ADM"){
            $tipoEmpresa="";
        }
        $tipoDelivery=" and  id_permiso!=221 ";
        if($delivery==="propia"){
            $tipoDelivery="";
        }
        $tipoTarifario=" and  id_permiso!=227 ";
        if($tarifario==="propia"){
            $tipoTarifario="";
        }
        $consulta = "select * from lasueca.permiso where true=true $tipoEmpresa $tipoTarifario  $tipoDelivery order by posicion asc";
        return $this->CON->consulta2($consulta);
    }
    function Categoria($tipo) {
        $tipoEmpresa=" where  estado like 'activo' ";
        if($tipo==="ADM"){
            $tipoEmpresa="";
        }
        $consulta = "select * from lasueca.CategoriaPermiso $tipoEmpresa order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarXID($id) {
        $consulta = "select * from lasueca.permiso where id_permiso=$id";
        $result = $this->CON->consulta($consulta);
        $empresa = $this->rellenar($result);
        if ($empresa == null) {
            return null;
        }
        return $empresa[0];
    }


}
