<?php

class tienda {

    var $id_tienda;
    var $nombre;
    var $cuenta;
    var $contrasena;
    var $estado;
    var $registrado;
    var $logo;
    var $fechaModifico;
    var $registradoPor;
    var $modificadoPor;
    var $cliente_id;
    var $padre;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_tienda,$nombre,$cuenta,$contrasena,$estado,$registrado,$logo,
                        $fechaModifico,$registradoPor,$modificadoPor,$cliente_id,$padre=0) {
        $this->id_tienda=$id_tienda;
        $this->nombre=$nombre;
        $this->cuenta=$cuenta;
        $this->contrasena=$contrasena;
        $this->estado=$estado;
        $this->registrado=$registrado;
        $this->logo=$logo;
        $this->fechaModifico=$fechaModifico;
        $this->registradoPor=$registradoPor;
        $this->modificadoPor=$modificadoPor;
        $this->cliente_id=$cliente_id;
        $this->padre=$padre;
    }

    function todo() {
        $consulta = "select * from lasueca.tienda where empresa_id=".$this->CON->empresa_id."";
        return $this->CON->consulta2($consulta);
    }
    function logear($cuenta, $contrasena) {
        $consulta = "select count(*) as cant from lasueca.tienda where cuenta like '$cuenta' and contrasena like SHA2('$contrasena', 256)";
        $result = $this->CON->consulta($consulta);
        $empresa = $result->fetch_assoc()['cant'];
        return $empresa;
    }
    function estadoUsuario($cuenta, $contrasena) {
        $consulta = "select * from lasueca.tienda where cuenta='$cuenta' and  contrasena=SHA2('$contrasena', 256) and estado='ACTIVO'";
        $resultado = $this->CON->consulta($consulta);
        if ($resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            $usuario = array();
            $usuario["id_tienda"] = $row['id_tienda'] == null ? "" : $row['id_tienda'];
            $usuario["codigo"] = '00LS'.$row['id_tienda'];
            $usuario["nombre"] = $row['nombre'] == null ? "" : $row['nombre'];
            $usuario["logo"] = $row['logo'] == null ? "" : $row['logo'];
            $usuario["cliente_id"] = $row['cliente_id'] == null ? "" : $row['cliente_id'];
            return $usuario;
        } else {
            return null;
        }
    }
   function modificar() {
        $consulta = "UPDATE lasueca.tienda SET padre='$this->padre',nombre = '$this->nombre',cuenta = '$this->cuenta',contrasena = SHA2('$this->contrasena', 256) ,estado = '$this->estado',registrado = '$this->registrado',logo = '$this->logo',fechaModifico = '$this->fechaModifico',registradoPor = '$this->registradoPor',modificadoPor = '$this->modificadoPor',cliente_id = '$this->cliente_id' WHERE id_tienda = '$this->id_tienda' and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
   function modificarFoto($id,$foto) {
        $consulta = "UPDATE lasueca.tienda SET  logo = '$foto' WHERE id_tienda = '$id' and empresa_id=".$this->CON->empresa_id."";
        return $this->CON->manipular($consulta);
    }
  
    function insertar() {
        $consulta = "INSERT INTO lasueca.tienda (id_tienda,nombre,cuenta,contrasena,estado,registrado,logo,fechaModifico,registradoPor,modificadoPor,cliente_id,empresa_id,padre) VALUES ('$this->id_tienda','$this->nombre','$this->cuenta',SHA2('$this->contrasena', 256),'$this->estado','$this->registrado','$this->logo','$this->fechaModifico','$this->registradoPor','$this->modificadoPor','$this->cliente_id','".$this->CON->empresa_id."','$this->padre');";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_tienda = $resultado->fetch_assoc()['id'];
        return true;
    }

    
}
