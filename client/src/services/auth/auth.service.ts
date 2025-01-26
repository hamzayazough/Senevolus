import { Injectable } from '@angular/core';
import { UserType } from '../../enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userType : string = UserType.ELDER;


  constructor() { }
}
