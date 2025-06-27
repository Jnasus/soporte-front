import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  private userRole: string | null = null;
  private userEmail: string | null = null;
  private userId: number | null = null;
  private accountId: number | null = null; // This will hold clienteId or colaboradorId

  constructor(private http: HttpClient, private router: Router) {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated.next(true);
        const decoded = this.getDecodedToken(token);
        if (decoded) {
          this.userRole = decoded.role;
          this.userEmail = decoded.sub;
          this.userId = decoded.userId;
          this.accountId = decoded.accountId;
        }
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setSession(response);
          this.isAuthenticated.next(true);
        }
      }),
      map(() => true),
      catchError(() => {
        this.isAuthenticated.next(false);
        return of(false);
      })
    );
  }

  private setSession(authResult: any): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', authResult.token);
      localStorage.setItem('refreshToken', authResult.refreshToken);
      const decodedToken = this.getDecodedToken(authResult.token);
      if (decodedToken) {
        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('userEmail', decodedToken.sub);
        localStorage.setItem('userId', decodedToken.userId);
        localStorage.setItem('accountId', decodedToken.accountId);
        this.userRole = decodedToken.role;
        this.userEmail = decodedToken.sub;
        this.userId = decodedToken.userId;
        this.accountId = decodedToken.accountId;
      }
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('accountId');
    }
    this.userRole = null;
    this.userEmail = null;
    this.userId = null;
    this.accountId = null;
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserEmail(): string | null {
    if (!this.userEmail && typeof localStorage !== 'undefined') {
      this.userEmail = localStorage.getItem('userEmail');
    }
    return this.userEmail;
  }

  getUserRole(): string | null {
    if (!this.userRole && typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('userRole');
    }
    return this.userRole;
  }

  getRole(): string | null {
    return this.getUserRole();
  }

  getAccountId(): number | null {
    if (!this.accountId && typeof localStorage !== 'undefined') {
      const accountIdStr = localStorage.getItem('accountId');
      this.accountId = accountIdStr ? parseInt(accountIdStr, 10) : null;
    }
    return this.accountId;
  }

  private getDecodedToken(token: string): any {
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const decoded = JSON.parse(decodedPayload);
      console.log('Token decodificado:', decoded);
      return decoded;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
} 