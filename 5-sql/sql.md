# Estructura

## Crear estructura db

```sql
 -- 1. Crear tabla Carreras
CREATE TABLE carreras (
    id_carrera INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- 2. Crear tabla Profesores
CREATE TABLE profesores (
    id_profesor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);

-- 3. Crear tabla Alumnos (Depende de Carreras)
CREATE TABLE alumnos (
    id_alumno INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    id_carrera INT,
    CONSTRAINT fk_alumno_carrera FOREIGN KEY (id_carrera) 
        REFERENCES carreras(id_carrera) ON DELETE SET NULL
);

-- 4. Crear tabla Materias (Depende de Profesores y Carreras)
CREATE TABLE materias (
    id_materia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    curso VARCHAR(50),
    id_profesor INT,
    id_carrera INT,
    CONSTRAINT fk_materia_profesor FOREIGN KEY (id_profesor) 
        REFERENCES profesores(id_profesor) ON DELETE SET NULL,
    CONSTRAINT fk_materia_carrera FOREIGN KEY (id_carrera) 
        REFERENCES carreras(id_carrera) ON DELETE CASCADE
);

-- 5. Crear tabla Notas (Depende de Alumnos y Materias)
CREATE TABLE notas (
    id_nota INT PRIMARY KEY AUTO_INCREMENT,
    id_alumno INT,
    id_materia INT,
    calificacion DECIMAL(4, 2) CHECK (calificacion >= 0 AND calificacion <= 10),
    fecha DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_nota_alumno FOREIGN KEY (id_alumno) 
        REFERENCES alumnos(id_alumno) ON DELETE CASCADE,
    CONSTRAINT fk_nota_materia FOREIGN KEY (id_materia) 
        REFERENCES materias(id_materia) ON DELETE CASCADE
);
```

## Migraciones de datos de prueba

### cargar carreras

```sql
INSERT INTO carreras (nombre) VALUES 
('Tecnicatura Superior en Análisis y Desarrollo de Software'),
('Profesorado de Inglés'),
('Profesorado de educación secundaria en Econimía'),
('Tecnicatura Superior en Administración contable');
```

### Cargar profesores

```sql
DELIMITER //
CREATE PROCEDURE CargarProfesores()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 50 DO
        INSERT INTO profesores (nombre, email) 
        VALUES (CONCAT('Profesor ', i), CONCAT('profe', i, '@gmail.com'));
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;
CALL CargarProfesores();
```

### cargar materias
```sql
DELIMITER //
CREATE PROCEDURE CargarMaterias()
BEGIN
    DECLARE carr_id INT DEFAULT 1;
    DECLARE mat_count INT;
    
    WHILE carr_id <= 4 DO
        SET mat_count = 1;
        WHILE mat_count <= 30 DO
            INSERT INTO materias (nombre, curso, id_profesor, id_carrera)
            VALUES (
                CONCAT('Materia ', mat_count, ' (Carrera ', carr_id, ')'), 
                CONCAT('Año ', FLOOR(1 + RAND() * 3)),
                FLOOR(1 + RAND() * 50),
                carr_id
            );
            SET mat_count = mat_count + 1;
        END WHILE;
        SET carr_id = carr_id + 1;
    END WHILE;
END //
DELIMITER ;
CALL CargarMaterias();
```

### cargar alumnos

```sql
DELIMITER //
CREATE PROCEDURE CargarAlumnos()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 200 DO
        INSERT INTO alumnos (nombre, dni, email, id_carrera)
        VALUES (
            CONCAT('Alumno ', i), 
            CONCAT('45.000.', i),
            CONCAT('alumno', i, '@gmail.com'), 
            FLOOR(1 + (RAND() * 4))
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;
CALL CargarAlumnos();
```

### cargar notas
```sql
DELIMITER //
CREATE PROCEDURE CargarNotasAleatorias()
BEGIN
    INSERT INTO notas (id_alumno, id_materia, calificacion, fecha)
    SELECT 
        a.id_alumno, 
        (SELECT m.id_materia FROM materias m WHERE m.id_carrera = a.id_carrera ORDER BY RAND() LIMIT 1),
        ROUND(RAND() * 10, 2),
        CURRENT_DATE
    FROM alumnos a;
END //
DELIMITER ;
CALL CargarNotasAleatorias();
```