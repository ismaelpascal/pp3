# Contruir db, tabla y cargar datos

```sql
-- crear db users
CREATE DATABASE IF NOT EXISTS users;

USE users;

-- crear tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);

-- cargar datos
INSERT INTO usuarios (nombre, email, contrasena) VALUES
('Ismael', 'GOAT@email.com', '1234'),
('Ign4cio', 'ign4cio@em4il.com', 'g4l4rr4g4'),
('Planchon', 'calvoo@email.com', 'noooooo');
```