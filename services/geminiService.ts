import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStepExplanation = async (stepTitle: string, context: string): Promise<string> => {
  try {
    const prompt = `
      Actúa como un profesor experto de tecnología para alumnos de secundaria (ESO/Bachillerato).
      
      Estamos en una simulación de reparación de móviles.
      El alumno está en el paso: "${stepTitle}".
      Contexto técnico: ${context}.

      Dame una explicación breve (máximo 80 palabras) y curiosa sobre por qué este paso es importante o un consejo de seguridad vital. 
      Usa un tono alentador y educativo.
      No uses formato markdown complejo, solo texto plano.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar la explicación.";
  } catch (error) {
    console.error("Error fetching Gemini content:", error);
    return "Lo siento, la IA no está disponible en este momento. Sigue las instrucciones manuales.";
  }
};

export const getTechFact = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Dame un dato curioso muy breve (1 frase) sobre la historia de los smartphones o sus componentes internos (como el litio, gorilla glass, etc).",
    });
    return response.text || "¿Sabías que tu móvil tiene más potencia que la NASA en 1969?";
  } catch (error) {
    return "¿Sabías que el primer móvil pesaba más de 1 kg?";
  }
};