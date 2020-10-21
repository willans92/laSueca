<?php

class perfil {

    var $id_perfil;
    var $nombre;
    var $detalle;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function todos() {
        $consulta = "select * from lasueca.perfil where empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function buscarPermisoPerfil($idperfil){
         $consulta = "select * from lasueca.Perfil_Permiso where Perfil_id=$idperfil and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function insertar($nombre,$detalle) {
        $consulta = "insert into lasueca.perfil(nombre,detalle,empresa_id)values('$nombre','$detalle',".$this->CON->empresa_id.")";
        if(!$this->CON->manipular($consulta)){
            return 0;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        return $this->CON->consulta2($consulta)[0]["id"];
    }
    function update($nombre,$detalle,$idperfil) {
        $consulta = "update lasueca.perfil set nombre='$nombre',detalle='$detalle' where id_perfil=$idperfil and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function eliminarXPermisos($idperfil) {
        $consulta = "delete from lasueca.Perfil_Permiso where Perfil_id=$idperfil and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function insertarPermisos($idperfil,$idpermisos) {
        $consulta = "insert into lasueca.Perfil_Permiso (Perfil_id,permiso_id) values ($idperfil,$idpermisos)";
        return $this->CON->manipular($consulta);
    }
    
}
