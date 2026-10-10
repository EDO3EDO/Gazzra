import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/Order.service';

@Component({
  selector: 'app-Finish',
  templateUrl: './Finish.component.html',
  styleUrls: ['./Finish.component.css']
})
export class FinishComponent implements OnInit {

  constructor() { }
  private Activat = inject(ActivatedRoute)
  private order = inject(OrderService)


  showOrder = signal<any>(null)


  async ngOnInit() {
    const orderId =  this.Activat.snapshot.paramMap.get('id')

    if(orderId){
      const Data = await this.order.getorder(orderId)
      this.showOrder.set(Data)
      console.log(Data)
    }else{
      console.log(null)
    }

  }

}
