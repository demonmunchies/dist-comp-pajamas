import { Observable } from 'rxjs';

export interface AuthorizationServiceInterface {
    login(id: string): Observable<string>;
    signup(name: string, email: string, password: string): Observable<string>;
}