# Vídeos de perros (@porestotuperro)

Cuenta de Instagram **@porestotuperro**. Vídeos de cosas curiosas que hacen los perros y por qué, en español de España
(voz, subtítulos, texto del post y hashtags). Un vídeo cada 6 horas.

- Se publican solo en esa cuenta: `node motor/publicar.mjs <vídeo> --perfil perros` (el perfil está en `zernio.json`;
  la lista de lo programado, en `publicados-perros.json`). No se publican en las cuentas del mando.
- Cierre de cada vídeo: «Envíaselo a ese amigo al que...» con un remate gracioso sobre su perro.
- Un tema nuevo cada vez: mira `proyectos/` (carpetas que tengan «perro» o «perros») y `publicados-perros.json` y no repitas.
- Di solo lo que la ciencia sostiene. Si un efecto está discutido (por ejemplo, la brújula magnética al hacer caca),
  cuéntalo con ese matiz: «parece», «según un estudio», «no todos los estudios lo confirman».

## Cómo se dibuja el perro (obligatorio)

- Un solo perro para todos los vídeos: `perros/mundo.js` (el de `proyectos/2026-10-22-perro-tira-correa`). Impórtalo desde
  el plano, no copies ni dibujes otro. Mira primero `perros/muestra-*.jpg` y los planos que cita la cabecera del archivo.
- Antes de renderizar, mira con `ver.mjs` el perro en 3 momentos (quieto, en movimiento, en primer plano). Si el perro
  se ve plano, torcido, con patas raras o con menos volumen que `perros/muestra-*.jpg`, arréglalo antes de seguir.
- Si hace falta otra pose (sentado, tumbado, de frente), amplía `perros/mundo.js` con un parámetro nuevo y deja el
  mismo estilo (volumen, luz, patas con `miembro()`). Los vídeos nuevos reutilizan esa mejora.
- Escenas en casa: `salon(g, c, t, hora)` de `perros/mundo.js` (sofá, ventana, alfombra, suelo de madera). Poses: `sentado`
  y `tumbado`. Ahí van la mayoría de planos de «el perro en casa»; el parque, para los de paseo.
- Nada de perros de frente con ojos enormes ni de cuerpos hechos con óvalos sueltos: es lo que peor se ve.

## Nivel de calidad (obligatorio, antes de renderizar)

- Compara cada plano con `perros/muestra-*.jpg` y con el vídeo de la correa. Si se ve más pobre (menos luz, menos fondo,
  menos volumen), rehazlo; no publiques «aceptable».
- Mira cada plano a resolución completa en 3 momentos (inicio, mitad, final) con `ver.mjs` y revisa: perro entero dentro de
  cuadro, patas apoyadas en el suelo con sombra, fondo con capas (no un color liso), texto sin pisar al perro.
- Ningún plano estático: el perro, la cámara o el fondo se mueven siempre (respiración, cola, parpadeo, parallax, zoom lento).
  Un perro en una sola pose sin vida durante 3 segundos no vale.
- La persona, solo entera y pequeña en cuadro (como en la correa) o solo las manos; jamás unas piernas gigantes llenando la
  pantalla.
- Cambia de plano al menos cada 3 segundos y varía el encuadre (general, medio, primer plano del hocico o los ojos).
- Si `revisar.mjs` avisa de algo, se arregla; no se ignora.

## Ya hechos

- Por qué tu perro tira de la correa (`proyectos/2026-10-22-perro-tira-correa`).
- Por qué mueve la cola más hacia un lado (`proyectos/2026-10-22-perro-mueve-la-cola`).
- Por qué inclina la cabeza cuando le hablas (`proyectos/2026-10-23-perro-inclina-cabeza`).
- Por qué come hierba (`proyectos/2026-10-23-perro-come-hierba`).
- Por qué patalea al rascarle el costado (`proyectos/2026-10-23-perro-patalea`).
- Por qué levanta la pata para hacer pis (`proyectos/2026-10-23-perro-levanta-la-pata`).
- Por qué bosteza cuando tú bostezas (`proyectos/2026-10-24-perro-bosteza`).
- Por qué se lame la nariz (`proyectos/2026-10-24-perro-lame-la-nariz`).

## Ideas pendientes

- Por qué los perros hacen caca alineados con el norte y el sur (el estudio de 2013 y lo que pasó después).
- Por qué giran en círculo antes de echarse.
- Por qué se revuelcan en cosas que huelen fatal.
- Por qué inclinan la cabeza cuando les hablas.
- Por qué ladran a la nada de noche.
- Por qué entierran los huesos.
- Por qué corren a lo loco de repente (la «zoomies»).
- Por qué te traen el juguete y no te lo dan.
- Por qué suspiran al echarse.
- Por qué tienen miedo a los petardos.
- Por qué levantan la pata para hacer pis.
