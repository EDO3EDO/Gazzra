import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CartServiceService } from '../../services/CartService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartPoPup',
  templateUrl: './cartPoPup.component.html',
  styleUrls: ['./cartPoPup.component.css']
})
export class CartPoPupComponent implements OnInit {

  public cart = inject(CartServiceService);
  private Router = inject(Router)

  cartData = signal<any>(null);
  showCart = signal<any[]>([]);


  totalPrice = computed(() => {
    return this.showCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  ngOnInit() {
    this.cart.getCart().subscribe({
      next: (res) => {
        if (res) {
          this.cartData.set(res);
          this.showCart.set(res.items || []);
          console.log('Cart Data Loaded:', res);
        } else {
          this.showCart.set([]);
        }
      },
      error: (err) => { console.log(err); }
    });
  }







///////////// INCREMENT && DECREMENT && ADD && REMOVE


async removeItem(productId: string) {
    await this.cart.removeFromCart(productId);
  }



backToShop(){
  this.Router.navigate([('/main')])
}


locationPage(){
  const gust = localStorage.getItem('visitor_id') || '' ;
  this.Router.navigate([(`cheackout/${gust}`)])
}




}
