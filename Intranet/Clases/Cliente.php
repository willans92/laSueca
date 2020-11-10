<?php

class Cliente {

    var $id_cliente;
    var $codigo;
    var $ci;
    var $nombre;
    var $telefono;
    var $direccion;
    var $foto;
    var $descuento;
    var $nit;
    var $razonSocial;
    var $descuentoMax;
    var $telefonoContacto;
    var $personaContacto;
    var $limiteCredito;
    var $email;
    var $fechaNacimiento;
    var $comentario;
    var $empresa_id;
    var $clienteApp_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_cliente,$codigo,$ci,$nombre,$telefono,$direccion,$foto
            ,$descuento,$nit,$razonSocial,$descuentoMax,$telefonoContacto,$personaContacto
            ,$limiteCredito,$email,$fechaNacimiento,$comentario, $clienteApp_id=0) {
        $this->id_cliente = $id_cliente;
        $this->codigo = $codigo;
        $this->ci = $ci;
        $this->nombre = $nombre;
        $this->telefono = $telefono;
        $this->direccion = $direccion;
        $this->foto = $foto;
        $this->descuento = $descuento;
        $this->nit = $nit;
        $this->razonSocial = $razonSocial;
        $this->descuentoMax = $descuentoMax;
        $this->telefonoContacto = $telefonoContacto;
        $this->personaContacto = $personaContacto;
        $this->limiteCredito = $limiteCredito;
        $this->email = $email;
        $this->fechaNacimiento = $fechaNacimiento;
        $this->comentario = $comentario;
        $this->clienteApp_id =  $clienteApp_id;
    }

    function todo() {
        $consulta = "select id_cliente,ci,nombre,telefono,direccion from lasueca.cliente where empresa_id".$this->CON->empresa_id;
        return $this->CON->consulta2($consulta);
    }
    
    function buscarXidClienteApp($id_clienteApp,$empresa_id) {
        $consulta = "select * from lasueca.cliente where clienteApp_id=$id_clienteApp and empresa_id=$empresa_id limit 0,1";
        return $this->CON->consulta2($consulta);
    }
    function buscarXid($id_cliente) {
        $consulta = "select * from lasueca.cliente where id_cliente=$id_cliente limit 0,1";
        return $this->CON->consulta2($consulta)[0];
    }

   function modificar($id_cliente) {
        $consulta = "UPDATE lasueca.cliente SET ci = '$this->ci',nombre = '$this->nombre',telefono = '$this->telefono',direccion = '$this->direccion',foto = '$this->foto',codigo = '$this->codigo',limiteCredito = '$this->limiteCredito',personaContacto = '$this->personaContacto',telefonoContacto = '$this->telefonoContacto',nit = '$this->nit',razonSocial = '$this->razonSocial',email = '$this->email',emailContacto = '$this->emailContacto',descuento = '$this->descuento',comentario = '$this->comentario',fechaNacimiento = '$this->fechaNacimiento',descuentoMax = '$this->descuentoMax' WHERE empresa_id=".$this->CON->empresa_id." and id_cliente = " . $id_cliente;
        return $this->CON->manipular($consulta);
    }
   function modificarBasica($id_cliente) {
        $consulta = "UPDATE lasueca.cliente SET ci = '$this->ci',nombre = '$this->nombre',telefono = '$this->telefono',direccion = '$this->direccion' ,email = '$this->email' WHERE empresa_id=".$this->CON->empresa_id." and id_cliente = " . $id_cliente;
        return $this->CON->manipular($consulta);
    }
   function modificarDatosFacturacion($id_cliente,$nit,$rz) {
        $consulta = "UPDATE lasueca.cliente SET nit = '$nit' ,razonSocial = '$rz' WHERE empresa_id=".$this->CON->empresa_id." and id_cliente = " . $id_cliente;
        return $this->CON->manipular($consulta);
    }

    function eliminar($id_cliente) {
        $consulta = "delete from lasueca.cliente where empresa_id=".$this->CON->empresa_id." and id_cliente=" . $id_cliente;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "INSERT INTO lasueca.cliente(ci,nombre,telefono,direccion,foto,codigo,limiteCredito,personaContacto,telefonoContacto,nit,razonSocial,email,emailContacto,descuento,comentario,fechaNacimiento,descuentoMax,empresa_id,clienteApp_id) VALUES ('$this->ci','$this->nombre','$this->telefono','$this->direccion','$this->foto','$this->codigo','$this->limiteCredito','$this->personaContacto','$this->telefonoContacto','$this->nit','$this->razonSocial','$this->email','$this->emailContacto','$this->descuento','$this->comentario','$this->fechaNacimiento','$this->descuentoMax',".$this->CON->empresa_id.",$this->clienteApp_id)";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_cliente = $resultado->fetch_assoc()['id'];
        return true;
    }

    function version($nroVersion) {
        $consulta = "SELECT cliente.*, version.version FROM lasueca.version,lasueca.cliente  where version.nombre ='cliente'  and cliente.empresa_id=".$this->CON->empresa_id." and version.version > $nroVersion and version.empresa_id=".$this->CON->empresa_id." and cliente.id_cliente=version.id";
        $resultado = $this->CON->consulta($consulta);
        return $this->CON->rellenarString($resultado);
    }
    function existeVersion($id,$empresa,$tipo) {
        $consulta = "select count(id_version) cant from lasueca.version where empresa_id=$empresa and id=$id and nombre like '$tipo'";
        $resultado = $this->CON->consulta($consulta);
        $re=$resultado->fetch_assoc()['cant'];
        return $re;
    }
    
    function ultimaVersion() {
        $consulta = "SELECT (version.version+1) version FROM lasueca.version where nombre='cliente' and empresa_id=".$this->CON->empresa_id." order by version desc limit 0,1";
        $resultado = $this->CON->consulta2($consulta);
        if (count($resultado) === 0) {
            return 1;
        } else {
            $nro = $resultado[0]["version"];
            $nro = $nro == 0 || $nro == "" ? 1 : $nro;
            return $nro;
        }
    }
}
