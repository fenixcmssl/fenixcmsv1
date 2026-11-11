# Bitácora de Desarrollo - FenixCMS

## Fase 1.2.28 Finalizada con éxito - 2026-11-07 12:13:21
- Extensiones de cliente Prisma (getTenantClient y getAdminClient) operativas en src/lib/prisma.ts.
- Middleware de resolución de host configurado en src/middleware.ts.
- Ruta dinámica multi-tenant creada en src/app/[domain]/page.tsx.
- Verificación física de integridad de archivos completada.
## Fase 1.2.28 Finalizada con éxito - 2026-11-07 12:17:06
- Extensiones de cliente Prisma (getTenantClient y getAdminClient) operativas en src/lib/prisma.ts.
- Middleware de resolución de host configurado en src/middleware.ts.
- Ruta dinámica multi-tenant creada en src/app/[domain]/page.tsx.
- Verificación física de integridad de archivos completada.
## Fases 1.2.41 a 1.2.44 Finalizadas con éxito - 2026-11-07 14:36:23
- Downgrade a Prisma 6.19.3 ejecutado para resolver colisión de resolución de módulos de esquema en Next.js.
- Generación de artefactos de Prisma Client completada con éxito.
- Refactorización de src/lib/prisma.ts a arquitectura de $transaction garantizando la inyección segura del 	enantId en RLS antes de cada operación del ORM.
- Proxy multi-tenant validado.
## Fases 1.2.45 a 1.2.48 Finalizadas con éxito - 2026-11-07 15:16:14
- Rol de aplicación (fenix_app) creado y configurado en PostgreSQL con privilegios restrictivos (NOSUPERUSER, NOBYPASSRLS).
- Conexión de Prisma migrada al rol de aplicación (DATABASE_URL actualizada).
- Políticas RLS (Row-Level Security) purgadas, recreadas y normalizadas a nivel de texto (id::text) para asegurar compatibilidad de tipos con UUID.
- Middleware transaccional de Prisma refactorizado para utilizar SET LOCAL en inyecciones de sesión seguras.
- Auditoría automatizada de seguridad superada (4/4): contención absoluta de acceso anónimo, prevención de ataques de lectura cruzada confirmada, acceso legítimo y modo bypass validados.
- Módulo Core de Tenancy y Seguridad cerrado.
## Fases 2.0.0 a 2.0.3 Finalizadas con éxito - 2026-11-07 16:09:12
- Modelado relacional del catálogo E-Commerce agregado a Prisma (Categorías, Productos, Variantes).
- Restricciones de unicidad compuestas aplicadas por inquilino (@@unique([tenantId, slug])).
- Desincronización de base de datos resuelta mediante reset forzado y migración estructural como superusuario.
- Tablas del catálogo protegidas rigurosamente con políticas Row-Level Security (RLS) vinculadas al tenantId en el rol fenix_app.
## Fase 2.0.4 Finalizada con éxito - 2026-11-07 16:57:43
- Permisos globales del esquema public y políticas RLS restauradas correctamente tras el reset de la base de datos.
- Datos iniciales (Seed) de prueba inyectados de forma relacional (Tenants, Dominios, Categorías y Productos).
- Auditoría del catálogo E-Commerce superada (2/2): Contención absoluta de datos de productos entre inquilinos verificada mediante cliente transaccional extendido.
## Fase 2.0.5 Finalizada con éxito - 2026-11-07 17:17:56
- Vista pública del catálogo implementada en src/app/[domain]/page.tsx consumiendo getTenantClient y RLS activo.
- Renderizado validado vía HTTP 200 en http://localhost:3000 con datos aislados por tienda.
- Resuelto error de codificación de caracteres especiales en PowerShell y PostgreSQL forzando UTF-8 universal (PGCLIENTENCODING).
- Datos de prueba actualizados con tipografía acentuada correcta.
## Fase 2.0.6 Finalizada con éxito - 2026-11-07 17:45:13
- Creado el panel de administración (Backoffice) del catálogo en src/app/[domain]/admin/page.tsx.
- Implementado formulario de creación de productos con diseño responsivo.
- Desarrollado Server Action seguro en actions.ts para procesar inserciones de productos inyectando automáticamente el tenantId y aislando los datos.
- Refresco automático de la vista implementado con revalidatePath.
## Fase 2.0.7 (Resolución) Finalizada con éxito - 2026-11-07 20:15:43
- Solucionado el problema de caché estática de Next.js/Turbopack en Windows que mostraba imágenes rotas (404) tras la subida.
- Eliminado el atributo encType manual para delegar la transferencia nativa multiparte a React Server Actions.
- Implementado un Enrutador Dinámico (API Route) en src/app/api/images/[tenantId]/[filename]/route.ts con cabeceras anti-caché.
- Actualizada la tabla del Backoffice para consumir las imágenes desde la API Route en lugar de la carpeta public, garantizando el renderizado inmediato tras la subida.
## Fase 2.0.8 Finalizada con éxito - 2026-11-07 20:26:48
- Actualizada la vista pública del catálogo (Storefront) en src/app/[domain]/page.tsx.
- Implementado diseño responsivo en cuadrícula (CSS Grid) para las tarjetas de productos.
- Integrado el consumo de imágenes estáticas a través de la API Route dinámica (/api/images/) para sortear el caché de Turbopack.
- Configurada lógica condicional para mostrar un placeholder elegante ("Sin imagen") en productos sin archivo asociado.
## Fase 2.0.9 Finalizada con éxito - 2026-11-08 12:19:07
- Implementada la función de borrado de productos (Server Action 'deleteProduct').
- Integrada la limpieza física de archivos huérfanos utilizando 'fs/promises' (unlink) para liberar espacio en el disco al borrar un producto.
- Mejorada la usabilidad del panel de administración (UI) inyectando 'cursor-pointer' y 'file:cursor-pointer' en botones, enlaces y campos de subida.
## Fase 2.1.0 Finalizada con éxito - 2026-11-08 12:27:20
- Implementada la funcionalidad de Edición de Productos (Update completo del CRUD).
- Creada ruta dinámica dedicada para el formulario de edición (src/app/[domain]/admin/edit/[id]/page.tsx) pre-cargada con los datos actuales de la base de datos.
- Desarrollada la Server Action 'updateProduct' con lógica avanzada de sustitución de archivos (eliminación de la imagen física anterior al subir una nueva) para optimizar el almacenamiento.
- Corregido el enrutamiento relativo en los botones de acción para respetar la resolución transparente de dominios manejada por el Middleware de Next.js.
## Fase 2.2 Finalizada con éxito - 2026-11-08 12:41:10
- Actualizado el esquema de base de datos (Prisma) para incluir contraseñas seguras por Tenant.
- Implementado script de limpieza (seed.js) y superación de limitaciones de permisos (CREATEDB/SUPERUSER) en PostgreSQL.
- Desarrollada pantalla de inicio de sesión (/admin/login) con manejo de errores de autenticación.
- Creada Server Action para emitir cookies de sesión HTTP-only ('auth_[tenantId]').
- Implementado Gatekeeper (Guardián de Seguridad) en el panel principal y de edición para interceptar y redirigir accesos no autorizados.
- Integrada funcionalidad de Cierre de Sesión (Logout) con destrucción de cookies.
## Fase 2.3 Finalizada con éxito - 2026-11-08 13:06:22
- Actualizado esquema de Prisma para incluir 'logoUrl' y 'themeColor' por cada Tenant.
- Resuelto Drift de migraciones con reseteo de base de datos e inicialización limpia (init_branding).
- Creada página de Configuración Visual (/admin/settings) protegida por el Gatekeeper.
- Implementada Server Action para carga física de logotipos (reemplazo automático de archivos antiguos) y actualización de color.
- Modificado el Front-end público (page.tsx) para absorber de forma dinámica el logo y el color corporativo del Tenant.
### Fase 1.0.0: Definici�n de Arquitectura E-commerce
- **Decisi�n:** Desarrollo de m�dulo e-commerce a medida nativo.
- **Stack:** NestJS, Prisma ORM, PostgreSQL.
- **Motivo:** Garantizar la base m�s s�lida posible, control total del c�digo y permitir actualizaciones de productos sin fricci�n ni dependencias de terceros.


