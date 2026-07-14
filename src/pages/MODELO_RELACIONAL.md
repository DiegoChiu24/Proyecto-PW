# Modelo Relacional - Sistema de Reservas del Comedor


erDiagram
    USUARIO ||--o{ RESERVA : realiza
    PLATO ||--o{ RESERVA : incluye
    BLOQUE_HORARIO ||--o{ RESERVA : asigna_hora
    
    USUARIO {
        int id PK
        string nombres
        string apellidos
        string correo UK
        string password
        string codigoUniversitario
        enum rol
        boolean bloqueado
        string motivoBloqueo
        datetime creadoEn
    }
    
    PLATO {
        int id PK
        string nombre
        string descripcion
        float precio
        string tipo
        string imagen
        boolean disponible
        datetime creadoEn
    }
    
    RESERVA {
        int id PK
        int usuarioId FK
        int platoId FK
        string platoNombre
        float precio
        string fecha
        string hora
        enum estado
        string codigo UK
        datetime creadoEn
    }
    
    MENU_DEL_DIA {
        int id PK
        string fecha UK
        string entrada
        string platoPrincipal
        string bebida
        float precio
    }
    
    BLOQUE_HORARIO {
        int id PK
        string hora UK
        string etiqueta
        int capacidad
        boolean activo
    }
    
    FECHA_BLOQUEADA {
        int id PK
        string fecha UK
        string motivo
    }
    
    CONFIGURACION_SERVICIO {
        int id PK "default=1"
        boolean servicioSuspendido
    }
```


| Origen | Destino | Tipo | Descripción |
|--------|---------|------|-------------|
| Usuario | Reserva | 1:N | Un usuario puede realizar múltiples reservas |
| Plato | Reserva | 1:N | Un plato puede estar en múltiples reservas |
| BloqueHorario | Reserva | 1:N | Un horario puede tener múltiples reservas |


- **MenuDelDia**: Menú diario (sin relaciones FK, solo información textual)
- **FechaBloqueada**: Fechas cerradas (información de bloqueo)
- **ConfiguracionServicio**: Configuración global del sistema (singleton)

## Claves

- **PK**: Primary Key (Clave Primaria)
- **FK**: Foreign Key (Clave Foránea)
- **UK**: Unique Key (Clave Única)
