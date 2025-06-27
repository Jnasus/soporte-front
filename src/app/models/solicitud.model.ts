export interface Solicitud {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  clienteId: number;
  colaboradorId?: number;
  clienteNombre?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaCierre?: string;
} 