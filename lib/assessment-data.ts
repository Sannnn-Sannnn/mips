import type { Dimension, Question } from "./assessment-types"

// 12 Original MIPS Dimensions organized by category
export const dimensions: Dimension[] = [
  // === METAS MOTIVACIONALES ===
  {
    id: "apertura-preservacion",
    name: "Apertura vs Preservación",
    category: "Metas Motivacionales",
    poleA: {
      id: "apertura",
      name: "Apertura",
      description: "Tendencia a buscar experiencias nuevas, explorar el entorno y asumir riesgos con optimismo."
    },
    poleB: {
      id: "preservacion",
      name: "Preservación",
      description: "Tendencia a protegerse, anticipar problemas y focalizarse en las dificultades de la vida."
    }
  },
  {
    id: "modificacion-acomodacion",
    name: "Modificación vs Acomodación",
    category: "Metas Motivacionales",
    poleA: {
      id: "modificacion",
      name: "Modificación",
      description: "Tendencia a intervenir activamente en los acontecimientos y moldear las circunstancias."
    },
    poleB: {
      id: "acomodacion",
      name: "Acomodación",
      description: "Tendencia a adaptarse a las circunstancias creadas por otros sin intentar cambiarlas."
    }
  },
  {
    id: "individualismo-proteccion",
    name: "Individualismo vs Protección",
    category: "Metas Motivacionales",
    poleA: {
      id: "individualismo",
      name: "Individualismo",
      description: "Orientación a satisfacer las propias necesidades sin preocuparse demasiado por los demás."
    },
    poleB: {
      id: "proteccion",
      name: "Protección",
      description: "Motivación a satisfacer primero las necesidades de los demás antes que las propias."
    }
  },

  // === MODOS COGNITIVOS ===
  {
    id: "extraversion-introversion",
    name: "Extraversión vs Introversión",
    category: "Modos Cognitivos",
    poleA: {
      id: "extraversion",
      name: "Extraversión",
      description: "Tendencia a recurrir a los demás como fuente de estimulación e información."
    },
    poleB: {
      id: "introversion",
      name: "Introversión",
      description: "Preferencia por utilizar los propios pensamientos y sentimientos como recurso."
    }
  },
  {
    id: "sensacion-intuicion",
    name: "Sensación vs Intuición",
    category: "Modos Cognitivos",
    poleA: {
      id: "sensacion",
      name: "Sensación",
      description: "Tendencia a obtener conocimiento de lo tangible, concreto y observable directamente."
    },
    poleB: {
      id: "intuicion",
      name: "Intuición",
      description: "Preferencia por lo simbólico, abstracto y especulativo sobre lo concreto."
    }
  },
  {
    id: "pensamiento-sentimiento",
    name: "Pensamiento vs Sentimiento",
    category: "Modos Cognitivos",
    poleA: {
      id: "pensamiento",
      name: "Pensamiento",
      description: "Preferencia por procesar información mediante la lógica y el razonamiento analítico."
    },
    poleB: {
      id: "sentimiento",
      name: "Sentimiento",
      description: "Tendencia a formar juicios basándose en valores afectivos y reacciones emocionales."
    }
  },
  {
    id: "sistematizacion-innovacion",
    name: "Sistematización vs Innovación",
    category: "Modos Cognitivos",
    poleA: {
      id: "sistematizacion",
      name: "Sistematización",
      description: "Estilo organizado, predecible y metódico para manejar las experiencias."
    },
    poleB: {
      id: "innovacion",
      name: "Innovación",
      description: "Tendencia a ser creativo, asumir riesgos y buscar nuevas formas de hacer las cosas."
    }
  },

  // === CONDUCTAS INTERPERSONALES ===
  {
    id: "retraimiento-comunicatividad",
    name: "Retraimiento vs Comunicatividad",
    category: "Conductas Interpersonales",
    poleA: {
      id: "retraimiento",
      name: "Retraimiento",
      description: "Falta de emotividad e indiferencia social, alejamiento de las relaciones."
    },
    poleB: {
      id: "comunicatividad",
      name: "Comunicatividad",
      description: "Búsqueda activa de estimulación social, establecimiento de múltiples relaciones."
    }
  },
  {
    id: "vacilacion-firmeza",
    name: "Vacilación vs Firmeza",
    category: "Conductas Interpersonales",
    poleA: {
      id: "vacilacion",
      name: "Vacilación",
      description: "Timidez social, sensibilidad a la desaprobación y tendencia a minimizar la interacción."
    },
    poleB: {
      id: "firmeza",
      name: "Firmeza",
      description: "Seguridad social, creencia en sí mismo y capacidad de destacar en grupos."
    }
  },
  {
    id: "discrepancia-conformismo",
    name: "Discrepancia vs Conformismo",
    category: "Conductas Interpersonales",
    poleA: {
      id: "discrepancia",
      name: "Discrepancia",
      description: "Tendencia a actuar de modo independiente y no conformista."
    },
    poleB: {
      id: "conformismo",
      name: "Conformismo",
      description: "Respeto por la autoridad, cooperación y seguimiento de las reglas sociales."
    }
  },
  {
    id: "sometimiento-control",
    name: "Sometimiento vs Control",
    category: "Conductas Interpersonales",
    poleA: {
      id: "sometimiento",
      name: "Sometimiento",
      description: "Conducta de subordinación, permisividad ante los abusos de los demás."
    },
    poleB: {
      id: "control",
      name: "Control",
      description: "Tendencia a dominar y dirigir a los demás, poder y superioridad social."
    }
  },
  {
    id: "insatisfaccion-concordancia",
    name: "Insatisfacción vs Concordancia",
    category: "Conductas Interpersonales",
    poleA: {
      id: "insatisfaccion",
      name: "Insatisfacción",
      description: "Tendencia a ser pasivo-agresivo, malhumorado y mostrar descontento general."
    },
    poleB: {
      id: "concordancia",
      name: "Concordancia",
      description: "Simpático, cooperativo y agradable en las relaciones sociales."
    }
  }
]

