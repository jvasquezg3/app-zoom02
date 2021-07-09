import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
//con el decorador @input pasa una variable o fuete de media de la camara de los usuarios que se estan conectando
export class VideoPlayerComponent implements OnInit {
  @Input() stream: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
