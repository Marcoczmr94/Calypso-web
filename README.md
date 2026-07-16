# Villa Calypso — sitio oficial

Sitio estático de Villa Calypso, una residencia privada frente al mar en Acapulco. La experiencia abre con el video oficial y un acceso **Explorar**, seguido por las fotografías reales de la propiedad y dos canales de conversión claramente diferenciados:

- Disponibilidad y reservación en [Airbnb](https://www.airbnb.mx/rooms/1324968381846668643).
- Atención personalizada y concierge por WhatsApp Business al **+52 744 229 7671**.

No requiere framework, base de datos ni proceso de compilación. Funciona en GitHub Pages, un servidor HTTP local y la raíz de `public_html/` en Hostinger.

## Vista local

Desde la raíz del proyecto:

```powershell
python -m http.server 4173
```

Después abre `http://127.0.0.1:4173/`. No se recomienda abrir `index.html` directamente porque los navegadores aplican reglas distintas a los archivos locales.

## Configuración comercial y redes

Toda la configuración está centralizada en [`assets/js/config.js`](./assets/js/config.js):

```js
window.SITE_CONFIG = Object.freeze({
  airbnbUrl: "https://www.airbnb.mx/rooms/1324968381846668643",
  whatsappNumber: "527442297671",
  referralCode: "MARCO-WEB-CALYPSO",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: ""
});
```

Las redes con URL vacía permanecen ocultas automáticamente. No se generan enlaces ficticios.

Si cambia el dominio público, actualiza también estas ubicaciones:

- `canonicalUrl` en `assets/js/config.js`.
- `canonical`, Open Graph y JSON-LD en `index.html`.
- URL del sitemap en `robots.txt`.
- URL principal en `sitemap.xml`.

## Referido y seguimiento

Cada enlace de WhatsApp incluye:

- Referencia comercial `MARCO-WEB-CALYPSO`.
- Folio persistente por navegador con formato `VC-AAAAMMDD-XXXXX`.
- Parámetros UTM capturados en la primera visita y conservados localmente.
- Datos del formulario cuando el visitante solicita una estancia personalizada.

El sitio no procesa pagos, no simula disponibilidad y no confirma reservaciones.

## GitHub Pages

El workflow [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) publica únicamente los archivos de producción cuando hay un `push` a `main`.

En el repositorio, selecciona una sola vez **Settings → Pages → Source → GitHub Actions**. El dominio canónico configurado es:

`https://villacalypso.mx/`

El archivo `CNAME` conserva el dominio personalizado en cada publicación. La URL `https://marcoczmr94.github.io/Calypso-web/` queda únicamente como dirección técnica de GitHub Pages.

## Hostinger

El archivo `villa-calypso-hostinger.zip` contiene sólo los archivos que deben copiarse a `public_html/`. Consulta [`HOSTINGER.md`](./HOSTINGER.md) para despliegue, verificación y reversión.

## Estructura

```text
.
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── CNAME
├── .nojekyll
├── assets/
│   ├── brand/
│   ├── cinema/
│   ├── css/
│   ├── images/
│   └── js/
├── .github/workflows/pages.yml
├── ASSETS.md
├── CHANGELOG.md
├── HOSTINGER.md
└── QA-REPORT.md
```

## Medios

Todos los videos y fotografías se sirven localmente desde el repositorio. La portada posterior a **Explorar** es una fotografía fija; el video oficial sólo aparece en la introducción. Las variantes responsivas se regeneran con:

```powershell
python .\tools\optimize_assets.py
```

Las fotografías de la propiedad provienen del anuncio oficial administrado por el propietario. Las imágenes de contexto de Acapulco proceden de Pexels y se mantienen separadas de la galería de la villa. No se usan recursos generados por IA para representar habitaciones, arquitectura o vistas. Consulta [`ASSETS.md`](./ASSETS.md) para procedencia y licencias.
