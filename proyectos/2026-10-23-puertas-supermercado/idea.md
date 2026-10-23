# ¿Por qué las puertas de los supermercados se abren justo cuando te acercas?

Pedido el 2026-10-23 (lista del creador, nº 4: «Los sensores de movimiento que detectan tu presencia»).

## Lo que cuenta, en una frase

No te ven la cara: una cajita encima lanza microondas, y solo si te mueves hacia ella el rebote cambia de tono y el motor abre; si pasas de largo, muchas ni se abren, y otra luz en el umbral evita que se cierren encima de quien está parado.

## Los datos, cada uno con su fuente

- **Lo sorprendente:** la puerta no te reconoce. El sensor de microondas solo registra movimiento. Si el objeto está quieto, la frecuencia que vuelve es la misma que la que salió y no hay detección. Hotron (fabricante de sensores para puertas automáticas): «If the object is static, then the frequency of the reflected microwave is the same as the emitted one and no detection is registered.»
  https://hotron.com/technology/microwave-sensors/
- **La regla que rompe:** parece que te ve, o que nota que estás ahí. No. Fore Access (instalador, Reino Unido): los sensores de activación más habituales usan microondas; «They only detect movement, so cannot be used for presence.» El infrarrojo pasivo (el del calor del cuerpo) «is seldom used on automatic doors.»
  https://www.foreaccess.co.uk/automatic-doors/autodoor-sensors.html
- **El mecanismo, paso a paso:**
  1. La cajita, en el dintel, emite microondas todo el rato y mide la frecuencia que rebota. Fore Access: «Microwave sensors ping out 24GHz radio waves, then measure the frequency reflected back from the target. If the frequency is the same, there is no movement. If the person is walking towards the sensor the frequency will be higher. This is the doppler effect.»
  2. Acercarse sube la frecuencia; alejarse la baja. Hotron: distingue «an approaching movement (higher frequency)» de «a departing movement (lower frequency)», y así la puerta puede abrirse solo en la dirección de llegada.
  3. Ese aviso arranca el motor de las hojas. Hotron lo describe como el sensor que abre la puerta automática en la dirección de aproximación. El operador es electromecánico: la norma europea EN 16005 cubre puertas peatonales motorizadas (el vídeo no cita la norma en voz; el motor se ve).
  4. Pasar de largo no cuenta como acercarse. Fore Access: los de microondas «are insensitive to pedestrians walking across the entrance (cross traffic)», y los programados para detectar solo a quien se acerca se llaman unidireccionales. En BEA, el VIO-DT1 es unidireccional y el VIO-DT2 es bidireccional: por eso el vídeo dice «muchas», no «todas».
     https://eu.beasensors.com/files/downloads/products/vio-d/commercial-sheets/en/cs-vio-d-en.pdf
  5. Quien se queda parado en el umbral no lo ve el radar. Lo cubre otra luz: infrarrojo activo, hacia abajo, que sí detecta presencia. Fore Access: el infrarrojo activo mide el reflejo; «The output remains on while an object is within the field of view»; en el sensor combinado, la cortina de presencia apunta en vertical al umbral y el óvalo de microondas es el que abre. BEA VIO-D: radar Doppler para abrir y dos cortinas de infrarrojo activo (24 puntos) para la seguridad, según EN 16005. Detección de presencia, no de movimiento. Tiempo de respuesta típico del infrarrojo: menos de 256 ms. El vídeo no dice los 24 puntos ni los 256 ms: son de ese modelo.
- **Cifras que se comprobaron y no se dicen** (cambian con el modelo y con la altura de montaje; decirlas como si fueran de todas las puertas sería falso):
  - BEA VIO-D: frecuencia del radar 24,150 GHz; potencia radiada menor de 20 dBm EIRP (eso es menos de 0,1 W) y densidad menor de 5 mW/cm²; velocidad mínima de detección 5 cm/s; zona de radar 4 m × 2 m a 2,2 m de altura (en el catálogo de BEA de otro radar del mismo tipo figura como 4 m de ancho × 2 m de fondo; el folleto del VIO dibuja 4 m de lado a lado y 2 m hacia fuera). Altura de montaje de 1,8 a 3 m. Zona de infrarrojo en la ficha comercial: 2,2 m × 25 cm a 2,2 m; en el folleto de gama, 2,2 m × 0,5 m. No se redondea a «cuatro metros» de alcance: el fondo de esa zona es del orden de dos metros, y el ángulo del radar se ajusta de 15° a 50°.
  - Fore Access redondea la frecuencia a 24 GHz. Encaja con los 24,150 GHz de BEA.
- **Matiz:** no todas las puertas van igual. Las hay unidireccionales y bidireccionales (BEA VIO-DT1 y VIO-DT2). Las antiguas se abrían con una alfombra que pisabas (Horton, 1954, actuador de alfombra; Wikipedia «Automatic door», y el repaso de Michael Panish). Hoy la alfombra casi solo se pone al reponer una vieja (Fore Access). El vídeo no cuenta la alfombra: la historia es la de ahora, la cajita de arriba.
  https://en.wikipedia.org/wiki/Automatic_door
  https://www.constructionwitness.com/published-articles/automatic-doors-sensors/automatic-door-sensors-the-evolution-of-automati/

## Cifras que sí se dicen

Ninguna. Las que hay son de un modelo o de una altura de montaje, y el vídeo habla de las puertas del súper en general. El mecanismo (Doppler, unidireccional en muchas, cortina de infrarrojo en el umbral) sí es el de los sensores que se instalan.

## Comparación de casa

- La sirena de una ambulancia que se acerca y se pone más aguda: es el mismo efecto Doppler que el rebote de la cajita. No es una cifra; es la comparación que todo el mundo ha oído.

## Fuera

- Los 24,150 GHz, la décima de vatio, los 5 cm/s, los 4 m × 2 m y los 24 puntos de infrarrojo: de la ficha del BEA VIO-D, no de todas las puertas.
- Que «no calientan»: con menos de 0,1 W no es un microondas de cocina, pero el vídeo no lo afirma.
- La alfombra de presión de 1954: verdad histórica, y sobra para la frase del vídeo.
