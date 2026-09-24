# Contexto del proyecto — Praise Music Awards

Sitio web de una premiación de música cristiana ("Praise Music Awards"). Nació como el sitio de un artista (Sergio Santiago, estética glitch/cyberpunk, nombre de carpeta "Pagina GLYTCH") y se rediseñó por completo el 2026-09-16 como web de gala de premios.

- **Repo:** https://github.com/elvicticor/Page_Santiago (rama `main`)
- **URL pública:** https://elvicticor.github.io/Page_Santiago/
- **Idioma del sitio:** español

## Stack

- Astro 5 (sitio estático) + React 19 (solo componentes interactivos) + GSAP 3 (animaciones de scroll)
- CSS global en un solo archivo, sin Tailwind ni librerías de UI
- Fuentes: Playfair Display (títulos) + Inter (texto), vía Google Fonts
- Node/npm
- Supabase (PostgreSQL, Auth y API REST) para usuarios, votos y resultados agregados; se usa el SDK oficial `@supabase/supabase-js`

## Comandos

| Comando | Qué hace |
| :-- | :-- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `http://localhost:4321` (base `/`) |
| `npm run build` | Genera `dist/` (base `/Page_Santiago`) |
| `npm run preview` | Sirve el build local, en `/Page_Santiago/` |

`astro.config.mjs` usa `base: '/Page_Santiago'` solo en producción; en desarrollo la base es `/`.

## Estructura

```
src/
  pages/index.astro        Página principal; define el orden de las secciones
  pages/votar.astro        Página independiente del formulario y resultados (`/votar/`)
  layouts/Layout.astro     <head>, fuentes, preloader, carga de reveal.ts
  styles/global.css        Todo el CSS: tokens, secciones, responsive, modo claro
  scripts/reveal.ts        GSAP ScrollTrigger: aparición al hacer scroll + clase nav.scrolled
  components/
    Navbar.tsx             Menú fijo + botón de tema (React)
    ThemeToggle.tsx        Modo claro/oscuro (localStorage)
    Hero.astro             Portada con CTAs "Ver en vivo" / "Vota ahora"
    Countdown.tsx          Cuenta regresiva a la gala (React)
    About.astro            Misión y 3 pilares
    LiveStream.astro       Sección "En Vivo" (placeholder, sin embed real)
    VoteCTA.astro          CTA que abre `/votar/` en otra pestaña
    VotingForm.tsx         Formulario guiado: 20 categorías × 10 nominados
    AuthVoting.tsx         Registro, login, sesión y puerta de acceso al formulario
    ResultsChart.tsx       Gráfica de pastel por categoría; consulta Supabase cada 30 s
  lib/supabase.ts          Cliente compartido de Supabase (sesión persistente y refresh)
    Nominees.astro         Música nominada (3 tarjetas)
    Books.astro            Libros nominados (tabla, datos en el frontmatter)
    NewsFeed.astro         Noticias
    Blog.astro             Blog tipo revista (datos en el frontmatter)
    Notes.astro            Notas/reflexiones breves
    EventDates.astro       Fechas y sedes
    Carousel.tsx           Galería curada de la gala (React)
    Community.tsx          Fotos subidas por el público (React; sube a Supabase Storage)
    Testimonials.tsx       Mensajes de la comunidad (React; solo estado local)
    SocialFeed.astro / SocialLinks.astro / Footer.astro
public/                    favicon.svg y 1-4.jpg (fotos viejas del artista, ya sin uso)
.github/workflows/deploy.yml   Workflow de Astro → GitHub Pages (Actions)
supabase/schema.sql        Tabla `votes`, RLS, función agregada y recarga del esquema PostgREST
supabase-setup.sql         Tabla `fotos`, RLS y bucket de Storage `fotos-gala` (ejecutar aparte)
.env.example               Plantilla de variables públicas de Supabase
```

Orden de secciones en la página: Hero → Cuenta regresiva → Sobre el premio → En Vivo → Votar → Música → Libros → Noticias → Blog → Notas → Fechas → Galería → Fotos de la comunidad → Mensajes → Redes → Footer.

## Diseño y animaciones

- Estética de gala: fondo negro cálido (`--bg`), dorado (`--gold`), crema (`--fg`), vino (`--wine`) como acento. Tokens en `:root` de `global.css`; modo claro con la clase `.light-mode` en `body`.
- Los elementos con clase `.reveal` empiezan con `opacity: 0` y GSAP los muestra al entrar al viewport (`ScrollTrigger.batch`). **Todo bloque nuevo debe llevar `.reveal`** para animarse; si no, se ve directo.
- Accesibilidad de movimiento: `reveal.ts` usa `gsap.matchMedia()`; con `prefers-reduced-motion` el contenido aparece sin animar. Las animaciones CSS decorativas (brillo del título, punto pulsante de "En Vivo") están dentro de `@media (prefers-reduced-motion: no-preference)`.
- Al probar con capturas de pantalla completa, el contenido bajo el pliegue sale vacío si no se hizo scroll real: es esperado (ver `.reveal`), no un bug.
- El responsive se reforzó para móvil (incluido 360–480 px), tablet y escritorio: navegación, botones, tablas desplazables, carrusel, formularios, gráficas y dispositivos táctiles.

