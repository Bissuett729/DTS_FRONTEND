/*La función buildHeaders genera un objeto HttpHeaders que incluye encabezados estándar para peticiones HTTP, 
como el tipo de contenido y el token de autenticación. También permite agregar encabezados adicionales de forma dinámica.
Este servicio aplica buenas prácticas como:
Uso de localStorage para persistencia de sesión.
Encabezado Authorization con formato estándar Bearer.
Flexibilidad mediante el parámetro extra.
Encapsulamiento de lógica repetitiva: Evita duplicar código en cada petición HTTP.*/

import { HttpHeaders } from '@angular/common/http';

export function buildHeaders(extra: Record<string, string> = {}): HttpHeaders {

  const token = localStorage.getItem('token') || '';

  return new HttpHeaders({

    'Authorization': `Bearer ${token}`,
    ...extra

  });

};
