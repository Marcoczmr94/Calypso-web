# Reporte de QA — Villa Calypso

Fecha de corte: 18 de julio de 2026.

## Resultado

La campaña **Vacaciones de verano 2026** está preparada para publicarse en `https://villacalypso.mx/`. La portada muestra de inmediato la oferta de renta vacacional, el beneficio `MCZ10` y la acción principal para cotizar por WhatsApp, sin una pantalla intermedia.

Todo prospecto de WhatsApp incluye campaña `VACACIONES-VERANO-2026`, referencia `MCZ-REFERIDO`, código `MCZ10`, folio `VC-AAAAMMDD-HHMMSS-01` y atribución UTM. Airbnb permanece como canal alternativo de disponibilidad y reservación.

## Matriz verificada

- Conversión: WhatsApp es la acción principal en navegación, portada, formulario y botón flotante; Airbnb permanece disponible como alternativa.
- Oferta: el beneficio web se muestra en la primera pantalla y de nuevo junto al formulario, con sus condiciones.
- Formulario: valida llegada y salida y transfiere fechas, huéspedes, nombre, motivo, servicio opcional y mensaje al canal seleccionado.
- Atribución: los enlaces de difusión conservan fuente, medio y campaña; cada conversación recibe además referencia y folio.
- SEO: título y descripción se orientan a renta vacacional en Acapulco; canonical, Open Graph, Twitter Card, JSON-LD y sitemap apuntan al dominio oficial.
- Accesibilidad: estructura semántica, textos alternativos, estados ARIA, foco visible y reducción de movimiento permanecen activos.

## Pruebas automatizadas

- Sintaxis de `config.js` y `site.js` validada con Node.js.
- Auditoría estática de archivos, SEO, rutas relativas, campaña, atribución, imágenes responsivas y movimiento reducido sin errores.
- Auditoría HTTP local: **127 recursos** respondieron correctamente y una ruta inexistente devolvió 404.
- Artefacto de producción: **55 archivos**, sin videos, fuentes de edición, imágenes históricas ni recortes de la introducción retirada.
- `git diff --check` sin errores de espacios o conflictos de formato.

## Peso de entrega

- Artefacto de producción: **6.77 MiB**.
- Paquete para Hostinger: **6.71 MiB**.
- La versión pública sirve únicamente los recursos visuales utilizados por la experiencia actual.

## Estado de publicación

El contenido anterior está en línea mediante GitHub Pages. La campaña nueva queda pendiente de envío al repositorio y de la comprobación final del dominio. La verificación previa detectó que el dominio responde por HTTP, mientras el certificado HTTPS todavía no coincide con `villacalypso.mx`; este punto debe revisarse en la configuración del dominio de GitHub Pages después del despliegue.
