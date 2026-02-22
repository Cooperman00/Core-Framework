# Click-to-Move Game Client (Prototype)

This is a standalone browser client built from the ground up as a lightweight reference implementation for click-to-move navigation.

## Features

- Tile-based map rendered to a `<canvas>`.
- Click-to-move movement.
- A* route search (4-direction movement) to mirror classic server movement constraints.
- Random obstacle generation so you can test path edge-cases quickly.

## Run locally

Because it uses ES modules, run it behind a local web server:

```bash
cd click-move-client
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Deploy

This client is static and can be deployed to any static host:

- GitHub Pages
- Netlify
- Vercel static hosting
- S3 + CloudFront

Upload the contents of this folder (`index.html`, `styles.css`, `src/`) directly.
