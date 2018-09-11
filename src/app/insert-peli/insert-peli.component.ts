import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../servicios/entradas.service';

@Component({
  selector: 'app-insert-peli',
  templateUrl: './insert-peli.component.html',
  styleUrls: ['./insert-peli.component.css']
})
export class InsertPeliComponent implements OnInit {

  Titulo="";
  Comentario="";
  Fecha='0000-00-00';
  calif="";
  constructor(private entradasService: EntradasService) { }

  ngOnInit() {
  }

  private insert(){
    this.entradasService.insertEntrada({"titulo": this.Titulo,
      "comentario": this.Comentario,"Fecha":this.Fecha,"calif":this.calif}).subscribe(res=>{
          window.alert("Entrada Ingresada Correctamente");
      });
  }
}
