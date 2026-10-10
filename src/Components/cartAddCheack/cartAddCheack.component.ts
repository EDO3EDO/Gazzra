import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CartServiceService } from '../../services/CartService.service';
import { Router } from '@angular/router';
import { cartData } from '../../interface/cartData';

@Component({
  selector: 'app-cartAddCheack',
  templateUrl: './cartAddCheack.component.html',
  styleUrls: ['./cartAddCheack.component.css']
})
export class CartAddCheackComponent implements OnInit {

  constructor() { }

  public cart = inject(CartServiceService);
  private Router = inject(Router)

  cartData = signal<any>(null);
  showCart = signal<cartData[]>([]);


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





}
