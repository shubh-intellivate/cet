import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private routes: Router) { }

  ngOnInit() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('groups')
    localStorage.removeItem('username')
    localStorage.removeItem('access_bu_du')
    this.routes.navigate(['/login']);
  }

}
