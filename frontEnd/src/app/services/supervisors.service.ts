import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { BackendResponse } from '../structs/structs';
@Injectable({
  providedIn: 'root'
})
export class SupervisorsService {

  constructor(private http: HttpClient) { }

  /**
   *  Gets a list of supervisors
   * @returns 
   */
  GetSupervisors() {
    return this.http.get(environment.supervisorsURL);
  }

  /**
   *  Registers for notifications from supervisor!
   * @param fName 
   * @param lName 
   * @param supervisor 
   * @param email 
   * @param phone 
   * @returns 
   */
  Register(fName: string, lName: string, supervisor: string, email='', phone=''): Observable<BackendResponse> {
    let body: any = {
      firstName: fName,
      lastName: lName,
      supervisor: supervisor, 
    }
    if (email) {
      body['email'] = email
    }
    if (phone) {
      body['phone'] = phone
    }
    console.log(body);
    return this.http.post<BackendResponse>(environment.registerURL, body);
  }
}
