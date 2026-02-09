export type CoffeeStage = 'cereza' | 'pergamino' | 'verde' | 'tostado';
 
export interface BatchData {
  id: string;
  date: string;
  weightCereza: number;
  weightPergamino: number;
  weightVerde: number;
  weightTostado: number;
  notes?: string;
}

export interface ConversionFactors {
  cerezaToPergamino: number; // e.g., 0.20 (20%)
  pergaminoToVerde: number;  // e.g., 0.80 (80%)
  verdeToTostado: number;    // e.g., 0.85 (85%)
}

export interface ProjectionResult {
  sourceStage: CoffeeStage;
  sourceWeight: number;
  projectedCereza: number;
  projectedPergamino: number;
  projectedVerde: number;
  projectedTostado: number;
}

export interface AIAnalysisResult {
  text: string;
  recommendations: string[];
}