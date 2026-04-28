create table usuarios (
    id_usuario int primary key auto_increment,
    nombre varchar(100) not null,
    email varchar(100) unique not null,
	  contraseña varchar(100) not null
);
