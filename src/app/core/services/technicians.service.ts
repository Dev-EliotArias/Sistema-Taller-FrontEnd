import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Technician } from '../models/Technician';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechniciansService {

  private http = inject(HttpClient);
  private apiURL = `http://127.0.0.1:8080/api/tecnicos`;

  constructor() { }

  list(): Observable<Technician[]> {
    return this.http.get<Technician[]>(this.apiURL);
  }

  get(id: number) {
    return this.http.get<Technician>(`${this.apiURL}/${id}`);
  }

  save(tecnico: Technician): Observable<Technician> {
    return this.http.post<Technician>(this.apiURL, tecnico);
  }

  update(id: number, tecnico: Technician): Observable<Technician> {
    return this.http.put<Technician>(`${this.apiURL}/${id}`, tecnico);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`)
  }

}