// Full 180-question deck with dimension mapping
export const fullQuestionDeck: Question[] = [
  { id: 1, text: "Soy una persona tranquila y colaboradora.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleB", priority: "core" },
  { id: 2, text: "Siempre he hecho lo que he querido y he aceptado las consecuencias.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 3, text: "Me gusta ser la persona que asume el control de las cosas.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "core" },
  { id: 4, text: "Tengo una manera habitual de hacer las cosas, con lo que evito equivocarme.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "core" },
  { id: 5, text: "Respondo mensajes o comunicaciones el mismo día que los recibo.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "validation" },
  { id: 6, text: "A veces me las arreglo para arruinar las cosas buenas que me pasan.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "core" },
  { id: 7, text: "Ya no encuentro tantas cosas nuevas que me gustan como antes.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "validation" },
  { id: 8, text: "Preferiría ser un seguidor más que un líder.", dimensionId: "sometimiento-control", trueIndicates: "poleA", priority: "core" },
  { id: 9, text: "Me esfuerzo por conocer gente interesante y tener aventuras.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "core" },
  { id: 10, text: "Siempre he tenido talento para tener éxito en lo que hago.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleB", priority: "core" },
  { id: 11, text: "Con frecuencia me doy cuenta de que he sido tratado injustamente.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "validation" },
  { id: 12, text: "Me siento incómodo cuando me tratan bien.", dimensionId: "sometimiento-control", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 13, text: "Con frecuencia me siento tenso en situaciones sociales.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "core" },
  { id: 14, text: "Creo que la policía / patovica / preceptores abusan del poder que tiene.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "validation" },
  { id: 15, text: "Algunas veces he tenido que ser bastante brusco con la gente.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "validation" },
  { id: 16, text: "Los niños deben obedecer siempre las indicaciones de sus mayores.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "core" },
  { id: 17, text: "A menudo me molestan la forma en que se hacen las cosas.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 18, text: "A menudo espero que me pase lo peor.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "core" },
  { id: 19, text: "No me importaría tener pocos amigos.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleA", priority: "core" },
  { id: 20, text: "Soy tímido e inhibido en situaciones sociales.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "validation" },
  { id: 21, text: "Aunque esté en desacuerdo, por lo general dejo que la gente haga lo que quiera.", dimensionId: "sometimiento-control", trueIndicates: "poleA", priority: "validation" },
  { id: 22, text: "Es imposible pretender que las personas digan siempre la verdad.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 23, text: "Puedo hacer comentarios desagradables si considero que las personas se los merecen.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 24, text: "Me gusta cumplir con lo establecido y hacer lo que se espera de mí.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "core" },
  { id: 25, text: "Muy poco de lo que hago es valorado por los demás.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 26, text: "Casi todo lo que intento hacer me resulta fácil.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleB", priority: "validation" },
  { id: 27, text: "Últimamente me he convertido en una persona más encerrada en mí misma.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "validation" },
  { id: 28, text: "Tiendo a hacer un drama de las cosas que me pasan.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 29, text: "Siempre trato de hacer lo que es correcto.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "validation" },
  { id: 30, text: "Dependo poco de la amistad de los demás.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleA", priority: "validation" },
  { id: 31, text: "Cuando hay un límite claro (horario, cantidad, consigna), trato de no pasarme.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 32, text: "Los castigos nunca me han impedido hacer lo que he querido.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "core" },
  { id: 33, text: "Me gusta organizar todas las cosas hasta en sus mínimos detalles.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "core" },
  { id: 34, text: "A menudo los demás logran irritarme.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "core" },
  { id: 35, text: "Jamás he desobedecido las indicaciones de mis padres.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 36, text: "Siempre logro conseguir lo que quiero aunque tenga que presionar a los demás.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "core" },
  { id: 37, text: "Nada es más importante que proteger la reputación personal.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 38, text: "Los demás tienen mejores oportunidades que yo.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "validation" },
  { id: 39, text: "Ya no expreso lo que realmente siento.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 40, text: "Es imposible que lo que tengo que decir interese a los demás.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 41, text: "Me esfuerzo por conocer gente interesante y tener aventuras.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "core" },
  { id: 42, text: "Me tomo con poca seriedad muchas de las responsabilidades que tengo.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "validation" },
  { id: 43, text: "Soy una persona dura, nada sentimental.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "core" },
  { id: 44, text: "Pocas cosas en la vida pueden conmoverme.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 45, text: "Me pone muy nervioso el tener que conocer y conversar con gente nueva.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "core" },
  { id: 46, text: "Soy una persona colaboradora que cede ante los demás.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleB", priority: "validation" },
  { id: 47, text: "Actúo en función del momento, dependiendo de las circunstancias.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleB", priority: "core" },
  { id: 48, text: "Primero planifico y luego sigo activamente el plan trazado.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 49, text: "A menudo me he sentido inquieto con ganas de irme a cualquier parte.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "validation" },
  { id: 50, text: "Lo mejor es controlar nuestras emociones.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "validation" },
  { id: 51, text: "Desearía que la gente no me culpara a mí cuando algo sale mal.", dimensionId: "sometimiento-control", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 52, text: "Probablemente soy mi peor enemigo.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 53, text: "Tengo muy pocos lazos afectivos fuertes con otras personas.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleA", priority: "core" },
  { id: 54, text: "Me siento intranquilo con personas que no conozco muy bien.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "validation" },
  { id: 55, text: "Es correcto tratar de burlar la ley sin dejar de cumplirla.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 56, text: "Hago mucho por los demás, pero ellos hacen poco por mí.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "core" },
  { id: 57, text: "Siempre he creído que los demás no tienen buena opinión de mí.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 58, text: "Tengo mucha confianza en mí mismo.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleB", priority: "core" },
  { id: 59, text: "Sistemáticamente ordeno mis papeles y materiales de trabajo.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "validation" },
  { id: 60, text: "Mi experiencia me ha enseñado que las cosas buenas duran poco.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "validation" },
  { id: 61, text: "Algunos dicen que me gusta hacerme la víctima.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 62, text: "Me siento mejor cuando estoy solo.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "core" },
  { id: 63, text: "Me pongo más tenso que los demás frente a situaciones nuevas.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 64, text: "Siempre trato de evitar las discusiones, por más que esté convencido de tener razón.", dimensionId: "sometimiento-control", trueIndicates: "poleA", priority: "core" },
  { id: 65, text: "Busco situaciones novedosas y excitantes para mí.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "core" },
  { id: 66, text: "Hubo épocas en que mis padres tuvieron problemas por mi comportamiento.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "validation" },
  { id: 67, text: "Siempre termino mi trabajo antes de descansar.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "validation" },
  { id: 68, text: "Otros consiguen cosas que yo no logro.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "validation" },
  { id: 69, text: "A veces siento que merezco ser infeliz.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 70, text: "Espero que las cosas sigan su curso antes de decidir qué hacer.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "core" },
  { id: 71, text: "Procuro ocuparme más de los demás que de mí mismo.", dimensionId: "individualismo-proteccion", trueIndicates: "poleB", priority: "core" },
  { id: 72, text: "A menudo creo que mi vida va de mal en peor.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "core" },
  { id: 73, text: "El solo hecho de estar con otras personas me hace sentir inspirado.", dimensionId: "extraversion-introversion", trueIndicates: "poleA", priority: "core" },
  { id: 74, text: "Suelo respetar las reglas, incluso cuando nadie está controlando.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "core" },
  { id: 75, text: "Uso mi cabeza y no mi corazón para tomar decisiones.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "core" },
  { id: 76, text: "Generalmente suelo guiarme de mis intuiciones más que por la información que tengo sobre algo.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "core" },
  { id: 77, text: "Jamás envidio los éxitos de los demás.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 78, text: "En el colegio me gustaban más los cursos prácticos que los teóricos.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "validation" },
  { id: 79, text: "Planifico las cosas con anticipación y actúo enérgicamente para que mis planes se cumplan.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 80, text: "Mi corazón controla mi cerebro.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "core" },
  { id: 81, text: "Siempre puedo ver el lado positivo de la vida.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "validation" },
  { id: 82, text: "A menudo espero que alguien solucione mis problemas.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "validation" },
  { id: 83, text: "Hago lo que quiero, sin pensar cómo va a afectar a los otros.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "core" },
  { id: 84, text: "Reacciono con rapidez ante cualquier situación que pueda llegar a ser un problema para mí.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 85, text: "Sólo me siento una buena persona cuando ayudo a los demás.", dimensionId: "individualismo-proteccion", trueIndicates: "poleB", priority: "validation" },
  { id: 86, text: "Si algo sale mal, aunque no sea importante, se me arruina todo el día.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 87, text: "Disfruto más de mis fantasías que de la realidad cotidiana.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "validation" },
  { id: 88, text: "Me siento satisfecho dejando que las cosas ocurran.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "core" },
  { id: 89, text: "Trato de ser más lógico que emocional.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "validation" },
  { id: 90, text: "Prefiero las cosas que se pueden ver y tocar antes que las que sólo se imaginan.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "core" },
  { id: 91, text: "Me resulta difícil conversar con alguien que acabo de conocer.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "validation" },
  { id: 92, text: "Ser afectuoso es más importante que ser frío y calculador.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "validation" },
  { id: 93, text: "Las predicciones sobre el futuro son más interesantes para mí que los hechos del pasado.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "core" },
  { id: 94, text: "Me resulta fácil disfrutar de las cosas.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "core" },
  { id: 95, text: "Me siento incapaz de influir en el mundo que me rodea.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 96, text: "Vivo según mis propias necesidades y no basado en las de los demás.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "validation" },
  { id: 97, text: "Nunca espero que las cosas pasen, hago que sucedan como yo quiero.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 98, text: "Evito contestar bruscamente cuando estoy molesto.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 99, text: "La necesidad de ayudar a otros guía mi vida.", dimensionId: "individualismo-proteccion", trueIndicates: "poleB", priority: "core" },
  { id: 100, text: "A menudo me siento muy tenso, a la espera de que algo salga mal.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "core" },
  { id: 101, text: "Nunca intenté copiar en un examen.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 102, text: "Siempre soy frío y objetivo en el trato con los demás.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 103, text: "Prefiero aprender a manejar un aparato antes que especular sobre por qué funciona de ese modo.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "validation" },
  { id: 104, text: "Soy una persona difícil de conocer bien.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "validation" },
  { id: 105, text: "Paso mucho tiempo pensando en los misterios de la vida.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "validation" },
  { id: 106, text: "Es fácil para mí controlar mis estados de ánimo.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 107, text: "Soy algo pasivo y lento en temas relacionados con la organización de mi vida.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "validation" },
  { id: 108, text: "Hago lo que quiero sin importarme el complacer a otros.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "validation" },
  { id: 109, text: "Jamás haría algo malo, por más fuerte que sea la tentación de hacerlo.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 110, text: "Mis amigos y mis familiares recurren a mí en primer lugar para encontrar afecto y apoyo.", dimensionId: "individualismo-proteccion", trueIndicates: "poleB", priority: "core" },
  { id: 111, text: "Aunque todo esté bien, generalmente pienso que va a pasar lo peor.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "validation" },
  { id: 112, text: "Planifico y organizo con cuidado mi trabajo antes de empezar a hacerlo.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "core" },
  { id: 113, text: "Soy impersonal y objetivo al tratar de resolver un problema.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "validation" },
  { id: 114, text: "Soy una persona realista a la que no le gustan las especulaciones.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "core" },
  { id: 115, text: "Algunos de mis mejores amigos desconocen lo que realmente siento.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "core" },
  { id: 116, text: "La gente piensa que soy una persona más racional que afectiva.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "core" },
  { id: 117, text: "Mi sentido de la realidad es mejor que mi imaginación.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "validation" },
  { id: 118, text: "Primero me preocupo por mí y después de los demás.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "core" },
  { id: 119, text: "Dedico mucho esfuerzo para que las cosas me salgan bien.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 120, text: "Siempre mantengo la compostura, sin importar lo que esté pasando.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "validation", isImpressionManagement: true },
  { id: 121, text: "Demuestro mucho afecto hacia mis amigos.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "core" },
  { id: 122, text: "Muy pocas cosas me han salido bien.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 123, text: "Me gusta conocer gente nueva y saber cosas sobre sus vidas.", dimensionId: "extraversion-introversion", trueIndicates: "poleA", priority: "core" },
  { id: 124, text: "Puedo ignorar aspectos emocionales y afectivos en mi trabajo.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "validation" },
  { id: 125, text: "Prefiero ocuparme de realidades y no de posibilidades.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "validation" },
  { id: 126, text: "Necesito mucho tiempo para poder estar a solas con mis pensamientos.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "validation" },
  { id: 127, text: "Los sentimientos son más importantes que la lógica de la mente.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "validation" },
  { id: 128, text: "Me gustan más los soñadores que los realistas.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "core" },
  { id: 129, text: "Soy más capaz que los demás de reírme de los problemas.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "validation" },
  { id: 130, text: "Es poco lo que puedo hacer, así que prefiero esperar a ver qué pasa.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "core" },
  { id: 131, text: "Nunca me pongo a discutir, aunque esté muy enojado.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleB", priority: "validation", isImpressionManagement: true },
  { id: 132, text: "Expreso lo que pienso de manera franca y abierta.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "validation" },
  { id: 133, text: "Me preocupo por el trabajo que hay que realizar y no por lo que siente la gente que participa en su realización.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 134, text: "Para mí lo ideal sería trabajar con ideas creativas.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleB", priority: "core" },
  { id: 135, text: "Soy el tipo de persona que no se toma la vida muy en serio, prefiero ser más espectador que actor.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 136, text: "Me desagrada que voy a depender de alguien en mi trabajo.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "validation" },
  { id: 137, text: "Trato de asegurar que las cosas salgan como yo quiero.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 138, text: "Disfruto más de las realidades concretas que de las fantasías.", dimensionId: "sensacion-intuicion", trueIndicates: "poleA", priority: "core" },
  { id: 139, text: "Muchas cosas sin importancia me ponen de mal humor.", dimensionId: "insatisfaccion-concordancia", trueIndicates: "poleA", priority: "validation" },
  { id: 140, text: "Aprendo mejor observando y hablando con la gente.", dimensionId: "extraversion-introversion", trueIndicates: "poleA", priority: "validation" },
  { id: 141, text: "No me satisface dejar que las cosas sucedan y simplemente contemplarlas.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 142, text: "No me atrae conocer gente nueva.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleA", priority: "core" },
  { id: 143, text: "Pocas veces sé cómo mantener una conversación.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleA", priority: "validation" },
  { id: 144, text: "Siempre tengo en cuenta los sentimientos de las personas.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "core" },
  { id: 145, text: "Confío más en mis intuiciones que en mis observaciones.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "validation" },
  { id: 146, text: "Trato de no actuar hasta saber qué van a hacer los demás.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleB", priority: "validation" },
  { id: 147, text: "Me gusta tomar mis propias decisiones, evitando los consejos de los otros.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "core" },
  { id: 148, text: "Muchas veces me siento muy mal sin saber por qué.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "validation" },
  { id: 149, text: "Me gusta ser popular y participar en muchas actividades sociales.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "core" },
  { id: 150, text: "Raramente cuento a otro lo que pienso.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "validation" },
  { id: 151, text: "Me entusiasman casi todas las actividades que realizo.", dimensionId: "apertura-preservacion", trueIndicates: "poleA", priority: "core" },
  { id: 152, text: "Para mí es una práctica constante depender de mí mismo y no de otros.", dimensionId: "individualismo-proteccion", trueIndicates: "poleA", priority: "core" },
  { id: 153, text: "La mayor parte del tiempo la dedico a organizar lo que tengo que hacer.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "validation" },
  { id: 154, text: "No hay nada mejor que el afecto que se siente estando con mi familia.", dimensionId: "individualismo-proteccion", trueIndicates: "poleB", priority: "validation" },
  { id: 155, text: "Algunas veces estoy tenso o deprimido sin saber por qué.", dimensionId: "apertura-preservacion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 156, text: "Disfruto conversando sobre temas o sucesos místicos.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 157, text: "Decido cuáles son las cosas prioritarias y luego actúo firmemente para poder lograrlas.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 158, text: "No dudo en orientar a las personas hacia lo que yo creo que es mejor para ellas.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "validation" },
  { id: 159, text: "Me siento orgulloso de ser eficiente y organizado.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "core" },
  { id: 160, text: "Realmente me desagradan las personas que se convierten en líderes sin razones que lo justifiquen.", dimensionId: "discrepancia-conformismo", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 161, text: "Soy ambicioso en mis metas.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 162, text: "Sé cómo agradar a la gente.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "validation" },
  { id: 163, text: "La gente puede confiar en que voy a hacer bien mi trabajo.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "validation" },
  { id: 164, text: "Los demás me consideran una persona más afectiva que racional.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "validation" },
  { id: 165, text: "Estaría dispuesto a trabajar mucho tiempo para poder llegar a ser alguien importante.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 166, text: "Me gustaría mucho poder vender nuevas ideas o productos a la gente.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "disambiguation" },
  { id: 167, text: "Generalmente logro convencer a los demás para que hagan exactamente lo que yo quiero.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "core" },
  { id: 168, text: "Me gustan los trabajos en los que hay que prestar mucha atención en los detalles.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 169, text: "Soy muy introspectivo, siempre trato de entender mis pensamientos y emociones.", dimensionId: "extraversion-introversion", trueIndicates: "poleB", priority: "core" },
  { id: 170, text: "Confío mucho en mis habilidades sociales.", dimensionId: "vacilacion-firmeza", trueIndicates: "poleB", priority: "validation" },
  { id: 171, text: "Evalúo las situaciones rápidamente y luego actúo para que las cosas salgan como yo quiero.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 172, text: "En una discusión soy capaz de convencer a casi todos para que apoyen mi posición.", dimensionId: "sometimiento-control", trueIndicates: "poleB", priority: "validation" },
  { id: 173, text: "Soy capaz de llevar a cabo cualquier trabajo, pese a los obstáculos que puedan presentarse.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "core" },
  { id: 174, text: "Como si fuera un buen vendedor, puedo influir con éxito sobre los demás, con modales agradables.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "core" },
  { id: 175, text: "Conocer gente nueva es un objetivo importante para mí.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "core" },
  { id: 176, text: "Al tomar decisiones creo que lo más importante es pensar en el bienestar de la gente involucrada.", dimensionId: "pensamiento-sentimiento", trueIndicates: "poleB", priority: "core" },
  { id: 177, text: "Tengo paciencia para realizar trabajos que requieren mucha precisión.", dimensionId: "sistematizacion-innovacion", trueIndicates: "poleA", priority: "disambiguation" },
  { id: 178, text: "Mi imaginación es superior a mi sentido de la realidad.", dimensionId: "sensacion-intuicion", trueIndicates: "poleB", priority: "core" },
  { id: 179, text: "Estoy motivado para llegar a ser uno de los mejores en mi campo de trabajo.", dimensionId: "modificacion-acomodacion", trueIndicates: "poleA", priority: "validation" },
  { id: 180, text: "Tengo un comportamiento que logra ganarme la aprobación de la gente.", dimensionId: "retraimiento-comunicatividad", trueIndicates: "poleB", priority: "validation" },
]

// Helper functions
export function getQuestionsByDimension(dimensionId: string): Question[] {
  return fullQuestionDeck.filter(q => q.dimensionId === dimensionId)
}

export function getCoreQuestions(): Question[] {
  return fullQuestionDeck.filter(q => q.priority === "core")
}

// Get primary questions (core + validation) for the fixed 5 questions per dimension
export function getPrimaryQuestions(): Question[] {
  return fullQuestionDeck.filter(q => q.priority === "core" || q.priority === "validation")
}

// Get primary questions for a specific dimension
export function getPrimaryQuestionsForDimension(dimensionId: string): Question[] {
  return fullQuestionDeck.filter(q => q.dimensionId === dimensionId && (q.priority === "core" || q.priority === "validation"))
}

export function getValidationQuestions(dimensionId: string): Question[] {
  return fullQuestionDeck.filter(q => q.dimensionId === dimensionId && q.priority === "validation")
}

export function getDisambiguationQuestions(dimensionId: string): Question[] {
  return fullQuestionDeck.filter(q => q.dimensionId === dimensionId && q.priority === "disambiguation")
}

// Get all questions for a dimension (for additional questions when needed)
export function getAllQuestionsForDimension(dimensionId: string): Question[] {
  return fullQuestionDeck.filter(q => q.dimensionId === dimensionId)
}

export function getImpressionManagementQuestions(): Question[] {
  return fullQuestionDeck.filter(q => q.isImpressionManagement === true)
}

export function getQuestionById(id: number): Question | undefined {
  return fullQuestionDeck.find(q => q.id === id)
}

export function getDimensionById(id: string): Dimension | undefined {
  return dimensions.find(d => d.id === id)
}