## Votación y Supabase

- El CTA de la página principal abre el formulario en una pestaña nueva: `/votar/` en desarrollo y `/Page_Santiago/votar/` en producción.
- `VotingForm.tsx` muestra una categoría por paso, exige una elección antes de avanzar, permite retroceder, indica progreso y presenta un resumen final.
- Hay 20 categorías con 10 nominados cada una. Los nombres actuales son contenido de referencia y deben reemplazarse por los nominados oficiales.
- La página exige crear una cuenta o iniciar sesión con email y contraseña mediante Supabase Auth. El nombre se envía como `display_name` y un trigger crea automáticamente `public.profiles`.
- El cliente conserva y renueva la sesión automáticamente. La interfaz permite cerrar sesión y reconoce votos ya realizados al volver a entrar o usar otro dispositivo.
- Al enviar, se insertan 20 filas en `public.votes`. Cada fila contiene `user_id`, `category`, `nominee` y `created_at`.
- La restricción única parcial sobre `(user_id, category)` evita un segundo voto por categoría para la misma cuenta, aunque se borren cookies o se cambie de dispositivo.
- La tabla tiene RLS activa. Sólo el rol `authenticated` puede insertar o consultar sus propias filas, y la política exige que `auth.uid()` coincida con `user_id`. El rol anónimo ya no puede votar.
- `public.get_vote_results()` es una función `security definer` que devuelve solamente categoría, nominado y conteo agregado. `ResultsChart.tsx` la consulta cada 30 segundos y dibuja una gráfica de pastel con CSS (`conic-gradient`).
- Proyecto Supabase conectado: referencia `hvfimjmrfheoqmxiskbq`. El esquema fue ejecutado y verificado el 2026-09-22: `get_vote_results` respondió HTTP 200 con `[]` antes de recibir votos.
- Variables requeridas en `.env`:

```env
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- `.env` y `.env.production` están ignorados por Git. La clave publicable está diseñada para el navegador; nunca usar `service_role` ni una clave secreta en variables `PUBLIC_*`.
- Si aparece `PGRST205`, ejecutar `supabase/schema.sql` en Supabase SQL Editor. El script termina con `notify pgrst, 'reload schema';` para actualizar la caché de PostgREST.

## Fotos de la comunidad (Supabase Storage)

- `Community.tsx` (sección "Fotos de la comunidad", id `comunidad`) permite subir una foto + nombre opcional + hashtag opcional, y muestra en una grilla las fotos ya aprobadas.
- Igual que la votación, usa `fetch` directo a la API REST y de Storage de Supabase con las mismas variables `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_PUBLISHABLE_KEY` — no se agregó el SDK `@supabase/supabase-js` (se instaló y se quitó de nuevo, para no duplicar el patrón ya usado en `VotingForm.tsx`/`ResultsChart.tsx` y evitar ~220KB extra en el bundle).
- **Pendiente de ejecutar:** `supabase-setup.sql` en el SQL Editor de Supabase (aparte de `supabase/schema.sql`, que es solo para votos). Crea la tabla `public.fotos` (`aprobado boolean default false`), sus políticas RLS (el público puede insertar con `aprobado=false` y solo puede leer `aprobado=true`) y el bucket público `fotos-gala` con su política de subida.
- **Moderación:** no hay panel propio. Aprobar/rechazar fotos se hace manualmente en el dashboard de Supabase → Table Editor → `fotos`, cambiando `aprobado` a `true` (o borrando la fila).
- **Instagram con hashtag:** sigue sin resolverse la parte de "que aparezcan solas las fotos publicadas en Instagram con el hashtag". La API oficial de Instagram no es viable para este proyecto (requiere cuenta Business + app aprobada por Meta); la alternativa es un widget de pago (Elfsight/Taggbox/Juicer) o, como se implementó, pedirle al usuario que suba la foto aquí y escriba el hashtag como texto.
- Hasta que se ejecute `supabase-setup.sql`, la sección funciona pero la consulta de fotos da 404 (tabla inexistente) y el formulario fallará al insertar; esto es esperado, no es un bug de código.

## Despliegue (estado actual — importante)

Hay **dos mecanismos mezclados** y conviene unificarlos:

1. `deploy.yml` construye y despliega con GitHub Actions en cada push a `main`.
2. Por una demora al activar Actions, se hizo un **parche de emergencia** (commit `fa1d639`): el build de producción (`index.html`, `_astro/`, `favicon.svg`, `1-4.jpg`) está **committeado en la raíz del repo**, y Pages está configurado en "Deploy from a branch" (`main` / root).

Consecuencias:
- El sitio en vivo es lo que hay en la raíz, **no** se actualiza solo al cambiar `src/`. Para publicar un cambio hoy hay que correr `npm run build`, copiar `dist/.` a la raíz, commitear y pushear.
- Esos archivos de la raíz son artefactos generados; no editarlos a mano.
- Para volver al flujo limpio: poner Settings → Pages → Source en "GitHub Actions", borrar del repo `index.html`, `_astro/`, `favicon.svg` y `1-4.jpg` de la raíz, y dejar que `deploy.yml` publique.
- `dist/` y `.astro/` están en `.gitignore`.
- Al publicar, las variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` deben existir en el entorno del build (GitHub Actions, Cloudflare Pages, etc.). Como Astro genera un sitio estático, esos valores públicos quedan incorporados en el JavaScript del navegador.

