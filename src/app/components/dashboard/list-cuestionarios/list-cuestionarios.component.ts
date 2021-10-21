import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizzService } from '../../../services/quizz.service';
import { Cuestionario } from '../../../models/Cuestionario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-cuestionarios',
  templateUrl: './list-cuestionarios.component.html',
  styleUrls: ['./list-cuestionarios.component.css'],
})
export class ListCuestionariosComponent implements OnInit, OnDestroy {
  subscriptionUser: Subscription = new Subscription();
  subscriptionQuizz: Subscription = new Subscription();
  listCuestionarios: Cuestionario[] = [];
  loading = false;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private _quizzService: QuizzService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.subscriptionUser = this.afAuth.user.subscribe((user) => {
      console.log(user);
      if (user && user.emailVerified) {
        // cargar los cuestionarios
        this.getCuestionarios(user.uid);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  ngOnDestroy(): void {
    this.subscriptionUser.unsubscribe();
    this.subscriptionQuizz.unsubscribe();
  }

  getCuestionarios(uid: string) {
   this.subscriptionQuizz == this._quizzService.getCuestionarioByIdUser(uid).subscribe(data => {
      this.listCuestionarios = [];
      this.loading = false;
      data.forEach((element:any) => {
        this.listCuestionarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.listCuestionarios);
    }, error => {
      console.log(error);
      this.toastr.error('Opss.. ocurrio un error', 'Error');
      this.loading = false;
    });
  }
  eliminarCuestionario(id: string){
    this.loading = true;
    this._quizzService.eliminarCuestionario(id).then(data => {
      this.toastr.error('El cuestionario fue eliminado con exito', 'Registro eliminado!');
      this.loading = false;
    }).catch(() => {
      this.loading = false;
      this.toastr.error('Opss.. ocurrio un error', 'Error');
    })
  }
}
