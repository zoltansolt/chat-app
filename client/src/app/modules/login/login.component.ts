import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { IpaddressService } from './ipaddress.service';

declare const InstallTrigger: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private socket: Socket, private ipService: IpaddressService, private cookieService: CookieService) { }
  loginForm: FormGroup;
  os: string;
  browser: string;
  cookieValue: string;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl()
    });
    this.os = this.detectOS();
    this.browser = this.detectBrowser();
    this.cookieValue = this.cookieService.get('username');
    if (this.cookieValue) {
      this.loginForm.controls['name'].disable();
      this.onSubmit();
    }
  }

  detectOS() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }

  detectBrowser() {
    // Opera 8.0+
    const isOpera = (!!window['opr'] && !!window['opr'].addons) || !!window['opera'] || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';


    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document['documentMode'];

    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 79
    const isChrome = !!window['chrome'] && (!!window['chrome'].webstore || !!window['chrome'].runtime);

    // Edge (based on chromium) detection
    const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || !isChrome && !isOpera && window['webkitAudioContext'] !== undefined;

    if (isEdgeChromium) return "Edge";
    if (isChrome) return "Chrome";
    if (isEdge) return "Edge";
    if (isSafari) return "Safari";
    if (isIE) return "IE";
    if (isFirefox) return "Firefox";
    if (isOpera) return "Opera";
  }

  onSubmit() {
    const name = this.cookieValue ? this.cookieValue : this.loginForm.value.name;
    this.cookieService.set('username', name);
    const userInfo = {
      name: name,
      os: this.os,
      browser: this.browser,
      ip: ''
    }
    this.ipService.detectIp().subscribe((res: any)=> {
      userInfo.ip = res.ip;
      this.socket.emit('user added', userInfo);
      this.loginForm.reset();
      this.router.navigate(['/', 'chat']);
    })
  }

}
