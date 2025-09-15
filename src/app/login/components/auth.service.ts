import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // 🔹 Esto es clave, garantiza singleton en toda la app
})
export class AuthService {
  private _isLoggedIn = false;

  constructor() {
    const stored = localStorage.getItem('isLoggedIn');
    this._isLoggedIn = stored === 'true';
  }

  login() {
    this._isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true'); // 🔹 persistir sesión
  }

  logout() {
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}
