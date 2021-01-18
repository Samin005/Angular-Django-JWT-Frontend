import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.cookieService.get('auth-token');
    if (authToken !== null) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', 'Token ' + authToken)
      });
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
