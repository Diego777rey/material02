import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private router: Router) {}

  // Guarda el JWT y datos del usuario
  login(token: string, userData: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Borra la sesión
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  clearSession() {
    this.logout();
  }

  // Verifica si hay token
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtiene token JWT
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtiene información del usuario
  getUsuario(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Verifica si el usuario actual es administrador
  isAdmin(): boolean {
    const usuario = this.getUsuario();
    return usuario && usuario.rol === 'ADMIN';
  }

  // Obtiene el avatar según el rol del usuario
  getAvatarByRole(): string {
    const usuario = this.getUsuario();
    if (!usuario || !usuario.rol) {
      return 'person'; // Avatar por defecto
    }

    const rol = usuario.rol.toUpperCase();
    
    switch (rol) {
      case 'ADMIN':
        return 'admin_panel_settings';
      case 'USER':
        return 'person';
      case 'VENDEDOR':
        return 'storefront';
      case 'CLIENTE':
        return 'shopping_cart';
      case 'GERENTE':
        return 'supervisor_account';
      case 'EMPLEADO':
        return 'badge';
      case 'EDITOR':
        return 'edit';
      default:
        return 'person';
    }
  }

  // Obtiene el color del avatar según el rol
  getAvatarColorByRole(): string {
    const usuario = this.getUsuario();
    if (!usuario || !usuario.rol) {
      return 'primary';
    }

    const rol = usuario.rol.toUpperCase();
    
    switch (rol) {
      case 'ADMIN':
        return 'primary'; // Azul para admin
      case 'USER':
        return 'primary'; // Azul para usuario
      case 'VENDEDOR':
        return 'accent'; // Verde para vendedor
      case 'CLIENTE':
        return 'primary'; // Azul para cliente
      case 'GERENTE':
        return 'warn'; // Rojo para gerente
      case 'EMPLEADO':
        return 'accent'; // Verde para empleado
      case 'EDITOR':
        return 'primary'; // Azul para editor
      default:
        return 'primary';
    }
  }
}
