<?php

class traspasoProducto {

    var $id_traspasoProducto;
    var $nroDocumento;
    var $detalle;
    var $fecha;
    var $fechaActualizado;
    var $usuarioEncargado;
    var $usuarioActualizo;
    var $almacenOrigen;
    var $almacenDestino;
    var $estado;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_traspasoProducto,$nroDocumento,$detalle,$fecha,$fechaActualizado,$usuarioEncargado,$usuarioActualizo,$almacenOrigen,$almacenDestino,$estado,$empresa_id) {
        $this->id_traspasoProducto=$id_traspasoProducto;
        $this->nroDocumento=$nroDocumento;
        $this->detalle=$detalle;
        $this->fecha=$fecha;
        $this->fechaActualizado=$fechaActualizado;
        $this->usuarioEncargado=$usuarioEncargado;
        $this->usuarioActualizo=$usuarioActualizo;
        $this->almacenOrigen=$almacenOrigen;
        $this->almacenDestino=$almacenDestino;
        $this->estado=$estado;
        $this->empresa_id=$empresa_id;
    }
    
    function modificar() {
        $consulta = "UPDATE lasueca.traspasoproducto SET id_traspasoProducto = '$this->id_traspasoProducto',nroDocumento = '$this->nroDocumento',detalle = '$this->detalle',fecha = '$this->fecha',fechaActualizado = '$this->fechaActualizado',usuarioEncargado = '$this->usuarioEncargado',usuarioActualizo = '$this->usuarioActualizo',almacenOrigen = '$this->almacenOrigen',almacenDestino = '$this->almacenDestino',estado = '$this->estado' WHERE id_traspasoProducto = $this->id_traspasoProducto and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function buscarXid($id_traspaso) {
        $consulta = "select * from lasueca.traspasoproducto where id_traspasoProducto=$id_traspaso and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXFecha($de,$hasta) {
        $consulta = "select t.id_traspasoProducto,t.nroDocumento,t.detalle,t.fecha,d.producto_id";
        $consulta .= " ,d.cantidad , almacenOrigen, almacenDestino";
        $consulta .= " from lasueca.traspasoproducto t, lasueca.detalleTraspasoproducto d ";
        $consulta .= " where t.id_traspasoproducto=d.traspasoproducto_id and t.estado like 'activo'";
        $consulta .= " and empresa_id=".$this->CON->empresa_id." ";
        $consulta .= " and STR_TO_DATE(t.fecha ,'%e/%c/%Y') between STR_TO_DATE('$de' ,'%e/%c/%Y') and STR_TO_DATE('$hasta' ,'%e/%c/%Y')";
        return $this->CON->consulta2($consulta);
    }
    function obtenerNroDocumento() {
        $consulta = " select nroDocumento+1 nro from lasueca.traspasoproducto where empresa_id=".$this->CON->empresa_id." order by id_traspasoProducto desc limit 0,1";
        $lista=$this->CON->consulta2($consulta);
        if(count($lista)>0){
            return $lista[0]["nro"];
        }
        return 1;
    }
    function eliminar($id_traspaso) {
        $consulta = "update lasueca.traspasoproducto set estado='inactivo' where id_traspasoProducto=" . $id_traspaso;
        return $this->CON->manipular($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.traspasoproducto (id_traspasoProducto,nroDocumento,detalle,fecha,fechaActualizado,usuarioEncargado,usuarioActualizo,almacenOrigen,almacenDestino,estado,empresa_id) VALUES ('$this->id_traspasoProducto','$this->nroDocumento','$this->detalle','$this->fecha','$this->fechaActualizado','$this->usuarioEncargado','$this->usuarioActualizo','$this->almacenOrigen','$this->almacenDestino','$this->estado','".$this->CON->empresa_id."');";
        if(!$this->CON->manipular($consulta)){
            return '0';
        }
        $consulta="SELECT LAST_INSERT_ID() as id";
        $id= $this->CON->consulta2($consulta)[0]['id'];
        return $id;
    }
    function busquedaAccionXidTraspaso($idtraspaso,$tipo) {
        
        $accion="";
        $order="";
        if(($tipo=="siguiente" || $tipo=="anterior") && $idtraspaso == 0 ){
            $tipo="ultimo";
        }
        if($tipo=="actual"){
            $accion=" id_traspasoProducto=$idtraspaso and ";
        }
        if($tipo=="anterior"){
            $accion=" STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.traspasoProducto where id_traspasoProducto=$idtraspaso) and ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc ";
        }
        if($tipo=="siguiente"){
            $accion=" STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.traspasoProducto where id_traspasoProducto=$idtraspaso) and ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc ";
        }
        if($tipo=="primero"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc  ";
        }
        if($tipo=="ultimo"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc  ";
        }
        $consulta = "SELECT c.* FROM lasueca.traspasoproducto c where $accion c.empresa_id=".$this->CON->empresa_id." $order limit 0,1";
        $traspasoProducto=$this->CON->consulta2($consulta);
        if(count($traspasoProducto)>0){
            return $traspasoProducto[0];
        }
        $consulta = "SELECT c.* FROM lasueca.traspasoproducto c where c.empresa_id=".$this->CON->empresa_id." limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }
    
}
