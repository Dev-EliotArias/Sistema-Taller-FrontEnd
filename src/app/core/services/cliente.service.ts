import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private apiURL = 'http://127.0.0.1:8080/api/clientes'

  constructor() { }

  list(){
    return this.http.get<any>(this.apiURL);
  }

  get(id: number) {
    return this.http.get<Cliente>(`${this.apiURL}/?id=${id}`);
  }

  save(cliente: Cliente) {
    return this.http.post<Cliente>(`${this.apiURL}/`, cliente);
  }

  update(id: number, cliente: Cliente) {
    return this.http.put<Cliente>(`${this.apiURL}/?id=${id}`, cliente);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiURL}/?id=${id}`)
  }

}

