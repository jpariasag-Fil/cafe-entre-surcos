import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BatchData, ConversionFactors, AIAnalysisResult } from "../types";

const getClient = () => {
  // En Vite para Netlify se usa import.meta.env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

export const analyzeProductionData = async (
  batches: BatchData[],
  currentFactors: ConversionFactors
): Promise<AIAnalysisResult> => {
  const genAI = getClient();
  
  if (!genAI) {
    return {
      text: "API Key de Gemini no configurada en Netlify.",
      recommendations: ["Por favor configure VITE_GEMINI_API_KEY para recibir análisis."]
    };
  }

  const batchSummary = batches.map(b => 
    `Fecha: ${b.date}, Cereza: ${b.weightCereza}kg, Pergamino: ${b.weightPergamino}kg, Verde: ${b.weightVerde}kg, Tostado: ${b.weightTostado}kg. Notas: ${b.notes || 'N/A'}`
  ).join('\n');

  const prompt = `
    Actúa como un agrónomo experto en producción de café de especialidad para la marca "Café Entre Surcos".
    Analiza los siguientes datos históricos de producción:
    
    ${batchSummary}

    Factores de conversión actuales calculados (promedios):
    - Cereza a Pergamino: ${(currentFactors.cerezaToPergamino * 100).toFixed(2)}%
    - Pergamino a Verde: ${(currentFactors.pergaminoToVerde * 100).toFixed(2)}%
    - Verde a Tostado: ${(currentFactors.verdeToTostado * 100).toFixed(2)}%

    Provee un análisis conciso sobre la eficiencia del proceso.
    Identifica anomalías o lotes con rendimientos inusuales.
    Dame 3 recomendaciones prácticas para mejorar el rendimiento o reducir mermas en la finca.
    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "text": "tu análisis aquí",
      "recommendations": ["rec 1", "rec 2", "rec 3"]
    }
  `;

  try {
    // Usamos gemini-1.5-flash que es rápido y estable
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    const parsedResult = JSON.parse(jsonText);
    
    return {
      text: parsedResult.text || "Análisis generado exitosamente.",
      recommendations: parsedResult.recommendations || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "Hubo un error al conectar con el asistente agrónomo.",
      recommendations: ["Verifique la API Key en Netlify", "Intente de nuevo en unos minutos"]
    };
  }
};