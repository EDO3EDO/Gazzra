import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-About-Us',
  templateUrl: './About-Us.component.html',
  styleUrls: ['./About-Us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
