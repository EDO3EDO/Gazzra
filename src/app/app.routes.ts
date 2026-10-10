import { Routes } from '@angular/router';
import { GoComponent } from '../Components/go/go.component';
import { AdminComponent } from '../Components/admin/admin.component';
import { MainPageComponent } from '../Components/mainPage/mainPage.component';
import { ProductDetilsComponent } from '../Components/productDetils/productDetils.component';
import { CartPoPupComponent } from '../Components/cartPoPup/cartPoPup.component';
import { FAQComponent } from '../Components/FAQ/FAQ.component';
import { AboutUsComponent } from '../Components/About-Us/About-Us.component';
import { LocationComponent } from '../Components/Location/Location.component';
import { FinishComponent } from '../Components/Finish/Finish.component';
import { DashBordComponent } from '../Components/DashBord/DashBord.component';
import { ProductCreatComponent } from '../Components/ProductCreat/ProductCreat.component';
import { CustomerDataComponent } from '../Components/CustomerData/CustomerData.component';
import { ContactComponent } from '../Components/Contact/Contact.component';
import { TermesComponent } from '../Components/termes/termes.component';
import { ReturnExchangeComponent } from '../Components/return-exchange/return-exchange.component';
import { CartAddCheackComponent } from '../Components/cartAddCheack/cartAddCheack.component';
import { ReturnStep2Component } from '../Components/returnStep2/returnStep2.component';
import { RetutnDashAdminComponent } from '../Components/retutnDashAdmin/retutnDashAdmin.component';
import { AdminChatComponent } from '../Components/AdminChat/AdminChat.component';

export const routes: Routes = [


  { path: '', component: MainPageComponent },
  // { path: 'main', component: MainPageComponent },


  {path:'go' , component:GoComponent},

  {path:'cart' , component:CartPoPupComponent},


  {path:'cheackout/:id' , component:LocationComponent},



  {path:'ordercompelet/:id' , component:FinishComponent},

  {path:'detils/:id' , component:ProductDetilsComponent},
  {path:'cartadd' , component:CartAddCheackComponent},


  ////// footer

  {path:'faq' , component:FAQComponent},
  {path:'about-us' , component:AboutUsComponent},
  {path:'contact' , component:ContactComponent},
  {path:'termes' , component:TermesComponent},
  {path:'return' , component:ReturnExchangeComponent},
  {path:'return-details/:id' , component:ReturnStep2Component},




  ////// admin page

  {
    path:'admin',
    loadComponent: () => import('../Components/admin/admin.component').then(m => m.AdminComponent) ,
    children:[
      {path:'dash' , component:DashBordComponent},
      {path:'product' , component:ProductCreatComponent},
      {path:'custom' , component:CustomerDataComponent},
      {path:'return' , component:RetutnDashAdminComponent},
      {path:'adminchate' , component:AdminChatComponent},
    ]
  }



];
