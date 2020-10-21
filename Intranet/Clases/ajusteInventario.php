<?php

class ajusteInventario {

    var $id_ajusteInventario;
    var $nroDocumento;
    var $detalle;
    var $fecha;
    var $fechaActualizado;
    var $usuarioEncargado;
    var $usuarioActualizo;
    var $almacen_id;
    var $estado;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_ajusteInventario,$nroDocumento,$detalle,$fecha,$fechaActualizado,$usuarioEncargado,$usuarioActualizo,$almacen_id,$estado,$empresa_id) {
        $this->id_ajusteInventario=$id_ajusteInventario;
        $this->nroDocumento=$nroDocumento;
        $this->detalle=$detalle;
        $this->fecha=$fecha;
        $this->fechaActualizado=$fechaActualizado;
        $this->usuarioEncargado=$usuarioEncargado;
        $this->usuarioActualizo=$usuarioActualizo;
        $this->almacen_id=$almacen_id;
        $this->estado=$estado;
        $this->empresa_id=$empresa_id;
    }
    
    function modificar() {
        $consulta = "UPDATE lasueca.ajusteInventario SET id_ajusteInventario = '$this->id_ajusteInventario',nroDocumento = '$this->nroDocumento',detalle = '$this->detalle',fecha = '$this->fecha',fechaActualizado = '$this->fechaActualizado',usuarioEncargado = '$this->usuarioEncargado',usuarioActualizo = '$this->usuarioActualizo',almacen_id = '$this->almacen_id',estado = '$this->estado' WHERE id_ajusteInventario = $this->id_ajusteInventario and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
    function buscarXid($id_traspaso) {
        $consulta = "select * from lasueca.ajusteInventario where id_ajusteInventario=$id_traspaso and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXFecha($de,$hasta) {
        $consulta = "select t.id_ajusteInventario,t.nroDocumento,t.detalle,t.fecha,d.producto_id";
        $consulta .= " ,d.cantidad , almacen_id";
        $consulta .= " from lasueca.ajusteInventario t, lasueca.detalleAjusteInventario d ";
        $consulta .= " where t.id_ajusteInventario=d.ajusteInventario_id and t.estado like 'activo'";
        $consulta .= " and empresa_id=".$this->CON->empresa_id." ";
        $consulta .= " and STR_TO_DATE(t.fecha ,'%e/%c/%Y') between STR_TO_DATE('$de' ,'%e/%c/%Y') and STR_TO_DATE('$hasta' ,'%e/%c/%Y')";
        return $this->CON->consulta2($consulta);
    }
    function obtenerNroDocumento() {
        $consulta = " select nroDocumento+1 nro from lasueca.ajusteInventario where empresa_id=".$this->CON->empresa_id." order by id_ajusteInventario desc limit 0,1";
        $lista=$this->CON->consulta2($consulta);
        if(count($lista)>0){
            return $lista[0]["nro"];
        }
        return 1;
    }
    function eliminar($id_traspaso) {
        $consulta = "update lasueca.ajusteInventario set estado='inactivo' where id_ajusteInventario=" . $id_traspaso;
        return $this->CON->manipular($consulta);
    }
    function insertar() {
        $consulta = "INSERT INTO lasueca.ajusteInventario (id_ajusteInventario,nroDocumento,detalle,fecha,fechaActualizado,usuarioEncargado,usuarioActualizo,almacen_id,estado,empresa_id) VALUES ('$this->id_ajusteInventario','$this->nroDocumento','$this->detalle','$this->fecha','$this->fechaActualizado','$this->usuarioEncargado','$this->usuarioActualizo','$this->almacen_id','$this->estado','".$this->CON->empresa_id."');";
        if(!$this->CON->manipular($consulta)){
            return '0';
        }
        $consulta="SELECT LAST_INSERT_ID() as id";
        $id= $this->CON->consulta2($consulta)[0]['id'];
        return $id;
    }
    function busquedaAccionXidAjuste($idtraspaso,$tipo) {
        
        $accion="";
        $order="";
        if(($tipo=="siguiente" || $tipo=="anterior") && $idtraspaso == 0 ){
            $tipo="ultimo";
        }
        if($tipo=="actual"){
            $accion=" id_ajusteInventario=$idtraspaso and ";
        }
        if($tipo=="anterior"){
            $accion=" STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.ajusteInventario where id_ajusteInventario=$idtraspaso) and ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc ";
        }
        if($tipo=="siguiente"){
            $accion=" STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.ajusteInventario where id_ajusteInventario=$idtraspaso) and ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc ";
        }
        if($tipo=="primero"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc  ";
        }
        if($tipo=="ultimo"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc  ";
        }
        $consulta = "SELECT c.* FROM lasueca.ajusteInventario c where $accion c.empresa_id=".$this->CON->empresa_id." $order limit 0,1";
        $ajusteInventario=$this->CON->consulta2($consulta);
        if(count($ajusteInventario)>0){
            return $ajusteInventario[0];
        }
        $consulta = "SELECT c.* FROM lasueca.ajusteInventario c where c.empresa_id=".$this->CON->empresa_id." limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }
    
}
