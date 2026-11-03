# Arquitectura de Módulos, Plugins y Temas

## 1. Visión Modular Extensible

FenixCMS está diseñado con un núcleo ultraligero y seguro (*modular monolith* con capacidad de desacoplamiento), sobre el cual orbitan **módulos de negocio**, un **sistema de plugins extensible estilo WordPress** y un **motor de temas visuales independientes**.

---

## 2. Catálogo de Módulos de Negocio Nativos

Los módulos proporcionan funcionalidades completas y autónomas que el Superadministrador puede empaquetar en planes (Starter, Pro, Enterprise) o comercializar como complementos (add-ons) de suscripción independiente:

```
src/modules/
├── ecommerce/      # Comercio electrónico (productos, catálogo, carrito, pasarelas)
├── blog/           # Blog y publicación de artículos (sencillo e intuitivo estilo WP)
├── real-estate/    # Inmobiliaria (inmuebles, agentes, filtros geográficos, fichas)
├── auctions/       # Subastas (pujas en tiempo real estilo eBay, temporizadores)
├── classifieds/    # Anuncios clasificados (estilo Milanuncios, categorías, contacto)
└── personal-ads/   # Anuncios personales (mensajería, perfiles, moderación)
```

### Especificación de los Módulos Actuales

1. **`ecommerce` (Comercio Electrónico):**
   - Catálogo de productos físicos y digitales, variantes (talla, color), inventario en tiempo real.
   - Pasarelas de pago, cálculo de impuestos, envíos y checkout optimizado.
2. **`blog` (Sistema de Publicación de Contenidos):**
   - Editor de artículos ágil y accesible, categorías, etiquetas, comentarios moderados y SEO avanzado.
3. **`real-estate` (Portal Inmobiliario):**
   - Fichas de propiedades (venta, alquiler), filtros de búsqueda por metros, habitaciones, zona y mapa.
4. **`auctions` (Subastas Estilo eBay):**
   - Sistema de pujas incrementales, precio de salida, reserva y adjudicación automática al vencer el tiempo.
5. **`classifieds` (Anuncios Clasificados Estilo Milanuncios):**
   - Publicación de anuncios por particulares y empresas, categorización multinivel y filtros por ubicación.
6. **`personal-ads` (Anuncios Personales):**
   - Tablón de contactos y anuncios personales con filtros de privacidad, verificación y control estricto de moderación.

---

## 3. Contrato para Módulos Futuros

Para permitir la incorporación de nuevos módulos sin necesidad de reescribir la plataforma, cada módulo implementa la interfaz de manifiesto `ModuleManifest`:

```typescript
export interface ModuleManifest {
  id: string;                         // Identificador único (ej. "booking-appointments")
  name: string;                       // Nombre visible
  version: string;                    // Versión semántica (ej. "1.0.0")
  description: string;                // Descripción para el catálogo SaaS
  requiredPlanTier?: "starter" | "pro" | "enterprise";
  dependencies?: string[];            // Dependencias de otros módulos
  navigationItems?: {                 // Enlaces a inyectar en /admin del tenant
    label: string;
    href: string;
    icon: string;
  }[];
  permissions: string[];              // Permisos que define (ej. "booking.manage")
}
```

---

## 4. Arquitectura de Plugins (`src/plugins/`)

Inspirado en el ecosistema de WordPress, el sistema de plugins permite a desarrolladores y terceros extender la plataforma respetando rigurosos controles de seguridad:

- **Ubicación:** `src/plugins/`
- **Ciclo de vida:**
  1. **Instalación:** Verificación de firma, compatibilidad con la versión del core y análisis de permisos.
  2. **Activación:** Registro de hooks, filtros y rutas en el tenant que lo contrate.
  3. **Desactivación:** Retiro inmediato de los interceptores sin pérdida de datos.
  4. **Actualización:** Migración controlada y segura del esquema del plugin.
  5. **Desinstalación:** Limpieza opcional de configuraciones o retención según preferencia.
- **Control de seguridad:**
  - Los plugins no tienen acceso directo a la base de datos de otros tenants ni a credenciales del sistema.
  - Se ejecutan a través de un bus de eventos y contratos de servicio sanitizados.
  - Se incluye de base el soporte para plugins esenciales, como el **plugin de consentimiento de cookies y cumplimiento RGPD**.

---

## 5. Arquitectura de Temas (`src/themes/`)

Permite a cada tienda contar con su propio diseño, paleta de colores y componentes visuales sin alterar la lógica de negocio subyacente:

- **Ubicación:** `src/themes/`
- **Personalización por Tenant:**
  - Selección de tema activo desde `/admin`.
  - Configuración de tokens visuales (colores primarios, tipografías, disposición de rejilla, cabeceras y pies de página).
  - Herencia de componentes base con posibilidad de sobreescritura controlada de plantillas (*template overrides*).
