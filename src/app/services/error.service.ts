import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  error(code: string): string {
    switch (code) {
      //Email ya registrado
      case 'auth/email-already-in-use':
        return 'El correo ya esta registrado';

      // Correo invalido
      case 'auth/invalid-email':
        return 'El correo es invalido';

      // La constraseña es muy debil
      case 'auth/weak-password':
        return 'La constraseña es muy debil';

      case 'auth/user-not-found':
        return 'Usuario invalido';

      case 'auth/wrong-password':
        return 'La contraseña es invalida';

      default:
        return 'Error desconocido';
    }
  }
}
