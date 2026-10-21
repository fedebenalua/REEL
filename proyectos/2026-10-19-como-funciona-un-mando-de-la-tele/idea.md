# Cómo funciona un mando de la tele

Pedido el 2026-10-19. Cierre pedido por el creador para este vídeo: con el móvil también se maneja la tele; que
descarguen la app de la bio.

## Lo que cuenta, en una frase

El mando no tiene cable: le habla a la tele en un morse de luz que tus ojos no ven (infrarroja), y cada botón es un
número distinto.

## Los datos, cada uno con su fuente

- **Lo sorprendente:** el mando emite luz, pero es infrarroja: el ojo no la ve y la cámara del móvil sí (se ve un
  destello morado al pulsar). — Make Tech Easier, «How to Use Your Smartphone's Camera to Test Your Remote»:
  https://maketecheasier.com/smartphones-camera-test-remote-controls-batteries ; National Science Week (Australia),
  «DIY Science: See your TV remote signal»: https://www.scienceweek.net.au/?p=7838 . A veces la cámara de atrás lleva
  filtro y se ve mejor con la de delante (mismas fuentes).
- **La regla que rompe:** no hay cable entre el mando y la tele.
- **El mecanismo:**
  - Al pulsar, la tecla de goma lleva debajo una pastilla conductora (de carbono) que toca dos pistas de la placa y
    cierra el circuito (HackerNoon, «How does a remote control work»:
    https://hackernoon.com/how-does-a-remote-control-work-kpj313u).
  - Un chip convierte el botón en un código: un número. En el protocolo NEC, 32 bits (dirección y orden, cada una
    repetida al revés para comprobar). — Altium, «NEC Infrared Transmission Protocol»:
    https://techdocs.altium.com/display/FPGA/NEC%20Infrared%20Transmission%20Protocol
  - El LED infrarrojo de la punta parpadea a unos 38.000 veces por segundo (38 kHz); así la tele lo distingue de la
    luz de la casa (Dronebot Workshop, «IR remotes»: https://dronebotworkshop.com/ir-remotes/; Altium).
  - En NEC, cada bit es un destello igual seguido de una pausa: pausa corta = 0, pausa larga = 1 (Altium).
  - En la tele, un receptor filtra solo la luz que parpadea a 38 kHz, lee el número y hace la orden (Dronebot).
- **Las cifras:** 38.000 parpadeos por segundo.
- **Comparación de casa:** el morse (pausas cortas y largas); la cámara del móvil, que sí ve esa luz.

Fuera: los códigos de cada marca (cambian), la longitud de onda exacta.
