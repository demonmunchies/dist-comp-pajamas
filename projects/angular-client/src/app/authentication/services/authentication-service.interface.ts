import { Observable } from 'rxjs';

export interface AuthenticationServiceInterface {
    login(email: string, password: string): Observable<{ token: string, user_id: string, user_name: string }>
    register(name: string, email: string, password: string): Observable<{ token: string, user_id: string, user_name: string }>
}