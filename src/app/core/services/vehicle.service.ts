import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Vehiculo } from '../models/Vehiculo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private http = inject(HttpClient);
  private apiURL = 'http://127.0.0.1:8080/api/vehiculos'

  constructor() { }

  list(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.apiURL);
  }

  get(id: number) {
    return this.http.get<Vehiculo>(`${this.apiURL}/${id}`);
  }

  save(vehiculo: Vehiculo): Observable<Vehiculo>{
    return this.http.post<Vehiculo>(this.apiURL, vehiculo);
  }

  update(id: number, vehiculo: Vehiculo): Observable<Vehiculo>{
    return this.http.put<Vehiculo>(`${this.apiURL}/${id}`, vehiculo);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`)
  }
}