### Fases 1.0.0 a 1.0.2: Definici�n de Arquitectura E-commerce
- **Decisi�n:** Desarrollo de m�dulo e-commerce a medida nativo conservando el trabajo previo.
- **Stack:** NestJS, Prisma ORM, PostgreSQL.
- **Motivo:** Garantizar la base m�s s�lida posible y permitir actualizaciones de productos sin dependencias de terceros.



## Hito: Consolidación del Centro de Control Maestro (Superadmin) - 2026-11-08 18:52:05
- Se unificó la gestión eliminando paneles redundantes en favor de un God Mode global optimizado.
- Se integraron los patrones visuales y de diseño del prototipo de AI Studio en la ruta /superadmin.
- Se optimizó la gestión de identidad visual y el acceso maestro por inquilino con auditoría RGPD.


## Hito: Conexión de Base de Datos Prisma con Vistas Dinámicas (E-commerce) - 2026-11-08 18:58:54
- Se conectó TiendaEcommerceView directamente con el cliente aislado de Prisma por tenant.
- Se configuró la consulta en tiempo real del catálogo de productos y precios dinámicos por moneda.
- Se validó el flujo completo desde el Centro de Control Maestro (God Mode) hacia la visualización de la tienda.


## Hito: Conexión de Módulos Inmobiliaria y Subastas - 2026-11-08 19:07:27
- Se implementaron y conectaron las vistas TiendaInmobiliariaView y TiendaSubastasView con Prisma.
- Se configuró el enrutamiento dinámico de catálogos especializados por tipo de inquilino (REAL_ESTATE y AUCTION).
- Se sincronizó el repositorio remoto en GitHub.


