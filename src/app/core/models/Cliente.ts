import { Vehiculo } from "./Vehiculo";

export interface Cliente {
  id: number;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDoc: string;
  correo: string;
  direccion: string;
  telefono: string;
  tipoCliente: string;
  vehiculos?: Vehiculo[];
  tipoPago: string;
}
