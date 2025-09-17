import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  login(usuario: any) {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(usuario));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): any {
    const data = localStorage.getItem(this.TOKEN_KEY);
    return data ? JSON.parse(data) : null;
  }
}
