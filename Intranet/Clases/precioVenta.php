<?php

class precioVenta {

    var $id_PrecioVenta;
    var $precio;
    var $fecha;
    var $producto_id;
    var $usuario_id;
    var $CON;

    function __construct($con) {
        $this->CON = $con;
    }

    function contructor($id_PrecioVenta, $precio, $fecha, $producto_id, $usuario_id) {
        $this->id_PrecioVenta = $id_PrecioVenta;
        $this->precio = $precio;
        $this->fecha = $fecha;
        $this->producto_id = $producto_id;
        $this->usuario_id = $usuario_id;
    }
    

    function insertar() {
        $consulta = "INSERT INTO lasueca.precioventa (id_PrecioVenta, precio, fecha, producto_id, usuario_id ) VALUES ('$this->id_PrecioVenta', '$this->precio', '$this->fecha', '$this->producto_id', '$this->usuario_id')";
        return $this->CON->manipular($consulta);
    }
    


}
