<?php

class horarioEntrega {

    var $id_horarioEntrega;
    var $detalle;
    var $horarioDe;
    var $horarioHasta;
    var $estado;
    var $dia;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_horarioEntrega, $detalle, $horarioDe, $horarioHasta, $estado, $dia) {
        $this->id_horarioEntrega = $id_horarioEntrega;
        $this->detalle = $detalle;
        $this->horarioDe = $horarioDe;
        $this->horarioHasta = $horarioHasta;
        $this->estado = $estado;
        $this->dia = $dia;
    }

    function buscarXid($id_horarioEntrega) {
        $consulta = "select * from lasueca.horarioentrega where id_horarioEntrega=$id_horarioEntrega";
        return $this->CON->consulta2($consulta)[0];
    }

    function buscarXestado($estado, $dia) {
        $strDia = "";
        if ($dia != "-1") {
            $strDia = " and dia=$dia";
        }
        $consulta = "select * from lasueca.horarioentrega where estado like '$estado' $strDia";
        return $this->CON->consulta2($consulta);
    }

    function horarioDisponiblexFecha($fecha) {
        $fechaactual = date("d/m/Y");
        
        $consulta = "select id_horarioEntrega,detalle,horarioDe,horarioHasta";
        $consulta .= " from lasueca.horarioentrega";
        $consulta .= " where WEEKDAY(STR_TO_DATE('$fecha','%e/%c/%Y'))=dia and estado like 'activo'";
        if($fecha==$fechaactual){
           $consulta .= " AND  NOW() BETWEEN STR_TO_DATE(CONCAT('$fecha', horarioDe),'%e/%c/%Y %H:%i:%s')";
           $consulta .= " and STR_TO_DATE(CONCAT('$fecha', horarioHasta),'%e/%c/%Y %H:%i:%s')";
        }
        
        return $this->CON->consulta2($consulta);
    }

    function todo() {
        $consulta = "select * from lasueca.horarioentrega";
        return $this->CON->consulta2($consulta);
    }
    function horarioDiaSemana() {
        $consulta = "SELECT dia, count(dia) horarios from lasueca.horarioentrega where estado like 'activo' group by dia ";
        return $this->CON->consulta2($consulta);
    }

    function modificar() {
        $consulta = "UPDATE lasueca.horarioentrega SET id_horarioEntrega = '$this->id_horarioEntrega',detalle = '$this->detalle',horarioDe = '$this->horarioDe',horarioHasta = '$this->horarioHasta',estado = '$this->estado',dia = '$this->dia' WHERE id_horarioEntrega = '$this->id_horarioEntrega'";
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.horarioentrega(id_horarioEntrega,detalle,horarioDe,horarioHasta,estado,dia) VALUES ('$this->id_horarioEntrega','$this->detalle','$this->horarioDe','$this->horarioHasta','$this->estado','$this->dia')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_horarioEntrega = $resultado->fetch_assoc()['id'];
        return true;
    }

}
