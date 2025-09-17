import { Component } from '@angular/core';
import { AuthService } from '../../../core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  //title = 'Dashboard';
  showToggle = true;
  selectedDate: Date | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onToggleChanged(event: any) {
    this.showToggle = event.checked;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
