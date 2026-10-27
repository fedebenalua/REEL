# Septiembre, el siete que acabó noveno: cómo se hizo

Título 5 de la lista de `gato.md`. Dos sitios: el calendario de la pared (el hook y las frases 2-3) y la rueda del año
romano (todo lo demás, con una sola cámara y un corte en «romanos»).

- El hook: las hojas del taco salen volando desde el fotograma 0 y queda SEPTIEMBRE en su palabra; SEPT se enciende en
  oro con la moneda del 7 y, en «noveno», el año entero se coloca en la pared con el 9 en rojo. Oro = lo que dice el
  nombre; rojo = su puesto. Las monedas saltan dos hojas atrás en «dos» y ahí cuadran.
- La rueda: los nombres en latín tallados, los números en un anillo de lapislázuli. En «empezar en enero» gira la
  rueda; en «se corrieron dos puestos» gira el anillo de los números dos casillas hacia atrás (el 1 pasa de marzo a
  enero y el 9 de noviembre cae en septiembre).
- Datos: el año de diez meses se cuenta como «según contaban ellos» porque los historiadores lo discuten. Lo de que
  el año empezó en enero «por culpa de Segeda» no se usa (Livio solo habla de la fecha de los cónsules).

Lo que se arregló al revisar:
- Las hojas que volaban, primero se daban la vuelta y tapaban la pantalla con el dorso gris: ahora salen girando de
  frente hacia los lados, y SEPTIEMBRE se ve a tiempo.
- La textura de la pared tenía costuras al repetirse: se pone en espejo.
- La rueda salía beige y apagada: muro rojo pompeyano, anillo azul con números de oro.
- 6-10 s y 30-33 s salían casi quietos: la cámara recorre octubre, noviembre y diciembre, y el anillo de los números
  gira de verdad.
- El final se alejaba hacia un muro vacío: ahora entra en SEPTEMBER encendido, con pétalos de oro.
- Sin efectos de sonido (preferencias).

## La letra en el render
- En el render final (por hilos) los subtítulos y las cabeceras salían con una letra de máquina de escribir en lugar de
  Figtree. Causa: `render.mjs` carga el proyecto en el hilo principal (sin Figtree registrada) y `mundo.js` usaba
  letras al cargarse (hojas predibujadas, consulta de familias, medidas de los nombres). Eso estropea Figtree en los
  hilos. Arreglado haciéndolo todo perezoso: nada de letras hasta el primer `dibuja`.
