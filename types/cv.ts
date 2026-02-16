export interface Experiencia {
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  actual: boolean;
}

export interface Educacion {
  institucion: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface CV {
  nombre: string;
  email: string;
  telefono: string;
  resumen: string;
  experiencias: Experiencia[];
  educacion: Educacion[];
  habilidades: string[];
}
