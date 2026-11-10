window.BRIO_CONTENT = (() => {
  const covers = {
    plato: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#d8efe6"/><circle cx="120" cy="74" r="52" fill="#fff"/><circle cx="120" cy="74" r="42" fill="#f6f1e7"/><path d="M120 74 L120 32 A42 42 0 0 1 162 74z" fill="#5fcf98"/><path d="M120 74 L162 74 A42 42 0 0 1 120 116z" fill="#ff9a6b"/><path d="M120 74 L120 116 A42 42 0 0 1 78 74 A42 42 0 0 1 120 32z" fill="#7dd3a8" opacity=".55"/><circle cx="100" cy="64" r="6" fill="#2a8a7c"/><circle cx="110" cy="92" r="5" fill="#2a8a7c"/><rect x="190" y="30" width="6" height="80" rx="3" fill="#1d6b63"/><rect x="40" y="30" width="6" height="80" rx="3" fill="#1d6b63"/><path d="M34 30h18v20a9 9 0 0 1-18 0z" fill="#1d6b63"/></svg>`,
    proteina: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#ffe9c7"/><ellipse cx="88" cy="82" rx="34" ry="42" fill="#fff"/><circle cx="88" cy="90" r="16" fill="#ffb547"/><path d="M150 50h50l-6 70h-38z" fill="#fff"/><path d="M154 70h42l-3 38h-36z" fill="#ff7a59" opacity=".75"/><rect x="146" y="42" width="58" height="10" rx="5" fill="#1d6b63"/><circle cx="40" cy="30" r="5" fill="#ffb547"/><circle cx="210" cy="26" r="4" fill="#1d6b63"/></svg>`,
    entreno: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#ffe4d9"/><rect x="60" y="64" width="120" height="12" rx="6" fill="#0f3d3e"/><rect x="40" y="44" width="18" height="52" rx="6" fill="#ff7a59"/><rect x="182" y="44" width="18" height="52" rx="6" fill="#ff7a59"/><rect x="24" y="54" width="14" height="32" rx="5" fill="#1d6b63"/><rect x="202" y="54" width="14" height="32" rx="5" fill="#1d6b63"/><circle cx="120" cy="30" r="12" fill="none" stroke="#0f3d3e" stroke-width="4"/><path d="M120 24v7l4 3" stroke="#0f3d3e" stroke-width="3" stroke-linecap="round" fill="none"/><text x="120" y="122" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="18" fill="#0f3d3e">15 min</text></svg>`,
    pasos: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#e3f0ff"/><path d="M0 110 Q120 70 240 110 V140 H0z" fill="#bcd9f5"/><g fill="#0f3d3e"><ellipse cx="70" cy="96" rx="9" ry="14" transform="rotate(-18 70 96)"/><ellipse cx="102" cy="70" rx="9" ry="14" transform="rotate(12 102 70)"/><ellipse cx="136" cy="88" rx="9" ry="14" transform="rotate(-18 136 88)"/><ellipse cx="168" cy="60" rx="9" ry="14" transform="rotate(12 168 60)"/></g><circle cx="200" cy="30" r="16" fill="#ffb547"/></svg>`,
    sueno: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#1d3557"/><path d="M150 26a40 40 0 1 0 34 60 32 32 0 1 1-34-60z" fill="#ffd27a"/><g fill="#fff"><circle cx="50" cy="30" r="2"/><circle cx="80" cy="60" r="1.6"/><circle cx="210" cy="40" r="2"/><circle cx="34" cy="90" r="1.4"/></g><rect x="30" y="104" width="180" height="20" rx="10" fill="#2a8a7c"/><rect x="40" y="96" width="50" height="16" rx="8" fill="#fff"/><text x="100" y="70" font-family="Bricolage Grotesque" font-weight="800" font-size="16" fill="#fff" opacity=".85">z z</text></svg>`,
    antojos: `<svg viewBox="0 0 240 140" aria-hidden="true"><rect width="240" height="140" fill="#f3e8ff"/><path d="M120 116 C70 84 56 58 74 40 C88 26 108 32 120 48 C132 32 152 26 166 40 C184 58 170 84 120 116z" fill="#ff7a59"/><path d="M98 64 q22 18 44 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="44" cy="40" r="10" fill="#c9a7f5"/><circle cx="200" cy="96" r="12" fill="#c9a7f5"/></svg>`,
  };

  const guides = [
    {
      id: "plato", cat: "Nutrición", mins: 6, title: "El plato Brío", sub: "Cómo montar comidas que llenan sin contar calorías",
      sections: [
        { h: "La regla de las tres partes", p: "Imagina tu plato dividido en tres zonas. La mitad, verdura u hortaliza (cruda, asada o salteada). Un cuarto, proteína: huevo, legumbre, pescado, pollo, tofu o yogur natural. El otro cuarto, un hidrato que te guste: arroz, patata, pan integral, pasta o fruta. No hace falta pesar nada: con el ojo basta." },
        { h: "Grasa sí, pero medida", p: "Un buen chorrito de aceite de oliva, un puñado pequeño de frutos secos o medio aguacate por comida es suficiente. La grasa da sabor y saciedad; el problema llega cuando se esconde en salsas, fritos y bollería." },
        { h: "Tres trucos que funcionan", list: ["Empieza la comida por la verdura: llegas al resto con menos hambre.", "Sirve en la cocina y lleva el plato a la mesa, sin la fuente delante.", "Come sin pantalla al menos una comida al día y para cuando estés a gusto, no a reventar."] },
        { h: "Si comes fuera", p: "Pide primero un plato de verdura o ensalada, elige la proteína a la plancha o al horno y comparte el postre. Una comida libre a la semana no estropea nada: lo que cuenta es lo que haces la mayoría de los días." },
      ],
    },
    {
      id: "proteina", cat: "Nutrición", mins: 5, title: "Proteína sin complicaciones", sub: "El nutriente que te ayuda a perder grasa y no músculo",
      sections: [
        { h: "Por qué importa", p: "Cuando comes un poco menos para bajar de peso, el cuerpo puede tirar de músculo. Tomar proteína suficiente y moverte le dice que lo conserve. Además, es lo que más sacia por bocado." },
        { h: "¿Cuánta?", p: "Una forma sencilla: incluye una ración del tamaño de la palma de tu mano en cada comida principal. Si entrenas con regularidad, añade una ración más en el desayuno o la merienda." },
        { h: "Ideas rápidas", list: ["Desayuno: yogur natural o skyr con fruta y avena, o tostada con huevos revueltos.", "Comida: lentejas o garbanzos con verduras, o pescado con patata asada.", "Cena: tortilla francesa con ensalada, o salteado de tofu o pollo con verduras.", "Tentempié: queso fresco batido, un puñado de edamame o un vaso de kéfir."] },
        { h: "Para quien no come carne", p: "Combina legumbres, tofu, tempeh, huevos y lácteos a lo largo del día. Las legumbres en bote, bien enjuagadas, son igual de válidas que las cocidas en casa." },
      ],
    },
    {
      id: "entreno", cat: "Entrenamiento", mins: 7, title: "Entrenar en 15 minutos en casa", sub: "Una rutina base sin material que puedes repetir siempre",
      sections: [
        { h: "Cómo funciona", p: "Haz cada ejercicio 40 segundos y descansa 20. Al terminar la ronda, descansa un minuto. Empieza con 2 rondas y sube a 3 cuando te resulte cómodo. Mejor hacerlo bien y despacio que rápido y mal." },
        { h: "La ronda", list: ["Sentadilla a una silla: siéntate y levántate sin dejarte caer.", "Flexiones apoyando las manos en la mesa o en la pared.", "Puente de glúteo tumbado boca arriba.", "Zancada hacia atrás alternando piernas (agárrate a una silla si lo necesitas).", "Plancha con rodillas apoyadas.", "Marcha en el sitio subiendo rodillas."] },
        { h: "Si tienes molestias", p: "Rodillas: baja menos en la sentadilla y cambia la zancada por elevaciones de pierna de pie. Espalda: cambia la plancha por el 'bicho muerto' (boca arriba, estirando brazo y pierna contrarios). Si algo duele de verdad, para y consúltalo con un profesional." },
        { h: "Cuándo subir el nivel", p: "Cuando puedas hacer 3 rondas hablando con frases cortas, añade 5 segundos de trabajo, quita la silla de la sentadilla o haz las flexiones en un escalón más bajo." },
      ],
    },
    {
      id: "pasos", cat: "Hábitos", mins: 4, title: "Moverte más sin darte cuenta", sub: "El gasto escondido de tu día a día",
      sections: [
        { h: "El movimiento que no es deporte", p: "Caminar, subir escaleras, recoger la casa o jugar con los niños suma mucho más gasto a lo largo de la semana que un entreno. Por eso subir tus pasos diarios es de lo más rentable que puedes hacer." },
        { h: "Sube poco a poco", p: "Mira cuántos pasos das ahora (el móvil lo cuenta) y súmale 1.000 cada semana hasta llegar a tu objetivo. No hace falta pasar de golpe a 10.000." },
        { h: "Ideas para sumar pasos", list: ["Llamadas de teléfono, siempre caminando.", "Bájate una parada antes o aparca más lejos.", "Un paseo de 10 minutos después de comer y de cenar.", "Escaleras en lugar de ascensor hasta el tercer piso."] },
      ],
    },
    {
      id: "sueno", cat: "Descanso", mins: 5, title: "Dormir mejor para tener menos hambre", sub: "Por qué el sueño también adelgaza",
      sections: [
        { h: "Lo que pasa cuando duermes poco", p: "Tras una mala noche el cuerpo pide más energía rápida: más hambre, más antojos de dulce y menos ganas de moverte. Dormir 7 horas o más es de las mejores ayudas para tu plan." },
        { h: "Rutina de 30 minutos", list: ["Misma hora de acostarte y levantarte, también el fin de semana (±1 hora).", "Pantallas fuera 30 minutos antes; mejor un libro o una ducha templada.", "Habitación fresca, oscura y sin ruido.", "Cafeína solo hasta mediodía.", "Cena ligera al menos 2 horas antes de dormir."] },
        { h: "Si te despiertas de noche", p: "No mires la hora ni el móvil. Respira lento (inspira en 4 tiempos, suelta en 6) unas cuantas veces. Si a los 20 minutos sigues despierto, levántate un rato con luz tenue y vuelve cuando te entre sueño." },
      ],
    },
    {
      id: "antojos", cat: "Mente", mins: 6, title: "Antojos y comer por emociones", sub: "Qué hacer cuando el hambre no es hambre",
      sections: [
        { h: "Hambre real o emocional", p: "El hambre real llega poco a poco y cualquier comida te vale. La emocional llega de golpe, pide algo concreto (dulce, salado, crujiente) y suele dejar culpa. Distinguirlas ya es medio camino." },
        { h: "La pausa de 5 minutos", p: "Cuando te venga el antojo, bebe un vaso de agua y espera 5 minutos haciendo otra cosa. Si después sigues queriéndolo, cómelo despacio, sentado y en un plato. Sin culpa: decides tú, no el impulso." },
        { h: "Prepara el terreno", list: ["No tengas a la vista lo que te cuesta controlar.", "Ten preparada una alternativa que te guste: fruta cortada, yogur con canela, palomitas hechas en casa.", "No llegues con mucha hambre a la noche: merienda algo con proteína.", "Si comes cuando estás estresado, prueba antes 3 minutos de respiración o un paseo corto."] },
        { h: "Un mal día no es un mal plan", p: "Si te pasas, la siguiente comida es normal. Ni compensar con ayuno ni tirarlo todo por la borda. La constancia gana a la perfección." },
      ],
    },
  ];

  const r21Days = [
    ["Prepara una botella de agua y déjala a la vista", "Haz una foto de tu desayuno para tomar conciencia"],
    ["Añade verdura a la comida y a la cena", "Apunta a qué hora te entra más hambre"],
    ["Cena al menos 2 horas antes de acostarte", "Deja el móvil fuera del dormitorio esta noche"],
    ["Cambia el refresco o el zumo por agua con gas y limón", "Haz 10 minutos de estiramientos suaves"],
    ["Come sentado y sin pantallas en una comida", "Escribe 3 motivos por los que empezaste"],
    ["Prepara hoy la comida de mañana", "Sube por las escaleras siempre que puedas"],
    ["Repaso de la semana: ¿qué hábito te ha costado menos?", "Date un premio que no sea comida"],
    ["Incluye proteína en el desayuno", "Paseo de 10 minutos después de comer"],
    ["Prueba una verdura que no sueles comer", "Respiración 4-6 durante 3 minutos"],
    ["Sirve en la cocina, no lleves la fuente a la mesa", "Acuéstate 20 minutos antes de lo habitual"],
    ["Merienda algo con proteína para llegar bien a la cena", "Haz la lista de la compra antes de ir al súper"],
    ["Elige pan o pasta integral en lugar de blanco", "Llama a alguien caminando"],
    ["Bebe un vaso de agua antes de cada comida", "Ordena la despensa: lo tentador, fuera de la vista"],
    ["Repaso: pésate o mide tu cintura y apúntalo", "Celebra 2 semanas seguidas"],
    ["Cocina una receta nueva y sencilla", "Pausa activa de 5 minutos cada 2 horas sentado"],
    ["Ante un antojo, prueba la pausa de 5 minutos", "Sin cafeína a partir del mediodía"],
    ["Come despacio: suelta el cubierto entre bocados", "Paseo de 15 minutos al aire libre"],
    ["Prepara tentempiés saludables para 3 días", "Escribe cómo te sientes hoy comparado con el día 1"],
    ["Toma fruta de postre en lugar de dulce", "Estiramientos antes de dormir"],
    ["Elige tu comida libre de la semana y disfrútala sin culpa", "Cuenta a alguien lo que has conseguido"],
    ["Repaso final: elige los 3 hábitos que te quedas para siempre", "Pésate, mide tu cintura y compara con el día 1"],
  ];

  const r28Nutrition = [
    "Medio plato de verdura en la comida", "Proteína en el desayuno", "Agua en lugar de refresco", "Cena ligera y temprana",
    "Fruta como tentempié", "Legumbre en una comida", "Sin bollería hoy", "Pescado en una comida", "Prepara la comida de mañana",
    "Un plato nuevo de verduras", "Yogur natural en lugar de postre dulce", "Pan integral en lugar de blanco", "Come sin pantallas",
    "Frutos secos: solo un puñado", "Desayuno con avena o integral", "Huevos en una comida", "Ensalada antes del plato principal",
    "Sin picoteo después de cenar", "Agua antes de cada comida", "Merienda con proteína", "Cocina al horno o a la plancha",
    "Dos piezas de fruta hoy", "Cambia la salsa por especias", "Comida libre: disfrútala", "Lista de la compra pensada",
    "Verdura en las tres comidas", "Raciones del tamaño de tu mano", "Repite tu comida favorita del reto",
  ];

  const zoneMoves = {
    abdomen: ["Plancha con rodillas", "Bicho muerto", "Elevación de rodillas sentado"],
    brazos: ["Flexiones en la pared", "Fondos en una silla", "Círculos de brazos"],
    piernas: ["Sentadilla a la silla", "Zancada atrás", "Elevación de talones"],
    gluteos: ["Puente de glúteo", "Patada de glúteo a cuatro apoyos", "Sentadilla sumo"],
    todo: ["Sentadilla a la silla", "Flexiones en la pared", "Puente de glúteo"],
  };

  function r28Day(day, answers) {
    const zones = (answers.zones || []).filter((z) => zoneMoves[z] && z !== "todo");
    const pool = zones.length ? zones.flatMap((z) => zoneMoves[z]) : zoneMoves.todo;
    const week = Math.ceil(day / 7);
    const dow = (day - 1) % 7;
    const low = Number(answers.activity || 2) <= 2;
    const baseMin = low ? 8 : 12;
    const mins = baseMin + (week - 1) * (low ? 2 : 3);
    const moves = [0, 1, 2].map((i) => pool[(day + i) % pool.length]);
    const baseSteps = [4000, 6000, 8000, 9000][Number(answers.activity || 2) - 1] || 6000;
    const steps = baseSteps + (week - 1) * 1000;
    if (dow === 6) {
      return { title: `Día ${day} · Descanso activo`, tasks: [`Paseo tranquilo de ${20 + week * 5} minutos`, "10 minutos de estiramientos de todo el cuerpo", r28Nutrition[day - 1]] };
    }
    if (dow === 3) {
      return { title: `Día ${day} · Cardio suave`, tasks: [`${mins + 5} minutos de marcha rápida, bici o baile`, `Llega a ${steps.toLocaleString("es-ES")} pasos`, r28Nutrition[day - 1]] };
    }
    return {
      title: `Día ${day} · Fuerza ${week}`,
      tasks: [`Circuito de ${mins} min: ${moves.join(", ")} (40" trabajo / 20" descanso)`, `Llega a ${steps.toLocaleString("es-ES")} pasos`, r28Nutrition[day - 1]],
    };
  }

  function r21Day(day, answers) {
    const glasses = Number(answers.water || 2) <= 2 ? 6 : 8;
    return { title: `Día ${day}`, tasks: [...r21Days[day - 1], `Bebe ${glasses} vasos de agua`] };
  }

  const challenges = [
    {
      id: "r21", days: 21, title: "21 días de hábitos ligeros", short: "Hábitos 21",
      sub: "Dos pequeños hábitos al día para comer mejor y tener más energía, sin dietas.", color: "#1d6b63", day: r21Day,
    },
    {
      id: "r28", days: 28, title: "28 días de cuerpo activo", short: "Activo 28",
      sub: "Fuerza en casa, cardio suave y un gesto de nutrición cada día. Ajustado a tus zonas y tu nivel.", color: "#ff7a59", day: r28Day,
    },
  ];

  return { guides, covers, challenges };
})();
