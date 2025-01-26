import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
    UID : string = '';
    socket!: Socket;
    isOrganizer: boolean = false;
    isRandomMode: boolean = false;

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

    initializeEvents() {

    }
}

