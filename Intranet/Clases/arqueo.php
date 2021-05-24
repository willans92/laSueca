<?php

class arqueo {

    var $id_arqueo;
    var $fechaDe;
    var $fechaHasta;
    var $monto;
    var $pagado;
    var $cobrador;
    var $usuario_id;
    var $estado;
    var $fechaModificado;
    var $registrado;
    var $empresa_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_arqueo, $fechaDe, $fechaHasta, $monto, $pagado, $cobrador, $usuario_id, $estado, $fechaModificado, $registrado) {
        $this->id_arqueo = $id_arqueo;
        $this->registrado = $registrado;
        $this->fechaDe = $fechaDe;
        $this->fechaHasta = $fechaHasta;
        $this->monto = $monto;
        $this->pagado = $pagado;
        $this->cobrador = $cobrador;
        $this->usuario_id = $usuario_id;
        $this->estado = $estado;
        $this->fechaModificado = $fechaModificado;
    }

    function todo() {
        $consulta = "select * from lasueca.arqueo where empresa_id=" . $this->CON->empresa_id;
        return $this->CON->consulta2($consulta);
    }

    function cobranzaSinArqueo($cobrador,$de,$hasta) {
        $consulta = "select c.id_cobranza,c.fecha,c.detalle,sum(d.monto) monto";
        $consulta .= " from lasueca.detallecobranza d, lasueca.cobranza c";
        $consulta .= " where c.id_cobranza=d.cobranza_id and cobradoPor=$cobrador ";
        $consulta .= " and c.estado like 'activo' and d.estado like 'activo'";
        $consulta .= " and id_cobranza not in (SELECT cobranza_id FROM lasueca.detallearqueo)";
        $consulta .= " and STR_TO_DATE(c.fecha,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= " group by c.id_cobranza,c.fecha,c.detalle";
        return $this->CON->consulta2($consulta);
    }

    function reporteArqueo($de, $hasta, $empleado, $sucursal, $estado) {
        $empleadoStr = "";
        if ($empleado != "0") {
            $empleadoStr = " and a.cobrador=$empleado";
        }
        $sucursalStr = "";
        if ($sucursal != "0") {
            $sucursalStr = " and u.sucursal_id=$sucursal";
        }
        $consulta = "select a.* from lasueca.arqueo a , lasueca.arqueo ";
        $consulta .= " where a.empresa_id=" . $this->CON->empresa_id;
        $consulta .= "  and STR_TO_DATE(a.registrado,'%e/%c/%Y') between STR_TO_DATE('$de','%e/%c/%Y') and STR_TO_DATE('$hasta','%e/%c/%Y')";
        $consulta .= "  $empleadoStr $sucursalStr and a.estado='$estado' and a.cobrador=u.id_usuario ";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.arqueo SET fechaDe = '$this->fechaDe',fechaHasta = '$this->fechaHasta',monto = '$this->monto',pagado = '$this->pagado',cobrador = '$this->cobrador',usuario_id = '$this->usuario_id',estado = '$this->estado',fechaModificado = '$this->fechaModificado' WHERE id_arqueo = '$this->id_arqueo'";
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_arqueo, $fecha) {
        $consulta = "update lasueca.marca set estado='inactivo',fechaModificado='$fecha'  where id_arqueo=$id_arqueo";
        return $this->CON->manipular($consulta);
    }

    function insertar($descrip) {
        $consulta = "INSERT INTO lasueca.arqueo (id_arqueo,fechaDe,fechaHasta,monto,pagado,cobrador,usuario_id,estado,fechaModificado,empresa_id,registrado) VALUES ('$this->id_arqueo','$this->fechaDe','$this->fechaHasta','$this->monto','$this->pagado','$this->cobrador','$this->usuario_id','$this->estado','$this->fechaModificado','" . $this->CON->empresa_id . "','$this->registrado');";
        return $this->CON->manipular($consulta);
    }

}