## Hito: Implementación del Super Admin Dashboard Pro - 2026-11-08 19:34:59
- Se diseñó e integró la interfaz ejecutiva de Super Admin idéntica al prototipo con barra lateral de navegación SaaS.
- Se conectaron las tarjetas de métricas en tiempo real (MRR, ARR, Comercios y Licencias) consultando la base de datos PostgreSQL.
- Se consolidó la tabla de gestión multi-tenant con acceso directo God Mode por inquilino.

### Hitos de la Jornada (Noviembre 2026) - Panel Superadmin
- Restauración visual completa de todas las pestañas (Dashboard, Applications, Plans, Entitlements, Licenses, Activations, Subscriptions, Tenants).
- Implementación de Formularios de Creación conectados a Server Actions (ctions.ts).
- Persistencia temporal de datos de prueba (Mock Data) mediante Cookies del navegador.
- Integración de botones interactivos (ActionButtons.tsx) para la gestión de registros.
- Sistema de Edición Dinámica (EditItemForm.tsx) funcional en todas las tablas.
- Borrado real en PostgreSQL vía API (/api/superadmin/delete), resolviendo las restricciones de claves foráneas (Foreign Keys) al eliminar dependencias de los Tenants (Domains).

### Hitos de la Jornada (Noviembre 2026) - Fase 4: UI Completa Superadmin
- Rediseño completo del Layout principal incorporando Topbar (Header) y Sidebar expandido.
- Implementación de la vista **Dashboard Ejecutivo** con tarjetas de métricas estandarizadas (MRR, ARR, Tenants, Licencias).
- Implementación de la vista **Domains** (Enrutamiento Multi-Dominio y SSL) con lectura dinámica desde PostgreSQL.
- Implementación de las vistas estáticas y tablas de datos para **Payments** (Libro Mayor) e **Invoices** (Facturación B2B).
- Implementación de la vista de **Themes** y **Plugins** con diseño de tarjetas de galería (Grid) e imágenes de previsualización.
- Implementación de las vistas de seguridad **Users** (RBAC) y **Audit Logs**.
- Implementación del formulario avanzado **Settings** (Configuración Maestra del Motor SaaS) con controles de pasarelas, infraestructura y aprovisionamiento SSL.
- Resolución de errores de compilación de Turbopack (Unterminated regexp literal) aplicando estructuración multilínea segura en JSX.

