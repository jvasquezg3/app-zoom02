//Servicio que se encarga de manejar a los usuarios que se conectan a la sala informa si alguien se une o se desconecte

import {EventEmitter, Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  events = ['new-user', 'bye-user'];//eventos definidos nuevo usuario y usuario desconectado
  cbEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private socket: Socket) {
    this.listener();
  }
 
  //escucha los eventos 
  listener = () => {
    this.events.forEach(evenName => {
      this.socket.on(evenName, data => this.cbEvent.emit({//socket on escucha cuando un usuario se conecta y lo que va a emitir es la data
        name: evenName,
        data
      }));
    });
  };

  //Envia la data al usuario que se conecta
  joinRoom = (data) => {
    this.socket.emit('join', data);
  }
}
