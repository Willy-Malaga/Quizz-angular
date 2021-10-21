import { Component, OnInit } from '@angular/core';
import { QuizzService } from '../../../services/quizz.service';
import { Pregunta } from '../../../models/Pregunta';
import { Cuestionario } from '../../../models/Cuestionario';
import { Router } from '@angular/router';
import { nanoid } from 'nanoid'
import { User } from '../../../interfaces/User';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-preguntas',
  templateUrl: './list-preguntas.component.html',
  styleUrls: ['./list-preguntas.component.css']
})
export class ListPreguntasComponent implements OnInit {
  listPreguntas: Pregunta[]=[];
  tituloCuestionario: string;
  descripcionCuestionario: string;
  loading = false;

  constructor(private _quizzService: QuizzService, private router: Router, private toastr: ToastrService) {
    this._quizzService.getPreguntas().subscribe(data => {
      console.log(data);
      this.listPreguntas.push(data);
      console.log(this.listPreguntas);
    })
    this.tituloCuestionario = this._quizzService.tituloCuestionario;
    this.descripcionCuestionario = this._quizzService.descripcion;
   }

  ngOnInit(): void {
    if(this.tituloCuestionario === '' || this.descripcionCuestionario === ''){
      this.router.navigate(['/dashboard'])
    }
  }

  eliminarPregunta(index: number){
    this.listPreguntas.splice(index, 1);
  }

  finalizarCuestionario(){
    const codigo = this.generarCodigo();
    const usuario: User = JSON.parse(localStorage.getItem('user') || '{}');
    

    const cuestionario: Cuestionario ={
      uid: usuario.uid,
      titulo: this.tituloCuestionario,
      descripcion: this.descripcionCuestionario,
      codigo: codigo,
      cantPreguntas: this.listPreguntas.length,
      fechaCreacion: new Date(),
      listPreguntas: this.listPreguntas
    }
    console.log(cuestionario);

    this.loading = true;
    this._quizzService.crearCuestionario(cuestionario).then(data => {
      this.toastr.success('El cuestionario fue registrado con exito!', 'Cuestionario Registrado')
      this.router.navigate(['/dashboard'])
    }).catch(error => {
      this.loading = false;
      console.log(error);
    })

    
  }

  generarCodigo(): string{
    return nanoid(6).toUpperCase();
  }

}
