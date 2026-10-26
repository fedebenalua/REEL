# Problemas de casa y cómo arreglarlos (@homediagnosis)

Cuentas **@homediagnosis** (Instagram), **@home.diagnosis.ai** (TikTok) y **@homediagnosisai** (YouTube). Vídeos de
problemas que pasan en casa y cómo se arreglan: el grifo que gotea, el desagüe atascado, la mancha, el moho, el enchufe
que no va... **Todo en inglés** (voz, subtítulos, texto del post y hashtags), para público angloparlante. Un vídeo
cada 6 horas.

- Se publican solo en esas tres cuentas: `node motor/publicar.mjs <vídeo> --perfil casa` (el perfil está en
  `zernio.json`; la lista de lo programado, en `publicados-casa.json`). No se publican en otras cuentas, y los de
  otras cuentas no se publican aquí.
- **Idioma: inglés** (anula el español de `preferencias.md` para este perfil).
- **Formato del vídeo:** el problema se ve desde el primer fotograma, exagerado y grande (el grifo goteando, el agua
  subiendo en el fregadero). Luego: por qué pasa (una frase), y el arreglo **paso a paso, en orden, con lo que se hace
  con las manos** (herramienta, qué se gira, qué se quita, qué se pone), con 3 a 5 pasos como mucho. Remate: cómo
  evitar que vuelva a pasar o qué sale caro si no se arregla.
- **Cada 5 vídeos, el cierre menciona la herramienta.** Cuenta las entradas de `publicados-casa.json`: si el vídeo que
  vas a hacer es el 5.º, el 10.º, el 15.º... (la cuenta, contando el nuevo, es múltiplo de 5), el cierre dice, en
  inglés, que en el **link in bio** tienen nuestra herramienta que lo explica todo paso a paso (por ejemplo: «Want
  the full step-by-step for any problem at home? Our tool is in the link in bio.»). En los demás, el cierre invita a
  seguir la cuenta o a enviárselo a quien tenga ese problema (en inglés: «Send this to that friend whose faucet
  won't stop dripping», «Follow for more home fixes»). La herramienta se menciona solo al final, sin interrumpir.
- **Seguridad primero.** Solo arreglos que una persona sin oficio puede hacer sin riesgo. Electricidad, gas y
  estructura: el vídeo dice cómo reconocerlo y cuándo llamar a un profesional (cortar la corriente en el cuadro antes
  de tocar nada, nunca tocar el gas). Nada de trucos peligrosos (mezclar lejía con amoniaco, etc.), salvo para avisar
  de que no se hacen.
- Di solo lo que se sabe y funciona. Si un truco casero está discutido (vinagre para todo, pasta de dientes en
  arañazos), cuéntalo con ese matiz.
- Un tema nuevo cada vez: mira `proyectos/` (carpetas `*-faucet-*`, `*-home-*`...) y `publicados-casa.json`, y no
  repitas ninguno.
- Hashtags del tema, en inglés, 6 a 10, y `#Shorts` al final.
- **Las ideas no se acaban nunca.** Cuando queden menos de 5 en «Ideas pendientes», añade al final 10 temas nuevos
  (que no estén ya en la lista, en `proyectos/` ni en `publicados-casa.json`) sin preguntar a nadie.
- Qué hace bueno un tema: un problema que todo el mundo ha tenido o tendrá, se reconoce en una imagen, el arreglo
  se puede enseñar con las manos y cabe en 3 a 5 pasos.

## Ya hechos

(Lo programado está en `publicados-casa.json`.)

1. Why Is My Faucet Dripping? (and How to Fix It in 5 Minutes), 2026-10-23
2. How to Unclog a Drain Without Chemicals, 2026-10-23
3. Toilet Keeps Running? Here's the 2-Minute Fix, 2026-10-24
4. Why Does My Shower Have Low Water Pressure?, 2026-10-24
5. How to Remove Mold From Bathroom Caulk, 2026-10-24
6. Why Is My Water Heater Making Banging Noises?, 2026-10-24
7. How to Fix a Squeaky Door in 30 Seconds, 2026-10-25
8. Outlet Not Working? Check This First, 2026-10-25
9. How to Fix a Clogged Toilet With No Plunger, 2026-10-25
10. Why Is There a Wet Spot on My Ceiling?, 2026-10-26

## Ideas pendientes

1. How to Fix a Hole in the Wall
2. Why Does My Fridge Leak Water on the Floor?
3. How to Stop a Window From Fogging Up Inside
4. Dishwasher Smells Bad? Fix It Fast
5. How to Fix a Running Toilet Flapper
6. Why Does My Circuit Breaker Keep Tripping?
7. How to Remove Hard Water Stains From Glass
8. How to Fix a Sagging Cabinet Door
9. Why Is My AC Blowing Warm Air?
10. How to Fix a Stripped Screw Hole
11. Why Do My Pipes Freeze, and How Do I Thaw Them?
12. How to Remove Water Rings From Wood
13. Why Does My House Smell Like Sewage?
14. How to Fix a Loose Toilet Seat
15. How to Get Rid of Fruit Flies in the Kitchen
16. Why Is My Garbage Disposal Humming and Not Spinning?
17. How to Unclog a Kitchen Sink in 3 Steps
18. Why Does My Washing Machine Shake So Much?
19. How to Fix a Wobbly Chair
20. How to Remove Carpet Stains in Minutes
