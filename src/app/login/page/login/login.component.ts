import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/components/usuario.service';
import { InputUsuario } from 'src/app/usuario/components/input.usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/guards/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    contrasenha: ['', Validators.required],
  });

  returnUrl: string = '/dashboard/bienvenido'; // URL por defecto

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Captura la URL a la que intentaba acceder antes de loguearse
    const queryReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (queryReturnUrl) {
      this.returnUrl = queryReturnUrl;
    }
  }

  iniciarSesion() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const { nombre, contrasenha } = this.usuarioForm.value;

    this.usuarioService.getAll().subscribe((usuarios: InputUsuario[]) => {
      const usuarioEncontrado = usuarios.find(
        u => u.nombre === nombre && u.contrasenha === contrasenha
      );

      if (usuarioEncontrado) {
        console.log('Login exitoso', usuarioEncontrado);
        this.authService.login(usuarioEncontrado);

        // Redirige a la URL original o al dashboard
        this.router.navigateByUrl(this.returnUrl);
      } else {
        alert('Usuario o contraseña incorrecta');
        console.log('Usuario o contraseña incorrecta');
      }
    });
  }
}
