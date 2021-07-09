import {Injectable} from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  peer: any;

  constructor() {
    this.peer = new Peer(undefined, { //dejamos como undefinido ya que se mostrara el número de id
      host: 'localhost',
      port: 3001  //se iniciacilza el puerto de peerjs 3001 socket.io utiliza el 3000
    });
  }
}