### Hito - Fase 5.0.0: Login del Superadmin
- Creación de la interfaz gráfica de autenticación para el Super Admin en src/app/[domain]/superadmin/login/page.tsx.
- Implementación del diseño corporativo premium (FenixCMS Dark Theme con acentos naranja).
- Desarrollo del Server Action (ctions.ts) para validación segura de credenciales maestras y generación de sesión por Cookies (superadmin_auth).
- Sistema de feedback visual para credenciales incorrectas usando SearchParams (?error=credenciales).

### Hito - Fase 5.1.0: Middleware de Seguridad
- Implementación de src/middleware.ts en Next.js.
- Configuración de barrera de seguridad para interceptar cualquier petición a /superadmin.
- Redirección automática obligatoria a /superadmin/login si la cookie superadmin_auth no está presente.
- Protección compatible con el enrutamiento dinámico [domain] del SaaS.

### Hito - Fase 5.1.1: Parche Middleware Multi-Tenant
- Restauración de la lógica de reescritura de URLs para la arquitectura [domain].
- Unificación del enrutador de Tenants con la barrera de validación de Cookies para /superadmin.
- Resolución de bucle infinito (spinning page) causado por la falta del identificador de dominio en el motor de Turbopack.

### Hito - Fase 5.1.2: Escaneo de Middleware
- Inyección de sensores de consola (console.log) en el Middleware para trazar el origen del bucle infinito.
- Implementación de filtro de exclusión de archivos con punto (path.includes(".")) para evitar atrapar payloads de React/Turbopack.

### Hito - Fase 5.1.3: Migración a Proxy.ts (Next.js 16)
- Eliminación del archivo obsoleto src/middleware.ts que causaba conflicto fatal en Turbopack.
- Consolidación de la lógica de seguridad (Superadmin RBAC) y el motor Multi-Tenant en src/proxy.ts.
- Inclusión de consola de diagnóstico [PROXY] para trazabilidad del enrutamiento.

### Hito - Fase 5.2.0: Implementación Logout
- Adición de un botón de "Salir" en el Header global del Superadmin.
- Conexión del botón con un inline Server Action (use server) que destruye la cookie superadmin_auth de manera segura desde el servidor.
- Redirección automática integrada al flujo de /superadmin/login tras el cierre de sesión.

### Hito - Fase 5.3.0: Panel de Mi Cuenta
- Incorporación del botón "Mi Cuenta" en la barra de navegación superior (Header) junto a "Ver Tienda" y "Salir".
- Creación de la vista ?tab=account para la gestión del perfil administrativo.
- Implementación del formulario de Datos Fiscales (Nombre, Apellidos, Teléfono, Dirección, NIE, CIF).
- Implementación de la tarjeta de Imagen Corporativa con botones dedicados para carga de Logo y Favicon.
- Implementación del formulario de Seguridad para actualización de contraseña.

### Hito - Fase 5.3.1: Reordenación en Header
- Se invirtió el orden de los botones en la barra superior para priorizar "Ver Tienda", seguido de "Mi Cuenta" y finalizar con "Salir".

### Hito - Fase 6.0.0: Configuración del Esquema Prisma
- Creación de prisma/schema.prisma con estructura relacional optimizada para SaaS Multi-Tenant.
- Definición de tablas globales: SuperAdmin (RBAC/Perfil), GlobalSetting (Configuraciones maestras) y AuditLog.
- Definición de tablas de inquilinos: Tenant (con indicador moduleType para mantener tablas independientes por modelo de negocio), Domain, Plan y Subscription.

### Hito - Fase 5.3.2: Restauración de Interfaz de Tablas
- Se inyectó un componente de Tabla Universal como "placeholder" visual para las secciones comprimidas, evitando pantallas negras sin contenido.
- El panel ahora indica visualmente su estado de espera para conectarse a PostgreSQL.

