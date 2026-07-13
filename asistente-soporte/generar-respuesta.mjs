// ============================================================
//  BACKEND · Función que habla con la IA (Claude)
//  Esta función corre en el servidor de Netlify, NO en el navegador.
//  Por eso aquí SÍ es seguro usar la llave secreta.
// ============================================================

export default async (req) => {
  try {
    // 1) Leer lo que mandó el frontend (mensaje, idioma, tono, longitud)
    const { mensaje, idioma, tono, longitud } = await req.json();
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

    // 3) Llamar a la API de Claude (aquí se usa la llave secreta, escondida)
    const respuestaAPI = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,   // 🔐 la llave vive en Netlify, no en el código
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",     // modelo económico, ideal para el demo
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    // 4) Sacar el texto que respondió la IA
    const data = await respuestaAPI.json();
    const texto = data.content[0].text;

    // 5) Devolver la respuesta al frontend
    return new Response(JSON.stringify({ respuesta: texto }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ respuesta: "❌ Error al generar la respuesta. Revisa la configuración de la llave." }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