## Pendientes conocidos

- **Contenido real:** las imágenes son de Unsplash (placeholder), los nominados/libros/noticias/blog/notas son ficticios, y las fechas (gala 2026-12-05, cierre de votos 2026-11-20, sedes Bogotá/Medellín/Lima) son de referencia.
- **Votación real:** reemplazar las 20 categorías y los 200 nominados de referencia por los oficiales.
- **Antifraude:** ya existe cuenta verificada y límite por `user_id`; antes de una votación pública de alto alcance conviene añadir CAPTCHA, límites de frecuencia y revisar la configuración de confirmación de correo.
- **Auth en producción:** configurar en Supabase Authentication → URL Configuration el Site URL y las Redirect URLs de desarrollo y producción.
- **Publicación:** decidir entre mantener GitHub Pages o migrar el frontend a Cloudflare Pages; Supabase se usa como base de datos, no como hosting principal del sitio Astro.
- **En Vivo:** `LiveStream.astro` es un placeholder; hay un `TODO` para reemplazarlo por el iframe de YouTube/Facebook Live.
- **Cuenta regresiva:** la fecha objetivo está fija en `Countdown.tsx` (`TARGET_DATE`); mantenerla sincronizada con `LiveStream.astro`, `Hero.astro` y `EventDates.astro`.
- **Mensajes de la comunidad:** `Testimonials.tsx` guarda en estado local; se pierde al recargar y nadie más lo ve. Necesita backend o quitarse.
- **Fotos de la comunidad:** falta ejecutar `supabase-setup.sql` en Supabase para que funcione la subida/galería (ver sección de arriba); falta también decidir si se paga un widget para el feed automático de Instagram por hashtag.
- **Enlaces de redes y "leer más":** todos apuntan a `#`.
- **SEO / compartir:** faltan etiquetas Open Graph/Twitter e imagen de vista previa.
- **Imágenes:** se cargan a tamaño completo desde Unsplash; conviene optimizarlas o alojarlas localmente.
- **Limpieza:** `public/1-4.jpg` y `README.md` (plantilla genérica de Astro) ya no reflejan el proyecto; `nanostores` se eliminó de las dependencias.

## Historial resumido

1. Sitio estático original de Sergio Santiago (glitch/cyberpunk) → migrado a Astro.
2. 2026-09-16: rediseño completo a Praise Music Awards (paleta dorada, GSAP, secciones nuevas); se eliminaron el reproductor de audio, el visualizador y `nanostores`.
3. Se borró el sitio estático legacy de la raíz (causaba que Pages sirviera el diseño viejo).
4. Se corrigió un bug del menú móvil (el overlay tapaba el botón hamburguesa: `z-index` en `.nav-controls`).
5. Parche de emergencia de despliegue por rama (ver arriba).
6. 2026-09-21: se amplió el responsive global y se creó el formulario guiado de 20 categorías con 10 nominados por categoría.
7. 2026-09-22: el formulario se movió a `/votar/`, el CTA empezó a abrirlo en otra pestaña y se añadió una gráfica de pastel de resultados.
8. 2026-09-22: se conectó Supabase por API REST, se ejecutó `supabase/schema.sql` y se verificaron la función agregada y las políticas RLS.
9. 2026-09-22: se añadió Supabase Auth con registro/login por email, perfiles automáticos y límite de voto impuesto por `user_id` y RLS.
9. 2026-09-22: se agregó la sección "Fotos de la comunidad" (`Community.tsx`, `supabase-setup.sql`), con el mismo patrón de `fetch` a Supabase; falta ejecutar el SQL. Se corrigió además un mismatch de hidratación en `Countdown.tsx` (calculaba la cuenta regresiva en el build en vez de en el navegador).
