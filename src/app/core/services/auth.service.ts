import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly ROLE = 'ROLE';
  private loggedUser?: string;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiURL = 'http://127.0.0.1:8080/auth/login'


  constructor() { }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(this.apiURL, { username, password});
  // }

  login(user:{
    username: string, password: string
  }): Observable<any> {
    return this.http.post(this.apiURL, user).pipe(
      tap((response: any) => this.doLoginUser(user.username, response.token, response.role))
    )
  }

  private doLoginUser(username: string, token: any, role: any){
    this.loggedUser = username;
    this.storeJwtToken(token, role);
    this.isAuthenticated.next(true);
  }

  private storeJwtToken(jwt: string, role: string){
    localStorage.setItem(this.JWT_TOKEN, jwt);
    localStorage.setItem(this.ROLE, role);
  }

  logout(){
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }


  isLoggedIn() {
    return this.isAuthenticated.value;
  }

}
