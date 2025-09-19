import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  //title = 'Dashboard';
  showToggle = true;
  selectedDate: Date | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Componente inicializado
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onToggleChanged(event: any) {
    this.showToggle = event.checked;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
