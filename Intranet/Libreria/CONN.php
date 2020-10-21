<?php

class CONN {

    var $servername = "127.0.0.1";
    var $username = "root";
    var $password = "tasdingo";
    var $dbname = "lasueca";
    var $empresa_id = 0;
    var $conn;
    var $estado;

    function __construct($idEmpresa) {
        try {
            $this->empresa_id = $idEmpresa;
            $this->conn = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname);
            //$error=mysqli_connect_error() ;
            if ($this->conn->connect_errno) {
                $this->estado = false;
            } else {
                $this->estado = true;
            }
        } catch (PDOException $e) {
            $this->estado = false;
        }
    }

    function transacion() {
        $this->conn->autocommit(false);
    }

    function manipular($query) {
        if ($this->conn->query($query) === TRUE) {
            return true;
        } else {
            return false;
        }
    }

    function consulta($sql) {
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result;
        } else {
            return null;
        }
    }

    function cerrarConexion() {
        try {
            $this->conn->close();
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    function commit() {
        $this->conn->commit();
    }

    function rollback() {
        $this->conn->rollback();
    }

    function closed() {
        mysqli_close($this->conn);
    }

    function base64_to_jpeg($base64_string, $carpeta, $nombre) {
        $fechaactual = date("d_m_Y_H_i_s");
        $nombre=$nombre."_".$fechaactual;
        $data = explode(',', $base64_string);
        $url = $base64_string;
        if (count($data) === 2) {
            $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $domain = $protocol . $_SERVER['HTTP_HOST'];
            $local = "";
            if ($_SERVER['HTTP_HOST'] === "localhost") {
                $local = "/laSueca";
            }
            $url = $domain . $local . "/intranet/Imagen/$carpeta/$nombre.png";
            $urlFisico = "../Imagen/$carpeta/$nombre.png";

            $code = utf8_decode($urlFisico);
            $ifp = fopen($code, "wb");


            fwrite($ifp, base64_decode($data[1]));
            fclose($ifp);
        }
        return $url;
    }

    function enviarCurlFireBase($to, $data, $body) {
        $apiKey = "AAAA-SH1pCg:APA91bE5g7OPzc02JChIW36B1v0U13COqWRZqq808q6efZHLSUG30SA1RXsc3vljUP_5eyvH5c1Ay3o8IkXFLDyQByFfQhuPAHpWLJTJGQxVKvbishYaQ2mf_SySVWqb2qFEj0frxYXp";
        $dataObj = array("title" => "Emprendedor Delivery"
            , "body" => $body
            , "icon" => "https://www.emprendedor-wd.com/Imagen/logo.png"
            ,"android_channel_id" => "777"
            ,"sound" => "asd"
           // , "image" => "https://www.emprendedor-wd.com/Imagen/notificacion/6Agosto.jpeg"
            );
        $data["notification_android_sound"] = "asd";//notificacion
        $data["notification_ios_sound"] = "asd";//notificacion
        $data["notification_ios_badge"] = "1";//notificacion
        $fields = array("to" => $to, "notification" => $dataObj, "data" => $data);
        $headers = array("Authorization:key=$apiKey", "Content-Type: application/json");
        $url = "https://fcm.googleapis.com/fcm/send";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

        $result = curl_exec($ch);

        curl_close($ch);

        return json_decode($result, true);
    }

    function consulta2($sql) {
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $this->rellenar($result);
        } else {
            return array();
        }
    }

    function rellenar($resultado) {
        $lista = array();
        if ($resultado != null) {
            while ($row = $resultado->fetch_assoc()) {
                $obj = array();
                foreach ($row as $nombre_campo => $valor) {
                    $valor = htmlspecialchars_decode($valor, ENT_QUOTES);
                    //$valor = str_replace("\\","\\\\",$valor);
                    //$valor = str_replace("\"","\\\"",$valor);
                    if (is_numeric($valor)) {
                        $valorI = intval($valor);
                        $valorF = floatval($valor);
                        if ($valorI == $valorF) {
                            $valor = $valorI;
                        }
                    }

                    $obj[$nombre_campo] = $valor;
                }
                $lista[] = $obj;
            }
        }
        return $lista;
    }

    function rellenarString($resultado) {
        $lista = "";
        if ($resultado != null) {
            while ($row = $resultado->fetch_assoc()) {
                $obj = "";
                foreach ($row as $nombre_campo => $valor) {
                    //$valor =  htmlspecialchars_decode($valor, ENT_QUOTES, "utf-8");
                    $valor = str_replace("\\", "\\\\", $valor);
                    $valor = str_replace("\"", "\\\"", $valor);
                    if (is_numeric($valor)) {
                        $valorI = intval($valor);
                        $valorF = floatval($valor);
                        if ($valorI == $valorF) {
                            $valor = $valorI;
                        }
                    }
                    $obj .= "\"$nombre_campo\":\"" . $valor . "\",";
                }
                if ($obj != "") {
                    $obj = substr($obj, 0, -1);
                }
                $obj = "{" . $obj . "},";
                $lista .= $obj;
            }
        }
        if ($lista != "") {
            $lista = substr($lista, 0, -1);
        }
        $lista = "[$lista]";
        return $lista;
    }

}
