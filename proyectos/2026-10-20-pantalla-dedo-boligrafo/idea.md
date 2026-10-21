# Por qué la pantalla del móvil detecta el dedo y no un bolígrafo

Lo que cuenta el vídeo: la pantalla no nota la presión, nota que algo conductor (el dedo, lleno de agua con sales) se
lleva parte del campo eléctrico que hay en cada cruce de su rejilla de electrodos. Un bolígrafo de plástico no conduce y
no cambia nada.

## Datos (con fuente)
- Las pantallas táctiles de los móviles son capacitivas proyectadas: una rejilla transparente de electrodos en filas y
  columnas; en cada cruce hay una capacidad (un condensador). Fuente: https://en.wikipedia.org/wiki/Capacitive_sensing
- Un dedo o un lápiz conductor cerca del cruce cambia el campo eléctrico local y reduce la capacidad mutua; el
  controlador mide el cambio en cada cruce y localiza el toque. Fuente: Wikipedia (Capacitive sensing) y
  Microchip AN2934 (Capacitive Touch Sensor Design Guide).
- «La capacidad del cuerpo humano le roba parte de la carga» (human body capacitance «steals» some of the charge).
  Fuente: Projected-Capacitive Touch Technology (Stanford, art6.pdf).
- Los lápices para resistivas (de plástico) no funcionan en capacitivas porque no son conductores; los pasivos llevan la
  punta de goma o plástico conductor. Fuente: Wikipedia (Capacitive stylus) y patente US11775085B2.
- Una salchicha funciona como lápiz porque es húmeda y conductora, imita al dedo.

## Lo sorprendente
Una salchicha sí, un bolígrafo no.

## La regla que rompe
«Una pantalla táctil nota que la tocas» (no: nota que algo conductor se acerca).

## Comparaciones de casa
- Guantes de lana: no.
- Salchicha: sí (agua con sales).
- Bolígrafo de plástico: no.
