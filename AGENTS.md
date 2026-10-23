# Reels explicativos

Esta carpeta hace reels explicativos dibujados, en el ordenador de quien la abre, con la IA que la está leyendo. Le
das una idea («hazme un vídeo de por qué el cielo es azul») y sale el vídeo, listo para publicar. Los vídeos se publican solos en sus redes con Zernio (ver «Publicar con Zernio»).

El nivel es el de los ejemplos: `ejemplo/estrella-verde/estrella-verde.mp4` y `ejemplo/alcohol/alcohol.mp4`.

## Al abrir la carpeta

- **«Configúrame», «set me up» o es la primera vez:**
  1. `node motor/doctor.mjs`, e instala tú lo que falte (`npm install` en esta carpeta, ffmpeg, Node).
  2. Si no hay clave de voz, `node motor/clave.mjs`, que abre una página para pegarla.
  3. Si no existe `preferencias.md`, pregunta en un solo mensaje: en qué idioma y para quién son sus vídeos, cómo quiere
     cerrarlos (por ejemplo «Envíaselo a ese amigo que...») y si quiere efectos de sonido. Guárdalo en `preferencias.md`
     con sus palabras.
  4. Dile en una línea que ya puede pedir un vídeo.
- **Cualquier petición de vídeo, reel, guion o ideas para vídeos:** lee `METODO.md` entero y síguelo paso a paso. Lee
  las guías que dice (`guia/`) antes de empezar.
- **«Doctor» o algo se rompe:** `node motor/doctor.mjs` y arregla lo que diga.

## Publicar con Zernio

- Al terminar un vídeo, publícalo sin preguntar: `node motor/publicar.mjs <vídeo>` (nombre de la carpeta en `salida/`).
  Sale en TikTok, Instagram Reels y YouTube Shorts, y la herramienta lo programa 12 horas después del anterior.
- Antes de publicar, el `caption.txt` lleva al final los hashtags que corresponden al tema (6 a 10, en el idioma del vídeo, y
  `#Shorts`). Se añaden a `salida/<vídeo>/caption.txt` después de renderizar. La herramienta no publica si no hay
  hashtags.
- Las cuentas están en `zernio.json` (`node motor/publicar.mjs cuentas` las lista, `configurar` las guarda). No publiques
  en otras. Lo programado se apunta en `publicados.json`; `estado` lo enseña. No publiques dos veces el mismo vídeo.
- La clave de Zernio va en `.env.local` como `ZERNIO_API_KEY`. Si falta, `node motor/clave.mjs --zernio` abre una
  página para pegarla. Nunca se pide en el chat.
- Si el creador pide programar la publicación, pregunta solo la fecha y la hora, y usa la programación de Zernio.
- Tras publicar, dile en una línea dónde ha salido (red y enlace). Si falla, dile qué ha pasado y no reintentes en
  bucle ni publiques dos veces.
- Los vídeos de perros (cuenta de Instagram @porestotuperro, ver `perros.md`) se publican solo ahí, con
  `node motor/publicar.mjs <vídeo> --perfil perros`: un vídeo cada 6 horas, con su propia lista
  (`publicados-perros.json`). Los demás vídeos no usan ese perfil, y los de perros no se publican en las cuentas del
  mando.
- Los vídeos de curiosidades virales (Instagram @curiosidadnomatagato, antes @vetclinic1990, y YouTube @andreaafiliacion,
  ver `curiosidades.md`) se publican solo ahí, con `node motor/publicar.mjs <vídeo> --perfil curiosidades`: un vídeo cada
  2 horas, con su propia
  lista (`publicados-curiosidades.json`). No usan el perfil del mando ni el de perros, y los de esos perfiles no se
  publican en estas cuentas.
