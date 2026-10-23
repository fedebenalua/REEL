# ¿Cómo sabe una lavadora cuánta ropa has metido?

Pedido el 2026-10-23 (lista del creador, nº 3: «Cómo estima la carga mediante el motor y otros sensores»).

## Lo que cuenta, en una frase

No hay una báscula: el tambor gira en seco, la ropa sube a un lado y el motor mide la corriente que hace falta para levantarla; con eso ajusta el agua y el tiempo, y otro sensor cuenta el agua que entra.

## Los datos, cada uno con su fuente

- **Lo sorprendente:** la lavadora calcula el agua y la duración según el peso de la ropa, y lo hace antes de llenar. Samsung UK (soporte, act. 27 ene 2022): el «load sensing» o «initial sensing» detecta el peso «before the water fills the drum», ajusta el agua y el tiempo del ciclo, y en general el sensor trabaja cerca de un minuto antes de entrar el agua; el tambor gira unos 30 segundos para detectar el peso. Con más peso el lavado se alarga; con menos, se acorta.
  https://www.samsung.com/uk/support/home-appliances/why-does-my-washing-machine-keep-changing-the-washing-time/
- **La regla que rompe:** parece que la pesa. No hace falta una báscula: el peso sale de lo que le cuesta al motor mover el tambor.
- **El mecanismo (motor):** patente de BSH (Bosch und Siemens) US 6,374,444. El tambor es horizontal. El motor lo gira desde la posición en la que la ropa está abajo (0°) hasta una posición alzada, en la que el centro de gravedad de la ropa queda desplazado a un lado del plano vertical que pasa por el eje. El peso se obtiene de la corriente del motor medida en esa posición. (Hay otra variante en la misma patente: girar hasta una corriente máxima guardada y deducir el peso del ángulo recorrido.) Sirve para indicar la carga y para regular el proceso.
  https://patents.google.com/patent/US6374444B1/en
- **Qué hace con esa medida:** Bosch, folleto Laundry Care (2021): «Each wash is intelligently weighed by the automatic load detection.» ActiveWater adapta el agua al tamaño de la carga. En modelos con ActiveWater Plus habla de hasta 256 niveles de carga y de detectar el agua que entra; es de modelos concretos, y el vídeo no lo dice.
  https://media3.bosch-home.com/Documents/18238358_Bosch_Laundry_Care_Brochure_072021.pdf
- **Los otros sensores (agua, no peso):** folleto Bosch Home Australia «Simply perfect» (i-DOS, 3.ª ed. 2014; en la propia portada, www.bosch-home.com.au). ActiveWater usa dos sensores. El de nivel mide cuánto tarda la ropa en embeber el agua y cuánta embebe (el algodón embebe más que un sintético ligero). El de caudal («flow rate sensor») «knows at any given time how much water has been supplied to the drum». El mismo folleto: «The load sensor detects how much laundry is in the drum.»
  https://manuals.plus/m/bfbdfa4d02f57d3ca9244487d022349bc66666fa5791ccca0e4b76d2ad777d33.pdf
- **Cómo es el sensor de caudal, en un modelo:** instrucciones de reparación Bosch WAQ283S1GB: el flow sensor mide el agua que entra, con un rodete de núcleo magnético y un sensor Hall. Caudal de trabajo 2–10 l/min (máx. 10 l/min). El vídeo no dice esas cifras: son de ese modelo.
  https://www.manualslib.com/manual/1357025/Bosch-Waq283s1gb.html
- **Matiz:** no todas las lavadoras miden igual. Los «unos treinta segundos» en seco son la descripción general de Samsung («about 30 seconds»), no una cifra de la patente de BSH, que es un giro hasta dejar la ropa alzada. El vídeo lo dice como «en muchas» y «unos treinta segundos». El segundo pesaje con la ropa ya mojada (Samsung, hacia el minuto 16) no entra: el vídeo es el de antes de echar el agua.

## Cifras que sí se dicen

- Unos treinta segundos girando en seco, antes del agua (Samsung, «about 30 seconds»; en el vídeo, «en muchas» y «unos»).

## Comparación de casa

- El cesto de la colada: vacío casi no pesa; lleno, tira del brazo. Es el mismo gesto que el tambor al subir la ropa.

## Fuera

- Los 4,5 kg de referencia del tiempo inicial en el ciclo Cotton / ECO 40-60 de Samsung (es de ese ciclo, y el vídeo no lo necesita).
- Los 256 niveles de ActiveWater Plus (solo modelos concretos).
- Que la lavadora ignore un programa manual de «carga completa»: no está en las fuentes. El cierre solo enseña a quien pone ese programa con dos camisetas.
