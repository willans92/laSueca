<?php

class SolicitudComision {

    var $id_provedor;
    var $nombre;
    var $razonsocial;
    var $nit;
    var $direccion;
    var $telefono;
    var $email;
    var $personaContacto;
    var $numeroPersonaContacto;
    var $estado;
    var $formaPago;
    var $tipoDocumento;
    var $fechaActualizacion;
    var $usuarioActualizacion_id;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_provedor, $nombre, $razonsocial, $nit, $direccion, $telefono, $email, $personaContacto, $numeroPersonaContacto, $formaPago, $estado, $tipoDocumento, $fechaActualizacion,$usuarioActualizacion_id) {
        $this->id_provedor = $id_provedor;
        $this->nombre = $nombre;
        $this->razonsocial = $razonsocial;
        $this->email = $email;
        $this->personaContacto = $personaContacto;
        $this->nit = $nit;
        $this->direccion = $direccion;
        $this->telefono = $telefono;
        $this->numeroPersonaContacto = $numeroPersonaContacto;
        $this->estado = $estado;
        $this->formaPago = $formaPago;
        $this->tipoDocumento = $tipoDocumento;
        $this->fechaActualizacion = $fechaActualizacion;
        $this->usuarioActualizacion_id= $usuarioActualizacion_id;
    }

    function buscarXestado($estado) {
        $consulta = "select * from solded.provedor where estado='$estado' and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function buscarParaCompra($estado) {
        $est="";
        if($estado!==""){
            $est=" and p.estado like '$estado'  ";
        }
        $consulta = "select formaPago,tipoDocumento,id_provedor,nombre,nit, direccion , IFNULL((SELECT Autorizacion FROM solded.compra where provedor_id=p.id_provedor  and tipo='Compra Facturada' order by STR_TO_DATE(fecha,'%e/%c/%Y') desc  limit 0,1 ),0) as autorizacion from solded.provedor p where  empresa_id=".$this->CON->empresa_id." $est";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE solded.provedor SET usuarioActualizacion_id='$this->usuarioActualizacion_id' ,nombre = '$this->nombre', razonsocial = '$this->razonsocial',nit = '$this->nit',direccion = '$this->direccion',telefono = '$this->telefono',email = '$this->email',personaContacto = '$this->personaContacto',numeroPersonaContacto = '$this->numeroPersonaContacto',estado = '$this->estado',formaPago = '$this->formaPago',tipoDocumento = '$this->tipoDocumento',fechaActualizacion = '$this->fechaActualizacion' WHERE id_provedor = $this->id_provedor and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO solded.provedor (id_provedor,nombre,razonsocial,nit,direccion,telefono,email,personaContacto,numeroPersonaContacto,estado,formaPago,tipoDocumento,fechaActualizacion,usuarioActualizacion_id,empresa_id) VALUES($this->id_provedor,'$this->nombre','$this->razonsocial','$this->nit','$this->direccion','$this->telefono','$this->email','$this->personaContacto','$this->numeroPersonaContacto','$this->estado','$this->formaPago','$this->tipoDocumento','$this->fechaActualizacion','$this->usuarioActualizacion_id',".$this->CON->empresa_id.");";
        return $this->CON->manipular($consulta);
    }

}
