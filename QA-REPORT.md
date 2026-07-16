# Reporte de QA — Villa Calypso

Fecha de corte: 15 de julio de 2026.

## Resultado

La versión actual está preparada para publicarse en `https://villacalypso.mx/` y utiliza exclusivamente fotografías oficiales de Villa Calypso obtenidas del anuncio de Airbnb administrado por el propietario.

La pantalla **Explorar** usa una fotografía fija de la alberca y el atardecer, con recortes independientes para escritorio y móvil. No existe ningún elemento `<video>`, referencia a `assets/cinema/`, galería externa de Acapulco ni dependencia visual de fuentes de edición.

## Matriz verificada

- Escritorio: 1440 × 900 px; introducción fotográfica, portada, navegación y ausencia de desbordamiento horizontal.
- Móvil: 390 × 844 px; recorte vertical de 900 × 1200, botón **Explorar**, portada móvil y ausencia de desbordamiento horizontal.
- Introducción: imagen de escritorio 1920 × 1080 e imagen móvil 900 × 1200 seleccionadas correctamente por el navegador.
- Galería: cuatro fotografías oficiales, contador `1 de 4`, navegación siguiente/anterior, cierre y retorno de foco.
- Experiencia: cuatro momentos con cambio de imagen, texto, `aria-selected` y navegación por flechas, Inicio y Fin.
- Conversión: enlaces de Airbnb y WhatsApp, parámetros UTM, código `MARCO-WEB-CALYPSO` y folio persistente `VC-AAAAMMDD-XXXXX`.
- Formulario: validación de fechas y transferencia de fechas, huéspedes y servicios a los canales correspondientes; su lógica no fue modificada.
- Accesibilidad: estructura semántica, textos alternativos, estados ARIA, foco visible y reducción de movimiento.

## Pruebas automatizadas

- Sintaxis JavaScript validada con `node --check`.
- Auditoría estática de archivos, SEO, rutas relativas, datos estructurados, imágenes responsivas y `prefers-reduced-motion` con `tools/qa-static.mjs`.
- Auditoría HTTP local de todos los recursos del repositorio y respuesta 404 para una ruta inexistente.
- Artefacto de GitHub Pages: **61 archivos de producción**; no publica videos, fuentes de edición, fotografías externas de Acapulco ni variantes históricas.
- `git diff --check` sin errores de espacios o conflictos de formato.

## Peso de entrega

- Artefacto estimado de GitHub Pages: **7.36 MiB**.
- Recursos históricos y de edición excluidos: **20.40 MiB**.
- HTML principal: 29.3 KB.
- CSS: 33.2 KB.
- JavaScript total: 16.4 KB.

La eliminación del video redujo el artefacto público en más de 10 MiB respecto de la versión anterior del rediseño. El navegador descarga variantes AVIF/WebP según el ancho disponible, mientras las fuentes originales permanecen fuera de GitHub Pages.

## Pendiente de publicación

La rama local está lista. El envío a GitHub y la comprobación final del dominio dependen de renovar la autenticación de GitHub CLI para la cuenta `Marcoczmr94`.
