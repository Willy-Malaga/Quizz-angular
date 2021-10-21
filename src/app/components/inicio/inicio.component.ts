import { Component, OnDestroy, OnInit } from '@angular/core';
import { RespuestaQuizzService } from '../../services/respuesta-quizz.service';

import { Cuestionario } from '../../models/Cuestionario';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, OnDestroy {
  error = false;
  pin = '';
  errorText = '';
  loading = false;
  suscriptionCode: Subscription = new Subscription();

  constructor(private respuestaQuizz: RespuestaQuizzService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void{
    this.suscriptionCode.unsubscribe();
  }

  ingresar() {
    // Validar si el usuario no ingreso ningun caracter
    if (this.pin == '') {
      this.errorMensaje('Por favor ingrese PIN');
      return;
    }
    this.loading = true;
    this.suscriptionCode = this.respuestaQuizz.searchByCode(this.pin).subscribe(
      (data) => {
        console.log(data);
        this.loading = false;
        if (data.empty) {
          this.errorMensaje('PIN invalido');
        } else {
          data.forEach((element: any) => {
            const cuestionario: Cuestionario = {
              id: element.id,
              ...element.data(),
            }
            this.respuestaQuizz.cuestionario = cuestionario;
            // Redireccionar al proximo componente
            this.router.navigate(['/jugar'])    
          });
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  errorMensaje(text: string) {
    this.errorText = text;
    this.error = true;
    this.pin = '';

    // Mostramos el error por 4 segundos
    setTimeout(() => {
      this.error = false;
    }, 4000);
  }
}
