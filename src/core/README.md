# Capa Core de FenixCMS (`src/core`)

Esta capa alberga la infraestructura lógica y de seguridad no negociable de la plataforma:

- `auth/`: Estrategia de autenticación, hash seguro de contraseñas, validación de sesiones y tokens.
- `tenancy/`: Identificación de host/dominio, resolución de tenant y aislamiento de consultas.
- `security/`: Sanitización de entradas, protección CSRF/XSS, headers HTTP seguros y rate limiting.
- `config/`: Constantes globales, configuración de planes (Starter, Pro, Enterprise) y precios.
