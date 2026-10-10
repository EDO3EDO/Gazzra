import { Component, signal, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive]
})
export class AdminComponent {

}
