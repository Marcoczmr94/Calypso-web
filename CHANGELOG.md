# Changelog

## 2026-07-18 — cotizador filtrado para WhatsApp

- El formulario ahora solicita nombre, fechas o flexibilidad, adultos, menores, bebés, mascotas y motivo del viaje.
- Los servicios de chef, abastecimiento, transportación y bienestar pueden seleccionarse de forma independiente.
- La interfaz calcula noches, controla la capacidad máxima de 15 huéspedes y muestra un resumen antes de continuar.
- WhatsApp recibe una solicitud estructurada con todos los datos, además del folio, campaña, referencia, promoción y atribución digital existentes.
- Todas las acciones de cotización llevan primero al formulario; sólo los contactos generales y concierge conservan acceso directo a WhatsApp.

## 2026-07-18 — rediseño con identidad oficial

- Se incorporaron el logotipo oficial plano y su variante texturizada sin alterar sus colores ni composición.
- La dirección visual cambió a una estética Riviera mexicana contemporánea con marfil, coral, durazno y verde salvia.
- La portada adoptó una composición editorial dividida, fotografía en arco, sello oficial y jerarquía de conversión más clara.
- Galería, experiencia, servicios, concierge, formulario, navegación, pie y página 404 comparten ahora el mismo sistema visual.
- Se actualizaron iconos, manifest y tarjeta social para representar la identidad oficial al compartir el sitio.

## 2026-07-18 — campaña Vacaciones de verano 2026

- La portada abre directamente con la oferta de renta vacacional y elimina el paso intermedio **Explorar**.
- WhatsApp es ahora la acción principal para cotizar y conserva Airbnb como canal alternativo de disponibilidad y reservación.
- Se comunica `MCZ10` desde la primera pantalla y cada conversación incluye `VACACIONES-VERANO-2026`, `MCZ-REFERIDO`, folio y atribución UTM.
- Se añadieron enlaces de difusión para WhatsApp, Instagram, Facebook y anuncios pagados.
- Los recortes de la introducción anterior permanecen como material de edición, pero ya no se incluyen en el sitio publicado.

## 2026-07-17 — folios MCZ y beneficio web

- Se sustituyó la referencia anterior por `MCZ-REFERIDO` para atribución comercial y control de comisiones.
- Cada apertura de WhatsApp genera un folio con fecha, hora y secuencia diaria, por ejemplo `VC-20260717-153012-01`.
- Se añadió el código `MCZ10` y un beneficio de 10% sobre la tarifa de hospedaje para reservaciones directas confirmadas por el anfitrión.
- La sección de estancia comunica el beneficio, sus condiciones y agrega automáticamente el código al mensaje obligatorio.

## 2026-07-15 — contenido exclusivo de Villa Calypso

- Se retiró por completo el video de la introducción y del artefacto público.
- La pantalla **Explorar** ahora usa un recorte fotográfico oficial de la villa en escritorio y móvil.
- Se eliminó la galería externa de Acapulco y sus enlaces de navegación.
- Todo el contenido visual publicado procede del anuncio oficial de Villa Calypso en Airbnb.
- El workflow excluye videos, fuentes de edición y fotografías históricas que ya no forman parte de la experiencia.

## 2026-07-15 — rediseño editorial de alta resolución

- Se amplió la presentación del video oficial y se mantuvo exclusivamente en la pantalla previa **Explorar**.
- La portada principal ahora usa una fotografía fija de Villa Calypso con recortes específicos para escritorio y móvil.
- Se sustituyó la galería anterior por cuatro fotografías oficiales de alta resolución con composición editorial y visor accesible.
- Se incorporó la sección interactiva **Un día en Calypso**, inspirada en la referencia visual V2 y navegable con clic o teclado.
- Se creó una galería independiente de Acapulco con tres fotografías reales de bahía, costa y noche.
- Las imágenes de Acapulco usan WebP responsivo con JPEG de respaldo para asegurar decodificación consistente.
- Se documentó la procedencia de cada nueva fotografía en `ASSETS.md`.

## 2026-07-15 — versión lista para producción

- Se conservó la dirección cinematográfica oscura de la V7 y el video oficial como una introducción previa al sitio con botón `Explorar`.
- Después de la introducción, la portada usa una imagen estable para evitar repetir el mismo video.
- Se separaron estilos, configuración comercial y comportamiento en archivos mantenibles.
- Se añadió galería accesible con navegación por teclado, Escape y gestión correcta del foco.
- Se corrigió el menú móvil con diálogo, fondo, foco atrapado y cierre accesible.
- Se reforzó el formulario con nombre, servicio opcional y validación de fechas.
- Se incorporó seguimiento persistente de folio, referido y parámetros UTM.
- Se diferenciaron claramente Airbnb y WhatsApp sin simular reservaciones ni pagos.
- Se añadieron canonical, Open Graph, Twitter Card, JSON-LD, sitemap, manifest e iconos.
- Se generaron variantes AVIF/WebP responsivas y dimensiones explícitas para evitar saltos visuales.
- Se reemplazó el duplicado de la portada usado como `404.html` por una página ligera.
- Se limitó el artefacto de GitHub Pages a archivos de producción.
- Se preparó un paquete independiente para Hostinger y documentación de reversión.

## Base V7 recibida

- Video oficial adaptado a escritorio y móvil.
- Logotipo transparente oficial.
- Fotografías locales de la villa y contexto de Acapulco.
- Enlaces de Airbnb y WhatsApp con código comercial.
