import { inject} from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor (private authService: AuthService,
//                private router: Router) {}

//   canActivate(): Observable<boolean> {
//     return this.authService.isAuth().pipe(
//       tap( estado => {
//         if(!estado) this.router.navigate(['/login']);
//       })
//     );
//   }
// }


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(AuthService)
    .isAuth()
    .pipe(
        tap(estado => {
          if (!estado) {
            router.navigate(['/login']);
          }
        })
    );
}
