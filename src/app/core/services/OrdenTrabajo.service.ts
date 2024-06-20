import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenTrabajo } from '../models/OrdenTrabajo';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8080/api/ordenes-trabajo';

  constructor() { }

  list(): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(this.apiUrl);
  }

  get(id: number) {
    return this.http.get<OrdenTrabajo>(`${this.apiUrl}/${id}`);
  }

  save(vehiculo: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http.post<OrdenTrabajo>(this.apiUrl, vehiculo);
  }

  update(id: number, ordenTrabajo: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http.put<OrdenTrabajo>(`${this.apiUrl}/${id}`, ordenTrabajo);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
