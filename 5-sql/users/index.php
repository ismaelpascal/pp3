
<?php

echo "Hola mundo";

$servidor: "localhost";
$usuario: "root";
$contrasena: "root";
$base_datos: "db";

$conexion = mysql_connect($servidor, $usuario, $contrasena, $base_datos);

if (!$conexion) {
    die("fallo: " . mysql_connect_error());
}

echo "conectado";

$sql = "SELECT id_usuario, nombre, "
