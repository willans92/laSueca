<?php

class prestamo {

    var $id_prestamo;
    var $motivo;
    var $fecha;
    var $fechaModificado;
    var $estado;
    var $nroDocumento;
    var $estadoEntrega;
    var $capital;
    var $nroCuotas;
    var $tasaAnual;
    var $metodoPago;
    var $documentoPago;
    var $usuario_id;
    var $modificadoPor;
    var $cliente_id;
    var $sucursal_id;
    var $empresa_id;
    var $gastoAdministrativo;
    var $primerCuota;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_prestamo, $motivo, $fecha, $fechaModificado, $estado
            , $nroDocumento, $estadoEntrega, $capital, $nroCuotas, $tasaAnual, $metodoPago
            , $documentoPago, $usuario_id, $modificadoPor, $cliente_id, $sucursal_id
            , $empresa_id,$gastoAdministrativo, $primerCuota) {
        $this->id_prestamo=     $id_prestamo;
        $this->motivo= $motivo;
        $this->fecha= $fecha;
        $this->fechaModificado= $fechaModificado;
        $this->estado= $estado;
        $this->nroDocumento= $nroDocumento;
        $this->estadoEntrega= $estadoEntrega;
        $this->capital= $capital;
        $this->nroCuotas= $nroCuotas;
        $this->tasaAnual= $tasaAnual;
        $this->metodoPago= $metodoPago;
        $this->documentoPago= $documentoPago;
        $this->usuario_id= $usuario_id;
        $this->modificadoPor= $modificadoPor;
        $this->cliente_id= $cliente_id;
        $this->sucursal_id= $sucursal_id;
        $this->empresa_id= $empresa_id;
        $this->gastoAdministrativo= $gastoAdministrativo;
        $this->primerCuota= $primerCuota;
    }

    function todo() {
        $consulta = "select * from lasueca.prestamo where empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function busquedaAccionXidPrestamo($idPrestamo,$tipo,$idsucursal) {
        $accion="";
        $order="";
        
        
        if(($tipo=="siguiente" || $tipo=="anterior") && $idPrestamo == 0 ){
            $tipo="ultimo";
        }
        if($tipo=="actual"){
            $accion=" where  id_prestamo=$idPrestamo and sucursal_id=$idsucursal";
        }
        if($tipo=="anterior"){
            $accion=" where  sucursal_id=$idsucursal and  STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') < (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.prestamo where id_prestamo=$idPrestamo)  ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc ";
        }
        if($tipo=="siguiente"){
            $accion=" where  sucursal_id=$idsucursal and STR_TO_DATE(fecha ,'%e/%c/%Y %H:%i:%s') > (select STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') from lasueca.prestamo where id_prestamo=$idPrestamo)  ";
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc ";
        }
        if($tipo=="primero"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') asc  ";
        }
        if($tipo=="ultimo"){
            $order=" order by STR_TO_DATE(fecha,'%e/%c/%Y %H:%i:%s') desc  ";
        }
        if($accion===""){
            $accion=" where sucursal_id=$idsucursal and v.empresa_id=".$this->CON->empresa_id."";
        }else{
            $accion.=" and v.empresa_id=".$this->CON->empresa_id."";
        }
        $consulta = "select * from lasueca.prestamo v $accion $order limit 0,1";
        $venta=$this->CON->consulta2($consulta);
        if(count($venta)>0){
            return $venta[0];
        }
        $consulta = "select * from lasueca.prestamo v where id_prestamo=$idPrestamo and v.empresa_id=".$this->CON->empresa_id." limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }
    function obtenerNroDocumento() {
        $consulta = "SELECT nroDocumento nro FROM lasueca.prestamo where empresa_id=".$this->CON->empresa_id." order by STR_TO_DATE(fecha,'%e/%c/%Y') desc, id_prestamo desc limit 0,1";
        $resultado = $this->CON->consulta2($consulta);
        if(count($resultado)===0){
            return 1;
        }
        $nro=(int)$resultado[0]["nro"];
        return $nro+1;
    }
    
   function modificar() {
        $consulta = "UPDATE lasueca.prestamo SET motivo = '$this->motivo',fecha = '$this->fecha',fechaModificado = '$this->fechaModificado',estadoEntrega = '$this->estadoEntrega',usuario_id = '$this->usuario_id',modificadoPor = '$this->modificadoPor',cliente_id = '$this->cliente_id',sucursal_id = '$this->sucursal_id' WHERE id_prestamo = '$this->id_prestamo'";
        return $this->CON->manipular($consulta);
    }
   function anularPrestamo($id_prestamo,$fechaActual,$usuario_id) {
        $consulta = "UPDATE lasueca.prestamo SET fechaModificado = '$fechaActual',modificadoPor = '$usuario_id', estado = 'inactivo' WHERE id_prestamo = '$id_prestamo'";
        return $this->CON->manipular($consulta);
    }
   
    function insertar() {
        $consulta = "INSERT INTO lasueca.prestamo(id_prestamo,motivo,fecha,fechaModificado,estado,nroDocumento,estadoEntrega,capital,nroCuotas,tasaAnual,metodoPago,documentoPago,usuario_id,modificadoPor,cliente_id,sucursal_id,empresa_id,gastoAdministrativo,primerCuota)VALUES('$this->id_prestamo','$this->motivo','$this->fecha','$this->fechaModificado','$this->estado','$this->nroDocumento','$this->estadoEntrega','$this->capital','$this->nroCuotas','$this->tasaAnual','$this->metodoPago','$this->documentoPago','$this->usuario_id','$this->modificadoPor','$this->cliente_id','$this->sucursal_id','".$this->CON->empresa_id."','$this->gastoAdministrativo','$this->primerCuota');";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_prestamo = $resultado->fetch_assoc()['id'];
        return true;
    }

    
}
