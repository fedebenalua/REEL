# Cómo te ve tu perro: cómo se hizo

Pedido como «uno igual que el del gato», con un border collie. La primera versión calcaba el del gato (entrar por la
pupila, el salón, el guion casi frase a frase) y el creador pidió otros gráficos y un guion con datos propios de
perros. Se rehízo entero:

- **El guion** cuenta solo lo que está medido en perros (`idea.md`): 20/75 de agudeza (lo que tú distingues a 20 m, él
  a 5), el estudio de 1936 de los perros policía (algo que se mueve a más de 800 m), la visión de dos colores (no en
  blanco y negro), el tapetum lucidum, el escáner de Berns con los olores y el test de la situación extraña de Topál.
  Se quitaron la voz/cara de Adachi (se parecía al del gato) y la cifra de luz (para el perro no hay una firme).
- **El mundo** es otro: un campo al atardecer en 3D (`campo.js`), con el perro de cuerpo entero de frente y de
  espaldas (`perro.js`), y lo que ve él enseñado por encima de su hombro: el desenfoque es el mismo en píxeles, así que
  al acercarte de 20 a 5 m se te distingue. Los colores de la escena de las flores pasan por la matriz de Machado et
  al. (2009) para la ceguera al verde: la pelota roja y la hierba quedan del mismo ocre.
- Del hook se hicieron dos aperturas y el creador eligió la B (la trufa pegada a la cámara). La otra, el perro
  corriendo hacia ti, está en `video/aperturas/01-corre.js`. El último plano baja hasta la trufa: enlaza con el primero.

Sin efectos de sonido (preferencias). No se publica en Zernio: el creador lo pidió así.

Al revisarlo:
- El perro de frente parecía un muñeco sobre zancos: el pecho se alargó con flecos, las patas se ensancharon y los
  muslos de atrás pasaron a ser una sola masa detrás.
- De espaldas parecía un disfraz con bufanda: el collar blanco queda solo a los lados, el cuerpo se ensancha en las
  caderas, lleva borde de pelo y los pies de atrás.
- En la escena de los colores, «ve» encontraba la primera palabra de la frase y el gris no salía.
- En la noche, el rayo iba al ojo equivocado (+x del mundo sale a la izquierda de la pantalla).
- En el escáner, la sala era casi blanca bajo el subtítulo: se oscureció y lleva un velo arriba.
- La tarde, de cielo muy claro, dejaba el subtítulo ilegible: todos los planos del campo llevan un velo suave arriba.
- La noche estaba casi quieta y negra al principio: el perro se ve un poco más y la cámara se mueve a un lado.
- El salto en 41,5 s era la hierba de delante, que dejaba de estar borrosa al salir corriendo el perro: ahora el
  desenfoque no cambia y el perro se dibuja nítido encima.
