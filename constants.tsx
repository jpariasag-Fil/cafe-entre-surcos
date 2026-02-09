import React from 'react';

// Default conversion factors based on industry standards if no history exists
// Cereza -> Pergamino (~5:1 or 20%)
// Pergamino -> Verde (~20% loss or 80% yield)
// Verde -> Tostado (~15-20% loss or 80-85% yield)
export const DEFAULT_FACTORS = {
  cerezaToPergamino: 0.20,
  pergaminoToVerde: 0.80,
  verdeToTostado: 0.84,
};

export const SAMPLE_DATA = [
  {
    id: 'b-1',
    date: '2023-10-15',
    weightCereza: 1000,
    weightPergamino: 210,
    weightVerde: 170,
    weightTostado: 142,
    notes: 'Cosecha temprana, buena humedad.'
  },
  {
    id: 'b-2',
    date: '2023-11-02',
    weightCereza: 1200,
    weightPergamino: 235,
    weightVerde: 185,
    weightTostado: 155,
    notes: 'Lluvias recientes aumentaron peso en agua.'
  },
  {
    id: 'b-3',
    date: '2023-12-10',
    weightCereza: 850,
    weightPergamino: 175,
    weightVerde: 142,
    weightTostado: 121,
    notes: 'Grano óptimo.'
  }
];

// Icons as components
export const Icons = {
  Bean: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.18 4.39A9.1 9.1 0 0 1 12 4a9 9 0 0 1 9 9 9.1 9.1 0 0 1-.4 1.83" />
      <path d="M12 20a9 9 0 0 1-9-9 9.1 9.1 0 0 1 .4-1.83" />
      <path d="M18.82 9.61a4.5 4.5 0 0 1 1.57 3.56A4.5 4.5 0 0 1 16 17.5a4.5 4.5 0 0 1-3.18-1.39l-4.24-4.22A4.5 4.5 0 0 1 8 8a4.5 4.5 0 0 1 4.39-4.39 4.5 4.5 0 0 1 3.56 1.57" />
      <path d="M12.5 16a2.5 2.5 0 0 1-3.6-2.5" />
    </svg>
  ),
  Scale: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  ),
  Chart: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M9 5h4" />
      <path d="M5 21v-4" />
      <path d="M9 19h4" />
    </svg>
  ),
  History: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  Trash: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
   Info: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
};