import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {
  constructor(private http: Http) { }
  
  getEntradas(){
    return this.http.get('/api/v1/entradas').map(res => res.json());
  };
  insertEntrada(data){
    return this.http.post('/api/v1/entrada', data).map(res => res.json());
  }
  deleteEntrada(data){
    return this.http.post('/api/v1/entrada_d', data).map(res => res.json());
  }

}
