

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api'; // Ajusta según tu URL del backend

  constructor(private http: HttpClient) {
    this.checkCurrentUser();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { username, password })
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }, { withCredentials: true })
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        }),
        catchError(this.handleError)
      );
  }

  checkCurrentUser(): void {
    this.http.get(`${this.apiUrl}/auth/current-user`, { withCredentials: true })
      .pipe(catchError(() => {
        this.currentUserSubject.next(null);
        return throwError(() => new Error('No autenticado'));
      }))
      .subscribe((user: any) => {
        if (user.authenticated) {
          this.currentUserSubject.next(user);
        } else {
          this.currentUserSubject.next(null);
        }
      });
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.authenticated;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.roles && currentUser.roles.includes(role);
  }

  private handleError(error: any) {
    console.error('Error en la operación:', error);
    let errorMessage = 'Ocurrió un error';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}


