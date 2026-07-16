# Reporte de QA — Villa Calypso

Fecha de corte: 15 de julio de 2026.

## Resultado

La versión estática está lista para publicarse en `https://villacalypso.mx/`. No se detectaron imágenes rotas, desbordamiento horizontal, errores de consola ni rutas públicas faltantes en las pruebas ejecutadas.

## Matriz verificada

- Escritorio: 1280 × 720 px.
- Tableta: 834 × 1112 px.
- Móvil: 390 × 844 px.
- Navegación con teclado: menú y galería modal, retorno de foco y cierre con Escape.
- Conversión: enlaces de Airbnb y WhatsApp, parámetros UTM, código `MARCO-WEB-CALYPSO` y folio persistente `VC-AAAAMMDD-XXXXX`.
- Formulario: bloqueo de fechas inválidas y transferencia de fechas, huéspedes y servicios a los canales correspondientes.
- Introducción: reproducción correcta del video, entrada con **Explorar**, cierre con Escape y sustitución por poster si el video falla.
- Resiliencia: la interfaz ya cargada mantiene menú, imágenes y contenido cuando el servidor deja de responder.
- Accesibilidad: estructura semántica, textos alternativos, estados ARIA, foco visible y reducción de movimiento.

## Pruebas automatizadas

- Sintaxis JavaScript validada con `node --check`.
- Auditoría estática de archivos, SEO, rutas relativas, datos estructurados, imágenes responsivas y `prefers-reduced-motion` con `tools/qa-static.mjs`.
- Auditoría HTTP: **52 recursos públicos con estado 200** y página inexistente con estado 404.
- ZIP de Hostinger: **52 entradas**, incluido `CNAME`, con rutas internas portables y sin documentación ni herramientas de desarrollo.

## Peso de entrega

- Archivos públicos sin comprimir: 9.53 MiB.
- Paquete `villa-calypso-hostinger.zip`: 9.48 MiB.
- HTML principal: 23.4 KB.
- CSS: 28.8 KB.
- JavaScript total: 15.9 KB.

La mayor parte del peso corresponde a los dos videos oficiales. La introducción muestra un poster inmediatamente, selecciona video de escritorio o móvil según el dispositivo y detiene el video al entrar al sitio. Las fotografías usan AVIF/WebP responsivo.

## Evidencia visual

- `qa/intro-desktop.png`
- `qa/intro-mobile.png`
- `qa/desktop.png`
- `qa/mobile.png`

## Alcance de rendimiento

El entorno disponible no expuso Chrome DevTools Protocol para ejecutar una traza Lighthouse/Core Web Vitals sintética, por lo que no se declara una puntuación numérica. En su lugar se ejecutaron pruebas equivalentes de red, recursos, peso, carga visual, comportamiento responsivo, consola, fallback y navegación. Conviene correr Lighthouse una vez más sobre la URL pública, donde también influirán CDN, caché y compresión del hosting.
