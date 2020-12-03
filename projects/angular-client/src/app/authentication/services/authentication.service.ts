import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationServiceInterface } from './authentication-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements AuthenticationServiceInterface {

  private BASE_URL: string = 'http://localhost:5000/users';
  private _token: string;
  private _loggedIn: boolean;
  private _userId: string;
  private _userName: string;

  get loggedIn(): boolean {
    return this._loggedIn;
  }

  get token(): string {
    return this._token;
  }

  get userId(): string {
    return this._userId;
  }

  get userName(): string {
    return this._userName;
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string, user_id: string, user_name: string }> {
    const url: string = `${this.BASE_URL}/login`;
    const data = {
      email, password
    }
    return this.http.post<{ status: string, token: string, user_id: string, user_name: string }>(url, data).pipe(
      map(response => {
        this._token = response.token;
        this._loggedIn = true;
        this._userId = response.user_id;
        this._userName = response.user_name
        return { token: response.token, user_id: response.user_id, user_name: response.user_name };
      }));
  }

  register(name: string, email: string, password: string): Observable<{ token: string, user_id: string, user_name: string }> {
    const url: string = `${this.BASE_URL}/signup`;
    const data = {
      name, email, password
    }
    return this.http.post<{ status: string, token: string, user_id: string, user_name: string }>(url, data).pipe(
      map(response => {
        this._token = response.token;
        this._loggedIn = true;
        this._userId = response.user_id;
        this._userName = response.user_name
        return { token: response.token, user_id: response.user_id, user_name: response.user_name };
      }));
  }
}
