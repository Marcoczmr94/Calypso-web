# Villa Calypso — sitio oficial

Sitio estático de Villa Calypso, una residencia privada frente al mar en Acapulco. La portada abre directamente con la campaña **Vacaciones de verano 2026**, el beneficio web y dos canales de conversión claramente diferenciados:

- Disponibilidad y reservación en [Airbnb](https://www.airbnb.mx/rooms/1324968381846668643).
- Atención personalizada y concierge por WhatsApp Business al **+52 744 229 7671**.

La identidad visual oficial utiliza marfil, coral, durazno y verde salvia. El logotipo plano aparece en navegación y cierre; la variante texturizada funciona como pieza editorial dentro de la experiencia.

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
  referralCode: "MCZ-REFERIDO",
  campaignCode: "VACACIONES-VERANO-2026",
  promotionCode: "MCZ10",
  promotionDiscount: "10%",
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

- Campaña comercial `VACACIONES-VERANO-2026`.
- Referencia comercial `MCZ-REFERIDO` para atribuir solicitudes y comisiones.
- Código promocional `MCZ10` con 10% de descuento sobre la tarifa de hospedaje en reservaciones directas confirmadas por el anfitrión.
- Un folio nuevo en cada apertura de WhatsApp con formato `VC-AAAAMMDD-HHMMSS-01`; la secuencia diaria `01`, `02`, etc. se conserva por navegador.
- Parámetros UTM capturados en la primera visita y conservados localmente.
- Datos del formulario cuando el visitante solicita una estancia personalizada.

La fecha, hora y referencia MCZ permiten conciliar cada conversación. La secuencia es local porque GitHub Pages no tiene base de datos; un consecutivo global entre todos los dispositivos requerirá un servicio central. El sitio no procesa pagos, no simula disponibilidad y no confirma reservaciones.

## Enlaces listos para difusión

Usa un enlace distinto en cada canal para conservar el origen dentro del mensaje de WhatsApp:

- WhatsApp: `https://villacalypso.mx/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=vacaciones_verano_2026`
- Instagram: `https://villacalypso.mx/?utm_source=instagram&utm_medium=social&utm_campaign=vacaciones_verano_2026`
- Facebook: `https://villacalypso.mx/?utm_source=facebook&utm_medium=social&utm_campaign=vacaciones_verano_2026`
- Anuncio pagado: `https://villacalypso.mx/?utm_source=meta&utm_medium=paid_social&utm_campaign=vacaciones_verano_2026`

Consulta [`CAMPANA-VACACIONES.md`](./CAMPANA-VACACIONES.md) para textos de difusión y el proceso de seguimiento de prospectos.

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

Todas las fotografías visibles se sirven localmente desde el repositorio. La portada usa recortes oficiales independientes para escritorio y móvil. Las variantes responsivas se regeneran con:

```powershell
python .\tools\optimize_assets.py
```

Las fotografías visibles provienen del anuncio oficial administrado por el propietario. No se publican videos, fotografías externas de contexto ni recursos generados por IA para representar habitaciones, arquitectura o vistas. Consulta [`ASSETS.md`](./ASSETS.md) para la procedencia.
