# Reporte de QA — Villa Calypso

Fecha de corte: 18 de julio de 2026.

## Resultado

El rediseño de **Villa Calypso** está preparado para publicarse en `https://villacalypso.mx/`. La experiencia utiliza el logotipo oficial y su variante texturizada, una paleta marfil, coral, durazno y salvia, y una portada editorial que conserva de inmediato la oferta vacacional, el beneficio `MCZ10` y la acción principal por WhatsApp.

Todo prospecto de WhatsApp incluye campaña `VACACIONES-VERANO-2026`, referencia `MCZ-REFERIDO`, código `MCZ10`, folio `VC-AAAAMMDD-HHMMSS-01` y atribución UTM. Airbnb permanece como canal alternativo de disponibilidad y reservación.

## Matriz verificada

- Identidad: navegación, portada, sección editorial, iconos, tarjeta social, pie y página 404 utilizan la nueva paleta y los recursos oficiales.
- Conversión: navegación, portada y botón flotante llevan primero al cotizador; WhatsApp sólo se abre desde el envío validado del formulario. Airbnb permanece disponible como alternativa.
- Oferta: el beneficio web se muestra en la primera pantalla y de nuevo junto al formulario, con sus condiciones.
- Formulario: valida nombre, fechas o flexibilidad y capacidad máxima; calcula noches y transfiere composición del grupo, mascotas, motivo, varios servicios y comentarios a WhatsApp.
- Atribución: los enlaces de difusión conservan fuente, medio y campaña; cada conversación recibe además referencia y folio.
- SEO: título y descripción se orientan a renta vacacional en Acapulco; canonical, Open Graph, Twitter Card, JSON-LD y sitemap apuntan al dominio oficial.
- Accesibilidad: estructura semántica, textos alternativos, estados ARIA, foco visible y reducción de movimiento permanecen activos.

## Pruebas automatizadas

- Sintaxis de `config.js` y `site.js` validada con Node.js.
- Auditoría estática de archivos, SEO, rutas relativas, campaña, atribución, imágenes responsivas y movimiento reducido sin errores.
- Auditoría HTTP local: **130 recursos** respondieron correctamente y una ruta inexistente devolvió 404.
- Artefacto de producción: **54 archivos**, sin videos, fuentes de edición, imágenes históricas, logotipos anteriores ni recortes de la introducción retirada.
- `git diff --check` sin errores de espacios o conflictos de formato.

## Peso de entrega

- Artefacto de producción: **6.34 MiB**.
- Paquete para Hostinger: **6.26 MiB**.
- La versión pública sirve únicamente los recursos visuales utilizados por la experiencia actual.

## Estado de publicación

El rediseño oficial está publicado mediante GitHub Pages y protegido por HTTPS. `https://villacalypso.mx/` responde con estado 200 y sirve correctamente ambos logotipos oficiales, la nueva sección de marca y la tarjeta social actualizada.
