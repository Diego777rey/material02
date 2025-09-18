import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/guards/auth.service';
import { Apollo } from 'apollo-angular';
import { LOGIN_USUARIO } from 'src/app/graphql/graphql/usuario.graphql';

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

  returnUrl: string = '/dashboard/bienvenido';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
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

    const nombre = this.usuarioForm.value.nombre ?? '';
    const contrasenha = this.usuarioForm.value.contrasenha ?? '';

    console.log('Intentando login con:', { nombre, contrasenha: '***' });
    console.log('Formulario completo:', this.usuarioForm.value);
    console.log('Nombre específico:', this.usuarioForm.get('nombre')?.value);
    console.log('¿Nombre válido?', this.usuarioForm.get('nombre')?.valid);
    console.log('¿Formulario válido?', this.usuarioForm.valid);

    console.log('Enviando datos de login:', { nombre, contrasenha: '***' });
    
    this.apollo.mutate({
      mutation: LOGIN_USUARIO,
      variables: {
        input: {
          nombre: nombre,
          contrasenha: contrasenha
        }
      },
      errorPolicy: 'all'
    }).subscribe({
      next: (result: any) => {
        console.log('Respuesta completa del login:', result);

        if (result.errors && result.errors.length > 0) {
          console.error('Errores GraphQL:', result.errors);
          const errorMessage = result.errors[0].message;
          alert(`Error: ${errorMessage}`);
          return;
        }

        const loginResult = result.data?.login;
        if (loginResult && loginResult.token) {
          console.log('Login exitoso', loginResult);
          // Guardar token JWT y datos del usuario en AuthService
          const token = loginResult.token;
          const usuario = loginResult.usuario;
          this.authService.login(token, usuario);
          this.router.navigateByUrl(this.returnUrl);
        } else {
          console.log('Login fallido - no hay datos de usuario');
          alert('Usuario o contraseña incorrecta. Verifica las credenciales.');
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        if (err.graphQLErrors?.length > 0) {
          alert(`Error: ${err.graphQLErrors[0].message}`);
        } else if (err.networkError) {
          alert('Error de conexión. Verifique que el servidor esté ejecutándose.');
        } else {
          alert('Ocurrió un error en el login');
        }
      }
    });
  }
}
