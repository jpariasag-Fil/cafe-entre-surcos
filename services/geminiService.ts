import { GoogleGenAI, Type } from "@google/genai";
import { BatchData, ConversionFactors, AIAnalysisResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeProductionData = async (
  batches: BatchData[],
  currentFactors: ConversionFactors
): Promise<AIAnalysisResult> => {
  const ai = getClient();
  if (!ai) {
    return {
      text: "API Key no configurada.",
      recommendations: ["Por favor configure su API Key para recibir análisis inteligente."]
    };
  }

  const batchSummary = batches.map(b => 
    `Fecha: ${b.date}, Cereza: ${b.weightCereza}kg, Pergamino: ${b.weightPergamino}kg, Verde: ${b.weightVerde}kg, Tostado: ${b.weightTostado}kg. Notas: ${b.notes || 'N/A'}`
  ).join('\n');

  const prompt = `
    Actúa como un agrónomo experto en producción de café de especialidad.
    Analiza los siguientes datos históricos de producción de "Café Entre Surcos":
    
    ${batchSummary}

    Factores de conversión actuales calculados (promedios):
    - Cereza a Pergamino: ${(currentFactors.cerezaToPergamino * 100).toFixed(2)}%
    - Pergamino a Verde: ${(currentFactors.pergaminoToVerde * 100).toFixed(2)}%
    - Verde a Tostado: ${(currentFactors.verdeToTostado * 100).toFixed(2)}%

    Provee un análisis conciso sobre la eficiencia del proceso.
    Identifica anomalías o lotes con rendimientos inusuales.
    Dame 3 recomendaciones prácticas para mejorar el rendimiento o reducir mermas.
    Responde en formato JSON estrictamente.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Análisis general del agrónomo" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 3 recomendaciones breves"
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      text: result.text || "No se pudo generar el análisis.",
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "Hubo un error al conectar con el asistente agrónomo.",
      recommendations: ["Verifique su conexión", "Intente más tarde"]
    };
  }
};