- Los vídeos de la cuenta de Instagram @quetaninteligente (en Zernio figura como @inteligenciaiqtest) se publican solo
 ahí, con `node motor/publicar.mjs <vídeo> --perfil inteligencia`: un vídeo cada 4 horas, con su propia lista
 (`publicados-inteligencia.json`). No usan los otros perfiles, y los de los otros perfiles no se publican en esta cuenta.
- Los vídeos de la cuenta de Instagram @plantverdantai (plantas, **en inglés**, ver `plantas.md`) se publican solo ahí,
 con `node motor/publicar.mjs <vídeo> --perfil plantas`: un vídeo cada 4 horas, con su propia lista
 (`publicados-plantas.json`). Siguen la lista de 100 títulos de `plantas.md` en orden y después temas propios. No usan
 los otros perfiles, y los de los otros perfiles no se publican en esta cuenta.
- Los vídeos de problemas de casa y cómo arreglarlos (Instagram @homediagnosis, TikTok @home.diagnosis.ai y YouTube
  @homediagnosisai, **en inglés**, ver `casa.md`) se publican solo ahí, con
  `node motor/publicar.mjs <vídeo> --perfil casa`: un vídeo cada 6 horas, con su propia lista
  (`publicados-casa.json`). Cada 5 vídeos, el cierre manda al «link in bio» (la herramienta paso a paso). No usan los
  otros perfiles, y los de los otros perfiles no se publican en estas cuentas.
- Si dice «a partir de ahora publica directamente», guárdalo en `preferencias.md` con sus palabras y deja de preguntar.

## La carpeta

```
METODO.md        cómo se hace un vídeo, paso a paso (léelo entero antes de cada vídeo)
guia/            el guion, el dibujo y el sonido; muestras.jpg, lo que ya sabe dibujar el kit
motor/           las herramientas (cada una dice cómo se usa con --ayuda) y el kit de dibujo (motor/kit/)
sonidos/         los efectos aprobados (sonidos/LEEME.md)
ejemplo/         dos vídeos hechos con este método, enteros: para ver el nivel y cómo se construyen
proyectos/       un vídeo por carpeta
salida/          los vídeos terminados, con su portada y el texto del post
preferencias.md  lo que vale para todos sus vídeos, con sus palabras
.env.local       la clave de la voz; nunca se enseña ni se comparte
```

## Reglas

- Nunca pidas una clave en el chat: `node motor/clave.mjs`.
- **Nunca le pidas al creador que ejecute un comando:** tienes una terminal en su ordenador.
  - Instalar Node, ffmpeg o lo de `npm install` es trabajo tuyo.
  - Lo único suyo es escribir una contraseña o dar un permiso que el sistema no deja dar a nadie más.
  - Si algo falla por la máquina, arréglalo sin bajar la calidad y apúntalo en `maquina.md`.
- Sin subagentes ni agentes en paralelo, salvo que el creador diga que sí cuando se lo preguntes.
- Publica solo lo que dice «Publicar con Zernio» y solo vídeos de esta carpeta. Nada más se publica ni se envía en su
  nombre.
- Cada vídeo sale de esta carpeta. Para ver el nivel y cómo se construye, usa `ejemplo/`. No copies otros proyectos
  de `proyectos/` salvo que el creador te pida cambiar uno de ellos.
- Tus scripts de prueba van en tu carpeta temporal, no aquí: `motor/`, `guia/` y `ejemplo/` no se tocan al hacer un
  vídeo.
- Lo que el creador quiere para todos sus vídeos («a partir de ahora», «nunca quiero») va a `preferencias.md`, con sus
  palabras. Tus conclusiones no son preferencias suyas. No guardes en tu memoria cómo se hacen los vídeos: está aquí.
- Corto y claro en todo lo que le escribas. Una frase donde iban dos.
- Lo de dentro es tuyo: no le cuentes qué herramientas usas, qué mides ni cómo se revisa. Enséñale el guion y el vídeo,
  y pregúntale solo lo que solo él puede decidir.
- Un vídeo por conversación: el siguiente, en una conversación nueva.
