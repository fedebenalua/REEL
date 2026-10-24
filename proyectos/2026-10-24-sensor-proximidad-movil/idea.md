# ¿Cómo sabe tu móvil que tienes la pantalla pegada a la oreja?

Pedido el 2026-10-24.

## Lo que cuenta, en una frase

El móvil no reconoce tu oreja: un sensor de proximidad ve si hay algo muy cerca y, en la llamada, apaga la pantalla para que no la pulses.

## Lo sorprendente

Pegas el móvil a la oreja y la pantalla se apaga sola, como si supiera que es tu cara. No lo sabe. Le da igual que sea la mejilla, un dedo o cualquier cosa pegada al cristal: mide si hay un objeto cerca.

## La regla que rompe

Parece que el móvil reconoce la oreja. Lo que hace es más simple: durante la llamada, si el sensor de proximidad dice que hay un objeto cerca, apaga la pantalla al momento. Cuando el objeto se aparta, la pantalla vuelve.

## El mecanismo, paso a paso

1. En la llamada, el móvil usa el sensor de proximidad para saber si lo tienes cerca de la cara. Android lo describe así: sirve para saber cuándo el teléfono está cerca de la cara del usuario, por ejemplo en una llamada. (Android Developers, sensores de posición.)
2. Ese sensor mide la distancia, en centímetros, hasta la superficie más cercana que tiene delante. Muchos no dan una distancia fina: solo dicen «cerca» o «lejos». (Android Open Source Project, tipos de sensor; Android Developers.)
3. Lo habitual es luz que no se ve. Un emisor de infrarrojos (un LED o un VCSEL) lanza un pulso, y un fotodiodo mide la luz que vuelve rebotada. Cuanta más vuelve, más cerca está lo de delante. También influyen el tamaño, el ángulo y lo claro u oscuro que sea. Un umbral de esa luz basta para decidir «hay algo cerca». (ams OSRAM, proximity sensing; nota de aplicación AN000556.)
4. Es la misma clase de luz invisible que usa el mando de la tele: infrarroja, que el ojo no ve. (HowStuffWorks, «How Remote Controls Work»; Explain that Stuff.)
5. Si el sensor dice que hay un objeto cerca, la pantalla se apaga en el acto. Poco después de apartarlo, se enciende otra vez. (Android, PowerManager, PROXIMITY_SCREEN_OFF_WAKE_LOCK.)
6. En un móvil, ese detector se usa en la llamada para desactivar la pantalla táctil cuando el teléfono se acerca a la cabeza, y volver a activarla al apartarlo. Así la mejilla no pulsa botones. (ams OSRAM, AN000556.)
7. No todos lo llevan en el mismo sitio. En algunos modelos el sensor está bajo la pantalla. (Android Developers.) Hay móviles que miden la proximidad de otra manera; el vídeo cuenta la habitual, la luz infrarroja que rebota, y lo dice con «lo habitual».

## Las cifras

No hay una distancia única de «oreja» que valga para todos los móviles: la medida va en centímetros y muchos sensores solo distinguen cerca y lejos. Por eso el vídeo dice «muy cerca» y no un número de centímetros. (Android Open Source Project; Android Developers.)

Un ejemplo de lo pequeño que puede ser el módulo: el TMD2636 de ams OSRAM mide 2 × 1 × 0,35 mm y pide una abertura de 1,5 mm. No se dice en el vídeo, porque no es el tamaño de todos los móviles. (ams OSRAM, proximity sensing.)

## Comparaciones de casa

- La mejilla y el dedo: las dos cosas disparan lo mismo, porque el sensor ve un objeto, no una oreja.
- El mando de la tele: también lanza una luz infrarroja que no ves.
- El cristal del móvil, pegado a la cara, es el «delante» del que vuelve esa luz.

## Fuentes

- Android Developers, «Position sensors»: https://developer.android.com/develop/sensors-and-location/sensors/sensors_position
  El sensor de proximidad suele servir para saber a qué distancia está la cabeza de la cara del teléfono, por ejemplo al hacer o recibir una llamada. La mayoría devuelve la distancia en centímetros; algunos solo «cerca» y «lejos». En algunos modelos está debajo de la pantalla.
- Android Open Source Project, «Sensor types», apartado Proximity: https://source.android.com/docs/core/interaction/sensors/sensor-types
  Mide la distancia del sensor a la superficie visible más cercana, en centímetros. Es el sensor que se usa para encender y apagar la pantalla durante las llamadas. Algunos solo distinguen cerca y lejos.
- Android Developers, PowerManager, PROXIMITY_SCREEN_OFF_WAKE_LOCK: https://developer.android.com/reference/android/os/PowerManager
  Si el sensor detecta un objeto cerca, la pantalla se apaga de inmediato. Poco después de que el objeto se aparte, la pantalla vuelve a encenderse.
- ams OSRAM, «Proximity sensing»: https://ams-osram.com/innovation/technology/depth-and-3d-sensing/proximity-sensing
  Un emisor y un fotodetector juntos: la intensidad de la luz reflejada es inversamente proporcional a la distancia (y también depende del tamaño, el ángulo y la reflectancia). Un umbral decide si hay algo cerca. Aplicación citada: la pantalla del móvil se apaga al ponerlo en la oreja. El TMD2636 integra el sistema en 2 × 1 × 0,35 mm, con una abertura de 1,5 mm.
- ams OSRAM, nota AN000556, «Proximity Detection / Proximity Basics»: https://look.ams-osram.com/m/64e4692f8dedb844/original/ProximitySensors-AN000556.pdf
  El sensor pulsa un emisor infrarrojo (LED o VCSEL) y mide la energía que vuelve del objeto. La nota está pensada para un móvil en el que, durante la llamada, el detector desactiva la pantalla táctil al acercar el teléfono a la cabeza y la reactiva al apartarlo.
- HowStuffWorks, «How Remote Controls Work»: https://electronics.howstuffworks.com/remote-control.htm
  El mando de la tele manda pulsos de luz infrarroja, en la parte invisible del espectro.
- Explain that Stuff, «How remote control and radio control work»: https://www.explainthatstuff.com/remotecontrol.html
  La mayoría de los mandos usan radiación infrarroja, una luz roja invisible. El ojo no la ve.
