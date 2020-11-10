<?php

class precioVenta {

    var $id_PrecioVenta;
    var $precio;
    var $fecha;
    var $producto_id;
    var $usuario_id;
    var $comision;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_PrecioVenta, $precio, $fecha, $producto_id, $usuario_id,$comision) {
        $this->id_PrecioVenta = $id_PrecioVenta;
        $this->precio = $precio;
        $this->fecha = $fecha;
        $this->producto_id = $producto_id;
        $this->usuario_id = $usuario_id;
        $this->comision = $comision;
    }
    

    function insertar() {
        $consulta = "INSERT INTO lasueca.precioventa (id_PrecioVenta, precio, fecha, producto_id, usuario_id ,comision) VALUES ('$this->id_PrecioVenta', '$this->precio', '$this->fecha', '$this->producto_id', '$this->usuario_id','$this->comision')";
        return $this->CON->manipular($consulta);
    }
    


}
