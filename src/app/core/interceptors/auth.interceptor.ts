import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    var cloned = req.clone({
      setHeaders:{
        Authorization: `Bearer ${jwtToken}`
      }
    });

    return next(cloned);

  }
  return next(req);
};


function getJwtToken(): string | null {

  if (typeof localStorage !== 'undefined'){
    return localStorage.getItem('JWT_TOKEN')
  }

  return null;
}

