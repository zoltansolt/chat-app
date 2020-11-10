import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpaddressService {

  constructor(private http: HttpClient) { }

  detectIp() {
    return this.http.get('https://api.ipify.org?format=json');
  }
}
