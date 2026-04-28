
<?php

echo "Hola mundo<br>";

$servidor = "db";
$usuario = "root";
$contrasena = "root";
$base_datos = "users";

$conexion = mysqli_connect($servidor, $usuario, $contrasena, $base_datos);

if (!$conexion) {
    die("fallo: " . mysqli_connect_error());
}

echo "conectado<br>";

$sql = "SELECT id_usuario, nombre, email FROM usuarios";
$resultado = mysqli_query($conexion, $sql);

if (mysqli_num_rows($resultado) > 0) {
    echo "<ul>";
    while($row = mysqli_fetch_assoc($resultado)) {
        echo "<li>ID: " . $row["id_usuario"]. " - Nombre: " . $row["nombre"]. " - Email: " . $row["email"]. "</li>";
    }
    echo "</ul>";
} else {
    echo "0 resultados";
}

mysqli_close($conexion);
?>
