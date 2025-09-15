import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/usuario/components/usuario.service';
import { InputUsuario } from 'src/app/usuario/components/input.usuario';
import { Router } from '@angular/router';
import { AuthService } from '../../components/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuarioForm = this.fb.group({
    'nombre': ['', Validators.required],
    'contrasenha': ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService, private router: Router,private authService: AuthService) {} // 🔹 inyectamos el servicio

  ngOnInit(): void {}

  iniciarSesion() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.usuarioForm.value;
    const nombre = formValue.nombre;
    const contrasenha = formValue.contrasenha;

    this.usuarioService.getAll().subscribe((usuarios: InputUsuario[]) => {
      const usuarioEncontrado = usuarios.find(u => u.nombre === nombre && u.contrasenha === contrasenha);
      if (usuarioEncontrado) {
        console.log('Login exitoso', usuarioEncontrado);
        this.authService.login();
        this.router.navigate(['/bienvenido']);
      } else {
        alert('Usuario o contraseña incorrecta')
        console.log('Usuario o contraseña incorrecta');
      }
    });
  }
}
