import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClosed = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onCloseSidenav() {
    this.sidenavClosed.emit();
  }

}
