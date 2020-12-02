import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationServiceInterface } from './authorization-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements AuthorizationServiceInterface {

  constructor(private http: HttpClient) { }

  login(id: string): Observable<string> {
    throw new Error('Method not implemented.');
  }
  
  signup(name: string, email: string, password: string): Observable<string> {
    const data = {
      name: name,
      email: email,
      password: password
    }
    return this.http.post<string>(`http://localhost:5000/users/signup`, data);
  }
}
