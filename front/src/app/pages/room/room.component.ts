import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebSocketService} from "../../web-socket.service";
import {PeerService} from "../../peer.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  roomName: string; //roomName es el nombre de la ruta
  currentStream: any;
  listUser: Array<any> = [];//contiene el listado de los usuarios dentro de la sala

  //Obtenemos el nombre de la sala
  constructor(private route: ActivatedRoute, private webSocketService: WebSocketService,
              private peerService: PeerService) {
    this.roomName = route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.checkMediaDevices();
    this.initPeer();
    this.initSocket();
  }

  //prepara para realizar o recibir llamadas ( le decimos al socket unenos con los demas dispositivos que pertenecen a esta sala)
  initPeer = () => {
    const {peer} = this.peerService;
    peer.on('open', (id) => {
      const body = {
        idPeer: id,
        roomName: this.roomName
      };

      this.webSocketService.joinRoom(body);
    });


    // decimos a peer que este pendiente cuando entre una llamada (define las respuestas de las llamadas)
    peer.on('call', callEnter => {
      callEnter.answer(this.currentStream); //se acepta la llamada mostrando la fuente de video
      callEnter.on('stream', (streamRemote) => {//al aceptar también emite una fuente de video
        this.addVideoUser(streamRemote);
      });
    }, err => {
      console.log('*** ERROR *** Peer call ', err);
    });
  }

  //
  initSocket = () => {
    this.webSocketService.cbEvent.subscribe(res => {
      if (res.name === 'new-user') {
        const {idPeer} = res.data;
        this.sendCall(idPeer, this.currentStream);
      }
    })
  }

  //Verificador si el navegador posee un medio audiovisual, camara, micrófono 
  checkMediaDevices = () => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      }).then(stream => {
        this.currentStream = stream;
        this.addVideoUser(stream);

      }).catch(() => {
        console.log('*** ERROR *** Not permissions');
      });
    } else {
      console.log('*** ERROR *** Not media devices');
    }
  }

  //Permite mostrar una cajita de video dentro de la sala
  addVideoUser = (stream: any) => {
    this.listUser.push(stream);
    const unique = new Set(this.listUser);
    this.listUser = [...unique];
  }

  //llamar a este usuario o es decir a la sala por medio del id
  sendCall = (idPeer, stream) => {
    const newUserCall = this.peerService.peer.call(idPeer, stream);
    if (!!newUserCall) {
      newUserCall.on('stream', (userStream) => {
        this.addVideoUser(userStream);
      })
    }
  }

}