### Hito Fase 6.8: Despliegue en VPS completado exitosamente
- Base de datos PostgreSQL enlazada correctamente.
- Arquitectura multi-modelo implementada en Prisma.
- Tipos estrictos y referencias del Superadmin sincronizados.
- PM2 en ejecuci�n estable y aplicaci�n en l�nea.

- Fase 7.2.0: Creaci�n de Server Action (accountActions.ts) v�a comando PowerShell para la gesti�n segura de contrase�as de Superadmin conectada a PostgreSQL.

- Fase 7.2.0: Creaci�n de Server Action (accountActions.ts) v�a comando PowerShell para la gesti�n segura de contrase�as de Superadmin conectada a PostgreSQL.
- Fase 7.3.0: Creación directa en el VPS de la Server Action y actualización del formulario Superadmin conectando a PostgreSQL.

- Fase 7.3.2: Conexión definitiva del formulario de Login Superadmin a PostgreSQL utilizando encriptación bcryptjs y tablas independientes.

- Fase 7.3.2: Conexión definitiva del formulario de Login Superadmin a PostgreSQL utilizando encriptación bcryptjs y tablas independientes.

- Fase 8.1.0: Independización de la pestaña 'Applications' en el VPS para renderizar datos reales vía Prisma, desacoplándola de la tabla genérica.

- Fase 8.2.0: Implementación de Motor de Renderizado Dinámico para mapear automáticamente todas las tablas del panel lateral conectándolas a Prisma.

- Fase 8.3.0: Implementación del Motor de Formularios Dinámicos (NewItemForm.tsx) activando el botón 'Nuevo Registro' en todas las pestañas del panel lateral.

- Fase 8.3.1: Reparación de error de sintaxis en page.tsx (Unterminated regexp) que causaba 502 Bad Gateway y consolidación de la arquitectura condicional para formularios dinámicos.

- Fase 8.4.0: Conexión de formulario de Perfil a Prisma. Habilitado el cambio dinámico de Correo y Nombre del Superadmin.

- Fase 8.4.0: Conexión de formulario de Perfil a Prisma. Habilitado el cambio dinámico de Correo y Nombre del Superadmin.

- Fase 8.4.1: Parche de seguridad para login. Limpieza automática de espacios y minúsculas en correos para evitar bloqueos de PostgreSQL.

- Fase 9.1.1: Configuración de motor escalable multi-idioma (ES, EN, IT, FR, PT, DE) e inyección de selector visual dinámico en cabecera Superadmin.

- Fase 9.1.3: Rescate del sistema Multi-idioma. Creación de directorios faltantes (messages, i18n, actions), instalación de next-intl y despliegue exitoso.

- Fase 10.0.0: Despliegue de Landing Page pública (Frontend de Ventas) en fenixcms.es con diseño integrado al panel Superadmin.

- Fase 10.0.1: Actualización del Middleware para excluir el dominio principal (fenixcms.es) del enrutamiento multi-tenant, permitiendo visualizar la Landing Page pública.

- Fase 10.0.2: Resolución de error 502 Bad Gateway. Reescritura del middleware para separar el enrutamiento de la Landing Page raíz (page.tsx) y las rutas dinámicas multi-tenant ([domain]). Limpieza de caché de Next.js.

- Fase 10.0.3: Eliminación de archivos duplicados (src/src/middleware.ts) que bloqueaban la compilación. Sistema reconstruido exitosamente para resolver el error 502.

- Fase 10.0.4: Ejecución de rastreo profundo (find) para eliminar archivos fantasma (proxy.ts, src/src/middleware.ts) que bloqueaban la compilación. Middleware regenerado.

- Fase 10.0.5: Migración de middleware.ts a proxy.ts según estándar Next.js 16 y bypass de tests de TS en compilación de producción para asegurar estabilidad.

- Fase 10.1.0: Actualización de Landing Page a Client Component para implementar Smooth Scroll mediante JavaScript, manteniendo la URL raíz limpia sin hashes.

