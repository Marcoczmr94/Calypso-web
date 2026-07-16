# Publicación en Hostinger

El paquete `villa-calypso-hostinger.zip` está preparado para extraerse directamente dentro de `public_html/`.

## 1. Respaldar antes de publicar

1. En el Administrador de archivos de Hostinger abre `public_html/`.
2. Selecciona el contenido actual y crea un archivo comprimido con fecha, por ejemplo `backup-public_html-2026-07-15.zip`.
3. Descarga ese respaldo o muévelo fuera de `public_html/`.
4. Conserva archivos de verificación del dominio sólo si sabes que siguen siendo necesarios.

## 2. Limpiar y subir

1. Borra de `public_html/` la versión anterior del sitio después de crear el respaldo.
2. Sube `villa-calypso-hostinger.zip`.
3. Extrae su contenido directamente en `public_html/`, no dentro de una subcarpeta adicional.
4. Verifica que `public_html/index.html` y `public_html/assets/` existan al mismo nivel.
5. Elimina el ZIP subido cuando termine la extracción.

## 3. Dominio canónico

La versión entregada ya usa `https://villacalypso.mx/` como dominio canónico en:

- `index.html` — canonical, Open Graph y JSON-LD.
- `robots.txt` — ubicación del sitemap.
- `sitemap.xml` — URL principal.
- `assets/js/config.js` — `canonicalUrl`.

Si el dominio cambia en el futuro, actualiza las cuatro ubicaciones y vuelve a crear el paquete.

## 4. Limpiar caché

1. En hPanel abre **Sitios web → Administrar → Rendimiento**.
2. Limpia la caché del sitio si el plan tiene caché de servidor activa.
3. Si usas Cloudflare, purga la caché desde su panel.
4. Prueba también en una ventana privada para evitar caché local.

## 5. Verificar

Comprueba en teléfono y computadora:

- La introducción carga con poster, reproduce el video cuando el navegador lo permite y abre la portada al pulsar **Explorar**.
- El logotipo y las tres fotografías de galería aparecen.
- No hay errores 404 en la consola o red.
- El botón de Airbnb abre el anuncio correcto.
- WhatsApp abre `527442297671` e incluye `MARCO-WEB-CALYPSO` y un folio `VC-...`.
- El menú, la galería, Escape y el formulario funcionan con teclado.
- `robots.txt` y `sitemap.xml` responden con estado 200.

## 6. Volver a la versión anterior

1. Borra la versión nueva de `public_html/`.
2. Sube o mueve de regreso el archivo de respaldo.
3. Extrae el respaldo directamente en `public_html/`.
4. Limpia las mismas cachés y vuelve a probar el dominio.

Nunca elimines el respaldo hasta confirmar que la versión nueva funciona correctamente.
