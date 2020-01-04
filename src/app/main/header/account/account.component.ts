import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  detailesOpen: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onToggleDetails() {
    this.detailesOpen = !this.detailesOpen;
  }

}