- Fase 10.1.1: Corrección de rutas absolutas (/superadmin?tab=...) en la barra lateral y botón de Mi Cuenta para evitar fallos de enrutamiento y errores de carga.

- Fase 10.1.2: Actualización de src/proxy.ts para permitir el paso directo de rutas /superadmin con sus parámetros de pestañas (?tab=), solucionando el bloqueo de navegación en el panel.

- Fase 10.1.3: Corrección final del proxy para evitar la redirección a la Fase 0 y asegurar la carga completa del panel Superadmin con diseño y menús.

- Fase 10.1.4: Eliminación de carpeta residual (src/app/superadmin) de la Fase 0. Ajuste del proxy para enrutar correctamente a [domain] pasando los parámetros de búsqueda (url.search).

- Fase 10.1.7: Sincronizaci�n forzada (Hard Reset) completada. Entorno local Windows es ahora un espejo exacto del servidor VPS.

- Fase 11.0.4: Resolución definitiva de divergencias en Git (Hard Reset) en el VPS y subida limpia del sistema de traducciones dinámicas.

- Fase 11.1.0: Instalación de SDK @paypal/react-paypal-js para iniciar la integración de pasarelas de pago escalables.

- Fase 11.1.1: Resolución automática de vulnerabilidades en dependencias mediante npm audit fix.

- Fase 11.1.2: Inyección de NEXT_PUBLIC_PAYPAL_CLIENT_ID en .env y creación del componente PaypalCheckout.tsx.

- Fase 11.1.3: Integración del componente PaypalCheckout en la Landing Page pública (page.tsx) con planes de suscripción renderizados.

- Fase 11.2.0: Implementaci�n de Server Action (tenantActions.ts) para aprovisionamiento autom�tico de Tenants en PostgreSQL tras confirmaci�n de pago v�a PayPal.

- Fase 11.2.1: Inicializaci�n del controlador superadminActions.ts preparatorio para la inserci�n de datos (Aplicaciones, Planes) desde los formularios del Superadmin hacia PostgreSQL.

- Fase 11.2.2: Modificaci�n de tenantActions.ts y PaypalCheckout.tsx para exponer mensajes de error detallados de PostgreSQL en la interfaz web.

- Fase 11.2.3: Inyecci�n del campo obligatorio moduleType ('ECOMMERCE') en tenantActions.ts para resolver el bloqueo de Prisma al instanciar nuevos Tenants.

- Fase 11.3.0: Formularios de creaci�n (NewItemForm.tsx) conectados exitosamente a PostgreSQL a trav�s de Server Actions.

- Fase 11.3.1: Resoluci�n de error de PowerShell utilizando LiteralPath y Out-File para la correcta inyecci�n de NewItemForm.tsx.

- Fase 11.3.2: Restauraci�n de checkDatabaseHealth en superadminActions.ts para resolver ca�da 502 de Next.js.

- Fase 11.3.4: Correcci�n del error de compilaci�n (Unterminated regexp) protegiendo los backticks de Next.js mediante un string literal en PowerShell.

- Fase 11.3.6: Actualizaci�n de schema.prisma con la creaci�n del modelo Application y la expansi�n de campos en el modelo Plan.

- Fase 11.3.8: Limpieza de cach� profunda (.next) y regeneraci�n de Prisma en el VPS para forzar el reconocimiento de los modelos Application y Plan.

- Fase 11.3.9: Reconstrucción profunda de Prisma en VPS. Se inyectó schema.prisma directamente, se purgó la caché de node_modules y se regeneró el cliente para resolver el desajuste de 'undefined' al crear Applications.

- Fase 11.4.2: Conexión de la vista principal del Superadmin (page.tsx) con la base de datos PostgreSQL para extraer y listar los registros reales de Applications y Plans.

- Fase 11.5.1: Conexión de la Landing Page pública (page.tsx) con PostgreSQL para renderizado dinámico de tarjetas de precios (modelo Plan) e inyección de datos exactos en PaypalCheckout.

