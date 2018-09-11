import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../servicios/entradas.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  Peliculas: any = [];
  constructor(private entradasService: EntradasService) { }

  ngOnInit() {
    this.entradasService.getEntradas().subscribe(rows =>{
      this.Peliculas = rows.data;
    });
  }
  private delete(i){
    this.entradasService.deleteEntrada({
      "id_peli":this.Peliculas[i].id_peli}).subscribe(res=>{
        window.alert("Pelicula eliminada");
      })
  }
}
