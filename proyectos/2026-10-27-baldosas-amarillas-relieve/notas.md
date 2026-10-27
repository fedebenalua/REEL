# El mapa que se lee con los pies: cómo se hizo

Título 4 de `gato.md`. Hook: la pregunta tal cual. Cierre: «Envíaselo a ese amigo que las pisa cada día sin saber lo
que dicen».

- La calle es un mundo 3D propio (`video/mundo.js`): acera de baldosas, franja de rayas, banda de botones (cúpulas
  truncadas dibujadas como sprites según el ángulo de la mirada), paso de cebra, coches, farolas y una avenida al
  fondo con el sol poniéndose. Sirve para el hook, para «para» y «sigue», para 1967 y para el final.
- Medidas de verdad en el plano de cerca: botón de 25 mm de base y 4 mm de alto; moneda de 1 € de 23,25 × 2,33 mm.
- Matiz del color: en España la ley pide contraste, no amarillo (frase 11, con la franja oscura sobre suelo claro).
- La voz salió en 64,7 s: se acortaron dos frases y se aceptó esa toma.

Al revisarlo:
- Las luces (escaparates, farolas, faros) casi pegadas a la cámara salían enormes y lavaban la imagen: se apagan
  cuando quedan a menos de 2,5 m.
- La luz de las farolas en el suelo aparecía de golpe al cruzar la cámara: ahora va en el tono de cada baldosa, y las
  baldosas lejanas se funden en vez de aparecer.
- Las pisadas casi debajo de la cámara salían como destellos azules: se apagan de cerca.
- El tramo de la vista borrosa estaba quieto: la cámara avanza y unas pisadas siguen la franja amarilla.
- `k.red` como textura parecía mármol: se usa un grano propio (`GRANO`) con `createPattern`.
- El salto de 32,4 s es la onda de luz del musgo, buscada.
