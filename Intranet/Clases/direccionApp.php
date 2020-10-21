<?php

class direccionApp {

    var $id_direccionApp;
    var $alias;
    var $telefono;
    var $direccion;
    var $referencia;
    var $ciudad_id;
    var $lon;
    var $lat;
    var $clienteApp_id;
    var $estado;
    var $seleccionado;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }
    function contructor($id_direccionApp, $alias, $telefono, $direccion, $referencia, $ciudad_id, $lon,$lat, $estado,$clienteApp_id){
        $this->id_direccionApp=$id_direccionApp;
        $this->alias=$alias;
        $this->telefono=$telefono;
        $this->direccion=$direccion;
        $this->referencia=$referencia;
        $this->ciudad_id=$ciudad_id;
        $this->lon=$lon;
        $this->lat=$lat;
        $this->estado=$estado;
        $this->clienteApp_id=$clienteApp_id;
    }
    function seleccionarOtraDireccion($clienteApp_id,$direccion_id){
        $consulta="update direccionapp set seleccionado=0 where clienteApp_id=$clienteApp_id";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta="update direccionapp set seleccionado=1 where id_direccionApp=$direccion_id";
        return $this->CON->manipular($consulta);
    }
    function insertar() {
        $consulta="update direccionapp set seleccionado=0 where clienteApp_id=$this->clienteApp_id";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "INSERT INTO lasueca.direccionapp (id_direccionApp,alias,telefono,direccion,referencia,lon,lat,estado,ciudad_id,clienteApp_id,seleccionado) VALUES ('$this->id_direccionApp','$this->alias','$this->telefono','$this->direccion','$this->referencia','$this->lon','$this->lat','$this->estado','$this->ciudad_id','$this->clienteApp_id',1);";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_direccionApp = $resultado->fetch_assoc()['id'];
        return true;
    }
    function modificar() {
        $consulta = "UPDATE lasueca.direccionapp SET alias = '$this->alias',telefono = '$this->telefono',direccion = '$this->direccion',referencia = '$this->referencia',lon = '$this->lon',lat = '$this->lat',ciudad_id = '$this->ciudad_id' WHERE id_direccionApp = $this->id_direccionApp";
        return $this->CON->manipular($consulta);
    }
    function eliminar($id_direccion) {
        $consulta = "UPDATE lasueca.direccionapp SET estado = 'inactivo' WHERE id_direccionApp = $id_direccion";
        return $this->CON->manipular($consulta);
    }
    function todo() {
        $consulta = "select * from lasueca.direccionapp where estado like 'activo'";
        return $this->CON->consulta2($consulta);
    }
    function buscarXidCliente($id) {
        $consulta = "select * from lasueca.direccionapp where estado like 'activo' and clienteApp_id=$id order by id_direccionApp desc";
        return $this->CON->consulta2($consulta);
    }
    function buscarXid($id) {
        $consulta = "select * from lasueca.direccionapp where id_direccionApp=$id order by id_direccionApp desc";
        return $this->CON->consulta2($consulta)[0];
    }

}
