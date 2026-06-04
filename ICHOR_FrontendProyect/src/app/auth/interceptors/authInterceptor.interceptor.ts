import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { LogInPost } from '../../interfaces/LogIn/LogInPost';
import { EncryptDataService } from '../../services/EncryptData.service';
import { LogInCredentials } from '../../interfaces/LogIn/LogInCredentials';
import { Router } from '@angular/router';

// @Injectable()
// export class authCredentialsInterceptor implements HttpInterceptor {

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     const username = sessionStorage.getItem('username');
//     const password = sessionStorage.getItem('password');

//     const encryptService = inject(EncryptDataService);
//     const router = inject(Router);

//         if (!username || !password) {
//       next.handle(req);
//     }

//     const credentials: LogInCredentials = {
//       username: username!,
//       password: password!
//     }


//     return from(encryptService.encrypt(JSON.stringify(credentials)))
//       .pipe(
//         switchMap(ecntrypted => {

//           const clonedRequest = req.clone({
//             setHeaders: {
//               Authorization: ecntrypted
//             }
//           });

//           return next.handle(clonedRequest)

//         })
//       );

//   }
// }
