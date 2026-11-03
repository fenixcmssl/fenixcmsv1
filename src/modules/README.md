# Módulos de Negocio FenixCMS (`src/modules`)

Este directorio contiene los módulos de negocio independientes de la plataforma. Cada módulo está desacoplado del núcleo y puede habilitarse o inhabilitarse por plan o licencia de tenant:

- `ecommerce/`: Tienda online completa, catálogo de productos, carrito de compra y pasarelas de pago.
- `blog/`: Sistema de publicación y gestión de contenidos ágil e intuitivo, inspirado en WordPress.
- `real-estate/`: Portal inmobiliario con propiedades en venta/alquiler, agentes y filtros de búsqueda.
- `auctions/`: Sistema de subastas y pujas en tiempo real estilo eBay.
- `classifieds/`: Anuncios clasificados organizados por categorías y zonas estilo Milanuncios.
- `personal-ads/`: Tablón de anuncios personales con controles de privacidad y moderación.

## Extensibilidad para Módulos Futuros
Cualquier módulo futuro se creará como un subdirectorio en `src/modules/<nuevo-modulo>/` exportando su respectivo `ModuleManifest` y conectándose a los hooks del sistema sin modificar el núcleo.
