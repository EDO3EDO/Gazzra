import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-FAQ',
  templateUrl: './FAQ.component.html',
  styleUrls: ['./FAQ.component.css']
})
export class FAQComponent implements OnInit {

  constructor() { }

  activeId: string | null = null;

  toggleAccordion(id: string) {
    this.activeId = this.activeId === id ? null : id;
  }

  ngOnInit() {
  }

}
