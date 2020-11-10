<?php

class planPrestamo {

    var $id_planprestamo;
    var $detalle;
    var $vencimiento;
    var $vencimientoActual;
    var $cuota;
    var $cuotaActual;
    var $capital;
    var $capitalVivo;
    var $interes;
    var $gastoAdministrativo;
    var $estado;
    var $prestamo_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_planprestamo,$detalle,$vencimiento,$vencimientoActual,$cuota,
        $cuotaActual,$capital,$capitalVivo,$interes,$gastoAdministrativo,$estado,$prestamo_id) {
        $this->id_planprestamo=$id_planprestamo;
        $this->detalle=$detalle;
        $this->vencimiento=$vencimiento;
        $this->vencimientoActual=$vencimientoActual;
        $this->cuota=$cuota;
        $this->cuotaActual=$cuotaActual;
        $this->capital=$capital;
        $this->capitalVivo=$capitalVivo;
        $this->interes=$interes;
        $this->gastoAdministrativo=$gastoAdministrativo;
        $this->estado=$estado;
        $this->prestamo_id=$prestamo_id;
    }

    function buscarXidPrestamo($idpretamo) {
        $consulta = "select * from lasueca.planprestamo where prestamo_id=$idpretamo";
        return $this->CON->consulta2($consulta);
    }
    
   function modificar() {
        $consulta = "UPDATE lasueca.planprestamo SET id_planprestamo = '$this->id_planprestamo',detalle = '$this->detalle',vencimiento = '$this->vencimiento',vencimientoActual = '$this->vencimientoActual',cuota = '$this->cuota',cuotaActual = '$this->cuotaActual',capital = '$this->capital',capitalVivo = '$this->capitalVivo',interes = '$this->interes',gastoAdministrativo = '$this->gastoAdministrativo',estado = '$this->estado',prestamo_id = '$this->prestamo_id' WHERE id_planprestamo = '$this->id_planprestamo'";
        return $this->CON->manipular($consulta);
    }
   function anularPrestamo($id_prestamo) {
        $consulta = "UPDATE lasueca.planprestamo SET estado = 'inactivo' WHERE prestamo_id = '$id_prestamo'";
        return $this->CON->manipular($consulta);
    }
   
    function insertar() {
        $consulta = "INSERT INTO lasueca.planprestamo (id_planprestamo,detalle,vencimiento,vencimientoActual,cuota,cuotaActual,capital,capitalVivo,interes,gastoAdministrativo,estado,prestamo_id) VALUES ('$this->id_planprestamo','$this->detalle','$this->vencimiento','$this->vencimientoActual','$this->cuota','$this->cuotaActual','$this->capital','$this->capitalVivo','$this->interes','$this->gastoAdministrativo','$this->estado','$this->prestamo_id')";
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