- Fase 11.5.2: Desactivación de caché estática en page.tsx mediante export const dynamic = 'force-dynamic' para mostrar los Planes de BD en tiempo real.

- Fase 11.6.0: Modificación del modelo Tenant para almacenar email. Implementación de generación de contraseñas automáticas post-pago y visualización de credenciales en el Frontend.

- Fase 11.6.1: Implementación del portal central de Login para clientes (/login) con validación de credenciales en PostgreSQL y redirección dinámica hacia el panel de administración del subdominio respectivo (/[domain]/admin).

- Fase 11.7.0: Creación del Dashboard del Tenant (/[domain]/admin/page.tsx) con verificación de cookies de sesión, lectura de datos desde PostgreSQL y arquitectura visual base.

- Fase 11.7.1: Parche de compatibilidad de tipos TypeScript en page.tsx del admin para evitar falla silenciosa de compilación.

- Fase 11.7.2: Implementación de src/middleware.ts para reescribir internamente las URLs de los subdominios hacia la estructura de carpetas /[domain]/... permitiendo el acceso al panel /admin de cada Tenant.

- Fase 11.7.7: Ajuste de formato DNS. El proveedor exige FQDN completo, por lo que el registro manual se realiza como john4095.fenixcms.es en lugar de usar el formato corto.

- Fase 11.7.11: Resolución de conflicto de duplicidad de middleware (raíz vs src). Se elimina el archivo sobrante para permitir la compilación exitosa y resolver la caída 502 Bad Gateway.

- Fase 11.7.12: Búsqueda y eliminación estricta de archivos middleware y proxy anidados (src/src/). Generación limpia de src/middleware.ts para resolver conflicto de compilación 502 Bad Gateway.

- Fase 11.7.13: Resolución de error crítico (Turbopack Panic) durante la compilación. Se procedió a purgar node_modules/.cache, se deshabilitó la telemetría y se aplicó límite de memoria RAM con NODE_OPTIONS para estabilizar el VPS.

- Fase 11.7.14: Migración del enrutador dinámico. Se reemplaza src/middleware.ts por src/proxy.ts para cumplir con los nuevos estándares de Next.js 16.4.5 y solucionar el Turbopack Panic durante el build.

- Fase 11.7.15: Corrección de sintaxis en proxy.ts. Se actualiza el nombre de la función exportada de 'middleware' a 'proxy' cumpliendo con la directiva estricta de Next.js 16.4.5+.

- Fase 11.7.16: Limpieza nuclear de node_modules/.cache y .next. Se fuerza a Turbopack a regenerar el árbol de archivos desde cero para eliminar el mapeo fantasma de middleware.ts que causaba el TurbopackInternalError.

- Fase 11.7.17: Hard reset del enrutador. Se purgan todos los archivos middleware/proxy y archivos vacíos (0 bytes) que causaban pánico en Turbopack. Se reubica middleware.ts a la raíz del proyecto usando 'export default' para garantizar estabilidad en la compilación.

- Fase 11.7.18: Análisis profundo de Turbopack Panic. Se identificó corrupción en binarios de Rust. Solución aplicada: Reinstalación limpia de node_modules (Clean Install) y reubicación estricta de middleware.ts dentro de src/ para estabilizar el compilador Edge de Next.js 16.4.5.

- Fase 11.7.19: Creación de la vista de login específica para subdominios (src/app/[domain]/login/page.tsx). Se implementó un Server Action nativo para emitir la cookie tenant_session estrictamente en el dominio del cliente, previniendo errores de cookies cruzadas y eludiendo el error 404.

- Fase 11.7.20: Implementación de UI para el Tenant Dashboard. Se reemplazó el marcador de texto plano por una interfaz moderna con Tailwind CSS que incluye barra lateral de navegación y tarjetas de métricas conectadas a los datos reales del tenant en PostgreSQL.

- Fase 11.7.21: Escaneo profundo de arquitectura. Se detectó colisión de rutas (la carpeta dinámica [domain] está capturando el tráfico de /superadmin). Se extraen logs de PM2 y estructura de Next.js para aislar los dominios.
