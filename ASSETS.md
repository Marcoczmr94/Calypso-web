# Inventario de recursos

Todos los recursos esenciales se sirven desde el repositorio. No hay imágenes base64 ni dependencias visuales de Airbnb.

## Marca

- `assets/brand/logo-calypso.png` — logotipo transparente original recibido.
- `assets/brand/logo-calypso-600.png` y `logo-calypso-1200.png` — derivados optimizados para interfaz.
- `assets/brand/icon-32.png`, `icon-192.png`, `icon-512.png` — iconos derivados del isotipo del logotipo.
- `assets/brand/social-card.jpg` — encuadre social derivado de la fotografía principal de la villa.

## Introducción fotográfica

- `assets/images/optimized/villa-intro-desktop-1920.*` — recorte horizontal de la villa para la pantalla **Explorar**.
- `assets/images/optimized/villa-intro-mobile-900.*` — recorte vertical de la villa para la pantalla **Explorar**.

## Fotografías reales de la villa

- `assets/images/source/villa-pool-wide.jpg` — alberca infinita y vista al Pacífico.
- `assets/images/source/villa-sunset-wide.jpg` — alberca durante el atardecer.
- `assets/images/source/villa-lounge-wide.jpg` — sala panorámica de la propiedad.
- `assets/images/source/villa-interior-wide.jpg` — interior abierto hacia el mar.
- `assets/images/optimized/villa-*.avif` y `villa-*.webp` — variantes responsivas de 640 a 1920 px.
- `assets/images/optimized/villa-hero-*` — recortes editoriales horizontal y vertical para la portada estática del sitio.
- `assets/images/optimized/villa-intro-*` — recortes editoriales para la entrada fotográfica.

Las cuatro fuentes de alta resolución proceden del [anuncio oficial de Villa Calypso en Airbnb](https://www.airbnb.mx/rooms/1324968381846668643), administrado por el propietario del proyecto. Los archivos anteriores de menor resolución se conservan únicamente como respaldo histórico.

## Procedencia y límites

La marca y los recursos originales del proyecto provienen del material entregado por el propietario y del anuncio oficial de Villa Calypso. No se inventaron habitaciones, arquitectura, albercas ni vistas. Los únicos archivos generados son derivados técnicos —cambio de tamaño, formato, iconos y recortes— de las fuentes documentadas arriba.

La carpeta `assets/images/source/` conserva las fuentes de edición dentro del repositorio, pero el workflow de GitHub Pages la excluye del artefacto público. También excluye videos y fotografías históricas de contexto. El sitio publicado utiliza únicamente contenido oficial de la villa y derivados optimizados.
