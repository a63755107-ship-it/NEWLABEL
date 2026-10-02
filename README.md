# NEWLABEL

## Estructura
```
NEWLABEL/
├── index.html
├── package.json
├── css/styles.css
├── js/ app.js · data.js · brands.js · filters.js · router.js · submit.js
├── scripts/generate-brands-index.js
├── data/
│   ├── brands-index.json            (se genera solo)
│   └── brands/<slug>/brand.json
└── images/brands/<slug>/ cover.jpg · 01.jpg · 02.jpg · 03.jpg
```

## Arrancar (necesitas un servidor local: fetch() no funciona con file://)
Con Node.js instalado, en la terminal de VS Code, dentro de NEWLABEL:
```
npm start
```
Esto regenera el índice y abre un servidor (te dará una URL, normalmente http://localhost:3000).
Alternativa: ejecuta `npm run generate-brands` y abre index.html con Live Server.

## Añadir una marca
1. Crea la carpeta `data/brands/mi-marca/` (el nombre de la carpeta = el slug, en minúsculas y con guiones).
2. Dentro crea `brand.json` (copia el de otra marca y cambia los datos). Solo `name` es obligatorio.
3. Crea `images/brands/mi-marca/` y copia `cover.jpg`, `01.jpg`, `02.jpg`... (los nombres deben coincidir con los de `images` en el JSON).
4. Ejecuta `npm run generate-brands` (o `npm start`, que ya lo hace).
5. Recarga la web.

## Modificar una marca
Ejemplo: cambiar Aura Objects de Madrid a Barcelona → abre `data/brands/aura-objects/brand.json`, cambia `"city": "Madrid"` por `"city": "Barcelona"` y guarda. No hace falta ejecutar nada; recarga la web. Para borrar una marca, borra su carpeta en `data/brands` y ejecuta `npm run generate-brands`.

## Notas
- Los filtros y categorías se generan de los datos: un estilo, categoría o país nuevo aparece solo.
- Si falta una imagen se muestra un placeholder; si un brand.json es inválido se omite con un aviso en la consola (F12).
- Favoritos: se guardan en localStorage por slug.
- Submit: el formulario NO guarda nada. Pon tu backend en `SUBMIT_ENDPOINT` (js/submit.js).
