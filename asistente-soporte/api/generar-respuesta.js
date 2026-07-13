// ============================================================
//  BACKEND (Vercel) · Función que habla con la IA (Claude)
//  Vive en /api/ y corre en el servidor de Vercel.
//  La llave secreta se lee de una variable de entorno (segura).
//
//  NOTA: versión con "detector de errores" para depurar.
//  Cuando ya funcione, la simplificamos.
// ============================================================

export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== "POST") {
    res.status(405).json({ respuesta: "Método no permitido." });
    return;
  }

  try {
    // 1) Leer lo que mandó el frontend (Vercel ya lo convierte a objeto)
    const { mensaje, idioma, tono, longitud } = req.body;

    // 1.5) DETECTOR: ¿existe la llave en las variables de entorno?
    const llave = process.env.ANTHROPIC_API_KEY;
    if (!llave) {
      res.status(500).json({
        respuesta: "🔍 DIAGNÓSTICO: La variable ANTHROPIC_API_KEY NO existe o está vacía en Vercel. Agrégala en Settings → Environment Variables y vuelve a desplegar.",
      });
      return;
    }

    const idiomaTexto = idioma === "en" ? "inglés" : "español";
    const longitudTexto = longitud === "breve"
      ? "breve y directa (2 a 4 oraciones)"
      : "completa y bien desarrollada";

    // 2) Armar la instrucción (el "prompt") para la IA
    const prompt = `Eres un agente de soporte al cliente profesional y empático.
Redacta una respuesta ${longitudTexto}, con tono ${tono}, escrita en ${idiomaTexto}, para el mensaje de un cliente.
Sé claro, resuelve o encamina el problema, y mantén un trato humano.
Responde SOLO con el texto de la respuesta, sin encabezados como "Respuesta:".

Mensaje del cliente:
"""
${mensaje}
"""`;

    // 3) Llamar a la API de Claude (la llave vive en Vercel, escondida)
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

    // 3.5) DETECTOR: ¿la API de Claude respondió con error?
    if (!respuestaAPI.ok) {
      const errorTexto = await respuestaAPI.text();
      res.status(500).json({
        respuesta: `🔍 DIAGNÓSTICO: Claude respondió con error ${respuestaAPI.status}. Detalle: ${errorTexto.slice(0, 300)}`,
      });
      return;
    }

    // 4) Sacar el texto y devolverlo al frontend
    const data = await respuestaAPI.json();
    const texto = data.content[0].text;

    res.status(200).json({ respuesta: texto });
  } catch (error) {
    // DETECTOR: mostrar el mensaje real del error para depurar
    res.status(500).json({
      respuesta: `🔍 DIAGNÓSTICO (excepción): ${error.message}`,
    });
  }
}
