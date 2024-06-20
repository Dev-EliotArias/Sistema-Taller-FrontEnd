export interface OrdenTrabajo {
  id: number;
  vehiculoId: number;
  fechaIngreso: string;
  fechaSalida: string;
  serviciosId: number[];
  costoTotal: number;
  comentario: string;
  estado: string;
  tecnicoId: number;
}
