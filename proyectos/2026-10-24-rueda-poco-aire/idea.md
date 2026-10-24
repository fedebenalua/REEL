# ¿Cómo sabe un coche que una rueda tiene poco aire?

Pedido el 2026-10-24 (lista del creador, nº 5: «Los sensores de presión o el análisis de velocidad de las ruedas»).

## Lo que cuenta, en una frase

El coche no mira la rueda: o un sensor dentro, pegado a la válvula, mide el aire y lo manda por radio, o cuenta las vueltas de cada rueda, porque con menos aire es más pequeña y gira más deprisa; si las cuatro bajan igual, lo nota porque cada rueda vibra más despacio.

## Los datos, cada uno con su fuente

- **Lo sorprendente:** no hay ojos ni nadie vigilando la rueda. Hay dos sistemas. El directo lleva un sensor de presión dentro de cada rueda, casi siempre en el interior de la válvula, con una pila, y manda la presión por radio a un receptor del coche. El indirecto no lleva ese sensor: usa los sensores de velocidad de las ruedas del ABS. Con menos aire, el radio de rodadura baja y esa rueda gira más deprisa que las otras.
  - NHTSA, informe 811681 (2012), «Evaluation of the Effectiveness of TPMS»: «direct systems use a physical pressure sensor inside each tire… The system's sensors are most often located on the interior end of a tire's valve stems… pressure information must be transmitted to the vehicle via a battery-powered radio frequency transmitter.» «Indirect systems use individual wheel rotation speeds gathered from the anti-lock brake system (ABS) wheel speed sensors… if a single wheel has a faster rotational speed than other tires, then its radius or rolling circumference must be smaller and therefore the tire may be underinflated.»
    https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/811681
  - NHTSA, propuesta de 2001 (explica el mecanismo que luego quedó en la norma): «As a tire's pressure decreases, the rolling radius decreases, and the rotational speed of that wheel increases correspondingly.»
    https://www.federalregister.gov/documents/2001/07/26/01-18637/federal-motor-vehicle-safety-standards-tire-pressure-monitoring-systems-controls-and-displays
- **La regla que rompe:** parece que el coche «ve» que la rueda está baja, o que solo lo sabe si mide el aire. No. En unos mide el aire; en otros no hay sensor dentro y solo mira cómo giran las ruedas. Los dos valen para la norma europea: el Reglamento ONU 141 define el sistema como uno que «can evaluate the pressure of the tyres or the variation of pressure over time», sin imponer el sensor.
  https://eur-lex.europa.eu/eli/reg/2021/1463/oj/eng
- **El mecanismo, paso a paso:**
  1. Sensor directo: mide la presión en la válvula y la emite por radio. El testigo se enciende en el cuadro (aviso óptico del Reglamento ONU 121, según el 141). NHTSA 811681, citado arriba.
  2. Sin sensor: los sensores del ABS cuentan las vueltas. La rueda con menos aire es más pequeña y, para el mismo camino, da más vueltas. NHTSA 2001 y 811681.
  3. Si las cuatro pierden aire por igual, comparar vueltas no basta: todas se aceleran juntas. Los sistemas indirectos que cumplen la norma (tienen que avisar también con las cuatro bajas) miran además el espectro de la vibración de cada rueda. Con menos aire, la frecuencia de resonancia baja y la amplitud sube. Tesis de la Universidad de Linköping hecha con NIRA Dynamics (TPI): el sistema detecta cambios en «Relative roll radius (continuous comparison of all four wheels)» y en «Spectral behavior (frequencies and amplitudes of vibrational modes)». La ficha de TPI lo dice así: un algoritmo mira que la rueda gire más deprisa (el radio baja) y otro mira «a decrease in resonant frequency and an increase in amplitude». TPI detecta una, dos, tres o las cuatro ruedas.
    https://www.control.isy.liu.se/en/student/exjobb/external/nira20151207.pdf
    https://mono.ipros.com/en/product/detail/2000712249/
    https://www.niradynamics.com/products/tire-pressure-indicator
  4. En un turismo de la UE (categoría M1, hasta 3.500 kg, neumáticos C1), el Reglamento ONU 141 exige que el testigo se encienda como mucho a los 10 minutos de conducir después de que una rueda haya perdido un 20 % de la presión de servicio, o esté a 150 kPa, lo que sea más alto. Si bajan todas, el plazo del ensayo de difusión es de 60 minutos, al mismo umbral (y 7 kPa más en el procedimiento de ensayo).
    Reglamento ONU 141, puntos 5.2.1 y 5.3.1: https://eur-lex.europa.eu/eli/reg/2021/1463/oj/eng
- **Desde cuándo es obligatorio aquí:** en la UE, el control de presión es obligatorio en los turismos nuevos desde el 1 de noviembre de 2014 (tipos nuevos desde el 1 de noviembre de 2012). Nota de la Comisión Europea IP/12/1169 y Reglamento (CE) 661/2009. El vídeo no dice la fecha.
  https://ec.europa.eu/commission/presscorner/detail/en/ip_12_1169
- **La norma de Estados Unidos, que no se dice:** la FMVSS 138 pide aviso con un 25 % por debajo de la presión de la pegatina, o la presión mínima de la tabla, lo que sea más alto, en hasta 20 minutos, y también con las cuatro ruedas. Es otra cifra, de otro sitio. El vídeo habla para España y usa el 20 % europeo, dicho como «alrededor de una quinta parte» porque el umbral real es el mayor entre el 20 % y 150 kPa, y porque un coche puede avisar antes.
  https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-571/subpart-B/section-571.138

## Cifras que sí se dicen

- «Alrededor de una quinta parte»: el 20 % del Reglamento ONU 141 (5.2.1 y 5.3.1). «Alrededor» cubre el suelo de 150 kPa y que el aviso puede llegar antes de ese porcentaje.

## Comparación de casa

- Una moneda al lado de un plato, rodando el mismo camino: la pequeña da más vueltas. No hay una cifra de cuántas: en la imagen la moneda es más grande de lo que sería al lado de un plato de verdad, para que se vea, y gira las veces que tocan a ese tamaño dibujado.

## Fuera

- Los 10 minutos, los 60, los 150 kPa y los 7 kPa del ensayo: son plazos y suelos de la norma, no lo que tarda el testigo de cada coche. No se dicen.
- La frecuencia de radio (315 o 433 MHz) y los años de la pila: cambian con el modelo. No se dicen.
- El 25 % de la norma de Estados Unidos. No se dice.
- Que el cambio de radio con un 20 % menos de aire es pequeño. En la imagen se exagera para que se vea; la voz no dice cuánto más pequeña ni cuánto más deprisa.
- Que todos los sensores van en la válvula. NHTSA dice «most often». La voz dice «en unos» y «pegado a la válvula», que es el caso habitual, no el único (hay sensores abrazados a la llanta).
