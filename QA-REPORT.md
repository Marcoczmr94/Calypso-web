# Reporte de QA — Villa Calypso

Fecha de corte: 15 de julio de 2026.

## Resultado

El rediseño editorial está preparado para publicarse en `https://villacalypso.mx/`. La introducción conserva el video oficial en pantalla completa y la portada interior usa una fotografía fija de la propiedad. La galería, la experiencia interactiva y la sección de Acapulco no presentan desbordamiento horizontal en la revisión de escritorio.

Durante la QA se detectó que algunas compilaciones de Chromium rechazaban las variantes AVIF de las nuevas fotografías de Acapulco. La entrega quedó corregida para usar WebP responsivo con el JPEG original disponible como fuente de edición. Los tres WebP fueron inspeccionados y respondieron correctamente por HTTP.

## Matriz verificada

- Escritorio: 1440 × 900 px; introducción, portada, navegación, galería, visor modal, experiencia interactiva y sección de destino.
- Estructura responsiva: reglas específicas para 1080, 760 y 410 px sin referencias a los componentes eliminados de la versión anterior.
- Galería: cuatro fotografías oficiales, contador `1 de 4`, navegación siguiente/anterior, cierre y retorno de foco.
- Experiencia: cuatro momentos con cambio de imagen, texto, `aria-selected` y navegación por flechas, Inicio y Fin.
- Conversión: enlaces de Airbnb y WhatsApp, parámetros UTM, código `MARCO-WEB-CALYPSO` y folio persistente `VC-AAAAMMDD-XXXXX`.
- Formulario: validación de fechas y transferencia de fechas, huéspedes y servicios a los canales correspondientes; su lógica no fue modificada por el rediseño.
- Accesibilidad: estructura semántica, textos alternativos, estados ARIA, foco visible y reducción de movimiento.

## Pruebas automatizadas

- Sintaxis JavaScript validada con `node --check`.
- Auditoría estática de archivos, SEO, rutas relativas, datos estructurados, imágenes responsivas y `prefers-reduced-motion` con `tools/qa-static.mjs`.
- Auditoría HTTP local: **121 recursos del repositorio con estado 200** y página inexistente con estado 404.
- Artefacto de GitHub Pages: **71 archivos de producción**; no depende de las fuentes de edición ni de imágenes históricas excluidas.
- `git diff --check` sin errores de espacios o conflictos de formato.

## Peso de entrega

- Artefacto estimado de GitHub Pages: **17.61 MiB**.
- Recursos de edición e históricos excluidos: **9.56 MiB**.
- HTML principal: 31.9 KB.
- CSS: 35.2 KB.
- JavaScript total: 17.3 KB.

La mayor parte del peso restante corresponde a los dos videos oficiales y a las fotografías de alta resolución. El navegador descarga variantes responsivas según el ancho disponible; los originales de edición permanecen en el repositorio, pero no se incluyen en GitHub Pages.

## Límite de la sesión

La herramienta de revisión visual bloqueó una recarga posterior de la URL local por su política de navegación. Por ello, la corrección final de Acapulco se verificó mediante inspección directa de los WebP, auditoría de referencias y respuestas HTTP. La URL pública debe revisarse nuevamente después del despliegue para confirmar certificado, caché y entrega del CDN.
