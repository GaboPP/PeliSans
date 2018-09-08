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
      console.log(this.Peliculas);
    });
  }

}
