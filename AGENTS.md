# FenixCMS — Instrucciones maestras para agentes de desarrollo

## 1. IDENTIDAD DEL PROYECTO

Nombre: FenixCMS SaaS.

FenixCMS es una plataforma CMS SaaS multiempresa, multidominio, multilingüe y modular, con un modelo de negocio basado en licencias, planes y suscripciones.

Su objetivo es ofrecer una plataforma profesional que combine las posibilidades de Shopify y WordPress.

## 2. ARQUITECTURA GENERAL OBLIGATORIA

La plataforma debe mantener cuatro zonas diferenciadas:

1. `/superadmin`: administración global de FenixCMS.
2. `/login`: portal de clientes SaaS que contratan licencias, módulos y servicios.
3. `/admin`: administración privada de cada tienda o tenant.
4. Dominio público de cada tienda: escaparate y acceso de sus compradores mediante `/login`.

No mezclar sesiones, permisos, datos ni funcionalidades entre estas zonas.

## 3. SUPERADMINISTRACIÓN

Debe disponer de:

- Inicio de sesión de superadministrador.
- Cambio y recuperación de contraseña.
- Perfil y configuración personal.
- Gestión de usuarios y administradores.
- Gestión de clientes SaaS.
- Gestión de tenants y dominios.
- Catálogo de módulos.
- Planes Starter, Pro y Enterprise.
- Precios mensuales, trimestrales, semestrales y anuales.
- Descuentos y promociones.
- Suscripciones y renovaciones.
- Pagos y facturas.
- Gestión de licencias y activaciones.
- Catálogo de plugins y temas.
- Importadores y exportadores.
- Idiomas y traducciones.
- Configuración general.
- Auditoría y registros de actividad.
- Estado y salud del sistema.

DISEÑO: negro y rojo, profesional, moderno, inspirado en la organización visual de Amazon, pero sin barra superior de búsqueda.

## 4. PORTAL DE CLIENTES SAAS

Cada cliente debe poder gestionar:

- Su cuenta y perfil.
- Suscripciones contratadas.
- Licencias adquiridas.
- Dominios activados.
- Módulos y servicios comprados.
- Plugins y temas contratados.
- Pagos y facturas.
- Renovaciones y cancelaciones.
- Datos de facturación.

## 5. ADMINISTRACIÓN DE TENANTS

Cada tenant tendrá su propio panel `/admin`, con:

- Productos y categorías.
- Inventario y stock.
- Pedidos y clientes.
- Pagos y facturación.
- Contenidos y páginas.
- Menús y navegación.
- Blog.
- Plugins y temas.
- Configuración del dominio.
- Idiomas y traducciones.

El aislamiento entre tenants debe ser estricto. Ningún tenant podrá acceder a datos de otro.

## 6. MÓDULOS DE NEGOCIO

La plataforma debe permitir activar módulos independientes:

- Blog, sencillo y fácil de utilizar, inspirado en WordPress.
- Comercio electrónico.
- Inmobiliaria.
- Subastas, estilo eBay.
- Anuncios clasificados, estilo Milanuncios.
- Anuncios personales.
- Futuros módulos ampliables.

El superadministrador decidirá qué módulos incluye cada plan y cuánto cuesta cada uno.

## 7. PLUGINS, TEMAS Y EXTENSIONES

Crear un sistema extensible similar a WordPress que permita:

- Instalar, cargar, activar y desactivar plugins.
- Crear y gestionar plugins.
- Actualizar y desinstalar plugins.
- Instalar, cargar y gestionar temas.
- Configurar temas por tenant.
- Gestionar importadores y exportadores.
- Incorporar plugin de consentimiento de cookies y cumplimiento RGPD.

Las extensiones deben ejecutarse con controles de seguridad y permisos.

## 8. IDIOMAS

Preparar desde el inicio:

- Español.
- Inglés.
- Francés.
- Italiano.
- Portugués.
- Alemán.
- Criollo haitiano.

Permitir incorporar nuevos idiomas sin modificar toda la aplicación.

## 9. TECNOLOGÍA

Tecnología inicial:

- Next.js con App Router.
- TypeScript.
- React.
- Tailwind CSS.
- PostgreSQL.
- Prisma ORM.

Mantener una arquitectura modular, mantenible, segura y preparada para producción.

## 10. SEGURIDAD

Implementar progresivamente:

- Autenticación segura.
- Hash robusto de contraseñas.
- Roles y permisos.
- Aislamiento estricto de tenants.
- Validación de dominios y licencias.
- Protección contra CSRF, XSS y SQL injection.
- Validación de datos en servidor.
- Registro de auditoría.
- Protección de sesiones.
- Control de acceso en cada operación.
- Validación de pagos en servidor.

Nunca confiar en importes, permisos o identificadores enviados directamente por el navegador.

## 11. PAGOS Y LICENCIAS

Preparar integración con PayPal.

La contratación debe verificar el pago en el servidor antes de activar una licencia o crear un tenant.

El catálogo de precios del servidor será la fuente oficial de importes y monedas.

Evitar duplicidades de pagos y aprovisionamientos mediante operaciones idempotentes.

## 12. REGLAS OBLIGATORIAS PARA GEMINI ANTIGRAVITY

1. Leer AGENTS.md antes de modificar el proyecto.
2. Respetar la arquitectura definida.
3. No cambiar la arquitectura sin autorización.
4. No eliminar funcionalidades existentes.
5. No ejecutar migraciones destructivas.
6. No borrar ni modificar datos de bases de datos sin autorización expresa.
7. No actualizar dependencias masivamente sin revisar compatibilidad.
8. Trabajar por fases pequeñas.
9. Antes de programar, explicar los archivos que se crearán o modificarán.
10. Ejecutar pruebas después de cada fase.
11. Informar de los errores y riesgos encontrados.
12. No afirmar que una funcionalidad está terminada si no se ha probado.
13. Mantener la documentación técnica actualizada.
14. No introducir datos de prueba en producción.
15. No exponer contraseñas, claves secretas ni credenciales.

## 13. PLAN DE DESARROLLO POR FASES

FASE 0: estructura, documentación y configuración inicial.

FASE 1: arquitectura base y seguridad.

FASE 2: autenticación, roles y permisos.

FASE 3: multi-tenancy y multidominio.

FASE 4: superadministración.

FASE 5: clientes SaaS y licencias.

FASE 6: planes, suscripciones y pagos.

FASE 7: paneles de tenants.

FASE 8: módulos de negocio.

FASE 9: plugins y temas.

FASE 10: idiomas y traducciones.

FASE 11: pruebas, auditoría y preparación para producción.

No implementar todas las fases de golpe. Cada fase debe revisarse y aprobarse antes de avanzar.

## 14. PRIORIDAD PRINCIPAL

Construir una plataforma SaaS segura, estable, escalable y verdaderamente multiempresa.

La seguridad, el aislamiento entre tenants, la integridad de los pagos y la gestión de licencias tienen prioridad sobre los elementos visuales.

Antes de realizar cambios importantes, presentar un plan y esperar autorización.
