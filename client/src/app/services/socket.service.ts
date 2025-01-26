import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environment';
import { AppUser } from '../interfaces/app-user';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
    UID : string = '';
    socket!: Socket;
    isOrganizer: boolean = false;
    isRandomMode: boolean = false;
    user : AppUser = {
        _id: '',
        firstName: '',
        lastName: 'string',
        username: 'string',
        email: 'string',
        role: '',
        id_card: 'string',
        photo_id: 'string',
        age: 2,
        address: 'string',
        description: 'string',
        points: 2,
      };
    tasks !: [any];
    constructor() {
    }

    isSocketAlive() {
        return this.socket && this.socket.connected;
    }

    connect() {
        console.log("connecting, state of socket:", this.isSocketAlive());
        if (this.isSocketAlive() == undefined) this.socket = io(environment.webSocketUrl, { transports: ['websocket'], upgrade: false });
    }

    disconnect() {
        console.log("disconnecting, state of socket:", this.isSocketAlive());
        if (this.isSocketAlive() != undefined) this.socket.disconnect();
    }

    on<T>(event: string, action: (data: T) => void): void {
        this.socket.on(event, action);
    }

    send<T>(event: string, data?: T, callback?: (...args: never[]) => void): void {
        this.socket.emit(event, ...[data, callback].filter((x) => x));
    }

    initializeConnectEvents() {
        this.socket.on('connect_getuser', (userData :any) => {
            console.log(userData.data);
           this.user = userData.data;
           console.log(this.user);
        });
    }

    initializeFetchListEvents() {
        if (this.user.role == 'elder'){
            this.socket.on('gotListElder', (data:any) => {
                this.tasks = data;
            });
        } else if (this.user.role == 'volunteer') {
            this.socket.on('gotListVolunteer', (data:any) => {
                this.tasks = data;
            });
        }

    }
}

