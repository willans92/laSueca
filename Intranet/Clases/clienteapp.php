<?php

class clienteapp {

    var $id_clienteApp;
    var $nombre;
    var $telefono;
    var $correo;
    var $nit;
    var $razonSocial;
    var $facebook_id;
    var $tokenFirebase;
    var $ciudad_id;
    var $estado;
    var $foto;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }
    function contructor($id_clienteApp,$nombre,$telefono,$correo,$nit,$razonSocial,$facebook_id,$estado,$ciudad_id,$foto){
        $this->id_clienteApp=$id_clienteApp;
        $this->nombre=$nombre;
        $this->telefono=$telefono;
        $this->correo=$correo;
        $this->nit=$nit;
        $this->razonSocial=$razonSocial;
        $this->facebook_id=$facebook_id;
        $this->ciudad_id=$ciudad_id;
        $this->estado=$estado;
        $this->foto=$foto;
    }
    function buscarXid($idcliente) {
        $consulta = "select * from lasueca.clienteapp where id_clienteApp=$idcliente";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXidFacebook($idfacebook) {
        $consulta = "select * from lasueca.clienteapp where facebook_id=$idfacebook  limit 0,1";
        return $this->CON->consulta2($consulta);
    }
    function buscarXtoken($idcliente) {
        $consulta = "select tokenFirebase from lasueca.clienteapp where id_clienteApp=$idcliente";
        $respuesta=$this->CON->consulta2($consulta);
        $dato=$respuesta[0];
        return $dato["tokenFirebase"];
    }
    function modificarToken($idcliente,$token) {
        $consulta = "update lasueca.clienteapp set tokenFirebase='$token' where id_clienteApp=$idcliente";
        return $this->CON->manipular($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.clienteapp(id_clienteApp,nombre,telefono,correo,nit,razonSocial,facebook_id,estado,ciudad_id,foto,tokenFirebase) VALUES ('$this->id_clienteApp','$this->nombre','$this->telefono','$this->correo','$this->nit','$this->razonSocial','$this->facebook_id','$this->estado','$this->ciudad_id','$this->foto','$this->tokenFirebase');";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_clienteApp = $resultado->fetch_assoc()['id'];
        return true;
    }
    function todo() {
        $consulta = "select * from lasueca.clienteapp ";
        return $this->CON->consulta2($consulta);
    }
    function buscarXciudad($ciudad) {
        $consulta = "select * from lasueca.clienteapp where ciudad_id=$ciudad";
        return $this->CON->consulta2($consulta);
    }

}
