<?php

class tarifarioApp {

    var $id_tarifarioAPP;
    var $nombre;
    var $estado;
    var $de;
    var $hasta;
    var $precio;
    var $tipo;
    var $afiliado;
    var $empresa_id;
    var $ciudad_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_tarifarioAPP, $nombre, $estado, $de, $hasta, $precio, $tipo, $afiliado, $empresa_id,$ciudad_id) {
        $this->id_tarifarioAPP = $id_tarifarioAPP;
        $this->nombre = $nombre;
        $this->estado = $estado;
        $this->de = $de;
        $this->hasta = $hasta;
        $this->precio = $precio;
        $this->tipo = $tipo;
        $this->empresa_id = $empresa_id;
        $this->afiliado = $afiliado;
        $this->ciudad_id = $ciudad_id;
    }

    function todas() {
        $consulta = "select * from lasueca.tarifarioApp where estado like 'activo' order by precio asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarXtipo($tipo, $id_empresa, $afiliado,$ciudad="") {
        $where = "";
        if ($tipo === "pedido" && $afiliado === "empresa") {
            $where = " and empresa_id=$id_empresa ";
        }
        if($ciudad!==""){
            $where .= " and ciudad_id=$ciudad ";
        }
        $consulta = "select * from lasueca.tarifarioApp where estado like 'activo' and tipo like '$tipo' $where order by precio asc";
        return $this->CON->consulta2($consulta);
    }

    function buscarTarifario($estado, $ciudad, $contador, $empresa_id, $tipo) {
        $estadoStr = "";
        if ($estado !== "") {
            $estadoStr = "  and estado like '$estado' ";
        }
        $ciudadStr = "";
        if ($ciudad !== "") {
            $ciudadStr = " and ciudad_id=$ciudad ";
        }
        $empresaStr = "";
        $consulta = "SELECT * FROM lasueca.tarifarioapp where empresa_id=$empresa_id and tipo like '$tipo'  $estadoStr  $ciudadStr limit $contador,60";
        $data = $this->CON->consulta2($consulta);
        $consulta = "SELECT count(id_tarifarioAPP) cantidad FROM lasueca.tarifarioapp where empresa_id=$empresa_id and tipo like '$tipo'  $estadoStr  $ciudadStr limit $contador,60";
        $limiteData = $this->CON->consulta($consulta);
        $limite = $limiteData->fetch_assoc()['cantidad'];
        $resultado = array();
        $resultado["limite"] = $limite;
        $resultado["data"] = $data;
        return $resultado;
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.tarifarioapp (id_tarifarioAPP,nombre,de,hasta,precio,estado,tipo,ciudad_id,afiliado,empresa_id) VALUES ('$this->id_tarifarioAPP','$this->nombre','$this->de','$this->hasta','$this->precio','$this->estado','$this->tipo','$this->ciudad_id','$this->afiliado','$this->empresa_id');";
        return $this->CON->manipular($consulta);
    }
    
    function modificar() {
        $consulta = "UPDATE lasueca.tarifarioapp SET nombre = '$this->nombre',de = '$this->de',hasta = '$this->hasta',precio = '$this->precio',estado = '$this->estado',tipo = '$this->tipo',ciudad_id = '$this->ciudad_id'  WHERE id_tarifarioAPP = '$this->id_tarifarioAPP';";
        return $this->CON->manipular($consulta);
    }

}
