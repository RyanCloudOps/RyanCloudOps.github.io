# Portafolio de Gary Flores

Portafolio personal minimalista en blanco y negro (modo claro/oscuro), bilingüe (ES/EN), hecho con HTML, CSS y JavaScript sin frameworks.

- Hero con tarjeta ID que gira (personaje ilustrado o foto real)
- Tabla periódica de skills con filtros por categoría
- Timeline de experiencia, certificaciones con scroll lateral y roadmap

## Probar en local

```bash
python -m http.server 5500
```

Abre http://localhost:5500

## Archivos

- `index.html` — contenido (el texto en español está aquí)
- `script.js` — traducciones al inglés (`EN`), skills (`SK`), tarjeta ID, tema e idioma
- `styles.css` — estilos (los colores son variables en `:root`)
- `assets/gary-id.webp` — retrato anime de la tarjeta ID · `assets/gary.webp` — foto real
- `cv-gary-flores.pdf` — el CV que se descarga desde los botones
- `arcade-backup/` — la versión anterior "Cloud Quest" (se puede borrar)

## Publicar en GitHub Pages

1. Sube estos archivos a la rama `main` del repo `Page`.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `root`.
3. La web queda en https://ryancloudops.github.io/Page/
