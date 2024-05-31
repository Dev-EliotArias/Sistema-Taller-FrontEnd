import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TechService } from '../models/TechServices';

@Injectable({
  providedIn: 'root'
})
export class MechServicesService {
  private http = inject(HttpClient);
  private apiURL = `http://127.0.0.1:8080/api/servicios`;

  constructor() { }

  list(): Observable<TechService[]> {
    return this.http.get<TechService[]>(this.apiURL);
  }

  get(id: number) {
    return this.http.get<TechService>(`${this.apiURL}/${id}`);
  }

  save(servicios: TechService): Observable<TechService> {
    return this.http.post<TechService>(this.apiURL, servicios);
  }

  update(id: number, servicios: TechService): Observable<TechService> {
    return this.http.put<TechService>(`${this.apiURL}/${id}`, servicios);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`)
  }
}
