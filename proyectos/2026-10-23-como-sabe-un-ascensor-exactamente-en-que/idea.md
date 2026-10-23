# Cómo sabe un ascensor exactamente en qué piso está

Pedido el 2026-10-23 (lista del creador, nº 1: «Los sensores y sistemas de posición que controlan el ascensor»).

## Lo que cuenta, en una frase

El ascensor no ve los pisos: los cuenta con una rueda que manda pulsos, se aprende de memoria dónde está cada piso en un
viaje de aprendizaje, y los imanes de cada piso le confirman la cuenta y lo dejan a menos de un milímetro del suelo.

## Los datos, cada uno con su fuente

- **Lo sorprendente:** no tiene ojos ni cámara; el número del piso sale de contar. (Idea del vídeo, apoyada en lo de abajo.)
- **La regla que rompe:** «si sabe el piso, será que lo ve».
- **La rueda y los pulsos.** Una rueda sencilla va pegada al raíl por el que sube la cabina; lleva un imán que gira con
  ella y un circuito lo detecta y genera dos trenes de pulsos desfasados 90°. Según cuál llega primero, sabe si sube o
  baja. Fuente: Motion Control Engineering (Nidec), *iLand Compact Installation* (manual 42-IS-0173),
  https://acim.nidec.com/elevators/-/media/elevators/mce/pdfs/iland-compact-a6.ashx
  - Otros ascensores llevan el codificador en el eje del motor o en una cinta con ranuras: patente WO2004106210A1,
    https://patents.google.com/patent/WO2004106210A1/en («muchos ascensores», no todos: por eso en el vídeo es «en muchos
    ascensores hay una rueda...»).
- **El viaje de aprendizaje.** Al instalarlo, la cabina sube de abajo arriba a velocidad lenta, cuenta los pulsos de todo
  el recorrido y guarda el recuento de cada piso. Fuentes: manual iLand (arriba, «during hoistway learn operations ...
  stores the floor height position (pulse count) at each landing»), manual Ethos E-Series Shaft Encoder, apartado 6
  «Shaft Learn Procedure» (lento, 0,25 m/s),
  http://www.tvcl.co.uk/wp-content/uploads/2016/07/TVL-315-issue-7-Ethos-E-SEncoder-Manual-Rev-7.pdf, y patente Otis
  US 6526368 («learning run», tabla de pisos), https://www.freepatentsonline.com/6526368.html
- **Después**, con el recuento guardado y el contador de pulsos, el control sabe dónde está la cabina (manual iLand).
- **Contar se descuadra.** «Error correction is necessary at each landing in order to compensate for rope slippage and the
  like»: patente WO2004106210A1 (arriba). La patente Otis US 6526368 también habla de compensar el deslizamiento del cable
  del limitador y el asentamiento del edificio.
- **El imán de cada piso.** Un imán de tira de unos 15 cm (seis pulgadas) en el raíl, colocado con la cabina a nivel del
  piso. En la cabina, tres sensores de efecto Hall: «Up Level», «Door Zone» y «Down Level». Fuente: manual iLand.
- **Menos de un milímetro.** El control usa esas tres señales con la posición y la velocidad para frenar y dejar la
  cabina «a menos de 1/32 de pulgada» del nivel del piso: 1/32 in = 0,79 mm. Fuente: manual iLand.
- Las cifras de la tabla del dibujo (0, 3.420, 6.840...) son de ejemplo (un piso de unos 3 m con un codificador de unos
  1.100 pulsos por metro, como el del manual iLand: 348 pulsos por pie), no de un ascensor concreto. El vídeo no las dice
  en voz alta.

## Comparaciones con cosas de casa

- El cuentakilómetros de la bici: una rueda que gira y va contando.
- Las marcas de un metro de carpintero apuntadas en la libreta: la tabla de pisos.
