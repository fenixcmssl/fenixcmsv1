# Arquitectura de Plugins de FenixCMS (`src/plugins`)

Inspirado en el modelo extensible de WordPress, este directorio aloja los plugins de la plataforma.

## Capacidades
- **Instalación y Activación:** Cada tenant con un plan compatible puede activar extensiones de catálogo.
- **Ciclo de Vida:** Control de eventos `activate`, `deactivate`, `update`, `uninstall`.
- **Seguridad:** Aislamiento de permisos y sandboxing para prevenir accesos no autorizados a datos de otros tenants o del núcleo.
- **Plugin RGPD / Cookies:** Soporte prioritario para banner de cookies y cumplimiento legal normativo.
