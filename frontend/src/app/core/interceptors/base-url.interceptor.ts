import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '@/app/core/config/api.config';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);

  // Only prepend base URL if the request URL is relative (doesn't start with http:// or https://)
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const apiReq = req.clone({
      url: `${baseUrl}${req.url}`,
    });
    return next(apiReq);
  }

  return next(req);
};
