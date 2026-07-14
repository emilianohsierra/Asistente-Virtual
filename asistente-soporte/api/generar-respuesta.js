// ============================================================
//  BACKEND (Vercel) · Función que habla con la IA (Claude)
//  Vive en /api/ y corre en el servidor de Vercel.
//  La llave secreta se lee de una variable de entorno (segura).
//
//  Hace 2 cosas:
//   1) GENERAR: crea una respuesta nueva desde el mensaje del cliente.
//   2) AJUSTAR (acción rápida): transforma una respuesta ya existente
//      (más breve / más formal / más cálida / traducir).
// ============================================================

export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== "POST") {
    res.status(405).json({ respuesta: "Método no permitido." });
    return;
  }

  try {
    // Leer lo que mandó el frontend
    const { mensaje, idioma, tono, longitud, accion, respuestaPrevia, agente, empresa } = req.body;

    // ¿Existe la llave en las variables de entorno?
    const llave = process.env.ANTHROPIC_API_KEY;
    if (!llave) {
      res.status(500).json({ respuesta: "⚠️ Falta configurar la llave de la IA en el servidor." });
      return;
    }

    const idiomaTexto = idioma === "en" ? "inglés" : "español";

    // Construimos el "prompt" según lo que pidió el frontend
    let prompt;

    if (accion && respuestaPrevia) {
      // ---- MODO ACCIÓN RÁPIDA: transformar una respuesta existente ----
      const instrucciones = {
        breve: "Acorta la siguiente respuesta de atención al cliente para que sea más breve y directa (2 a 4 oraciones), conservando el mismo idioma y lo esencial.",
        formal: "Reescribe la siguiente respuesta de atención al cliente para que suene más formal y profesional, sin cambiar el idioma ni el significado.",
        calida: "Reescribe la siguiente respuesta de atención al cliente para que suene más cálida, cercana y empática, sin cambiar el idioma ni el significado.",
        traducir: "Traduce la siguiente respuesta de atención al cliente al inglés si está en español, o al español si está en inglés.",
      };
      const instr = instrucciones[accion] || instrucciones.formal;
      prompt = `${instr}
Responde SOLO con el texto resultante, sin encabezados ni comillas.

Respuesta:
"""
${respuestaPrevia}
"""`;
    } else {
      // ---- MODO NORMAL: generar una respuesta nueva ----
      const longitudTexto = longitud === "breve"
        ? "breve y directa (2 a 4 oraciones)"
        : "completa y bien desarrollada";

      // Modo profesional: si mandaron nombre y/o empresa, pedimos una firma al final
      let firma = "";
      if (agente || empresa) {
        const quien = [agente, empresa].filter(Boolean).join(" — ");
        firma = `\nTermina con una despedida profesional y una firma (en el mismo idioma de la respuesta) usando: ${quien}.`;
      }

      prompt = `Eres un agente de soporte al cliente profesional y empático.
Redacta una respuesta ${longitudTexto}, con tono ${tono}, escrita en ${idiomaTexto}, para el mensaje de un cliente.
Sé claro, resuelve o encamina el problema, y mantén un trato humano.
Responde SOLO con el texto de la respuesta, sin encabezados como "Respuesta:".${firma}

Mensaje del cliente:
"""
${mensaje}
"""`;
    }

    // Llamar a la API de Claude (la llave vive en Vercel, escondida)
    const respuestaAPI = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": llave,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!respuestaAPI.ok) {
      res.status(500).json({ respuesta: "❌ La IA devolvió un error. Intenta de nuevo en un momento." });
      return;
    }

    const data = await respuestaAPI.json();
    const texto = data.content[0].text;
    res.status(200).json({ respuesta: texto });
  } catch (error) {
    res.status(500).json({ respuesta: "❌ Error al generar la respuesta. Intenta de nuevo." });
  }
}
