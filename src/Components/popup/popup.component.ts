import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter, inject, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CartServiceService } from '../../services/CartService.service';
import { ProductMain } from '../../interface/ProductMain';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit, OnDestroy {
  private cart = inject(CartServiceService);
  private cartSub!: Subscription;
  private Router = inject(Router)

  @Input() isOpen = false;
  @Input() product: ProductMain | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() addedToCart = new EventEmitter<void>();

  currentMode: 'drawer' | 'sticky' = 'drawer';
  productQuantity: number = 1;

  cartTotalQuantity: number = 0;
  cartTotalPrice: number = 0;
  isProcessing: boolean = false;

  ngOnInit() {
    this.cartSub = this.cart.getCart().subscribe((cartData) => {
      if (cartData) {
        this.cartTotalQuantity = cartData.totalQuantity || 0;
        this.cartTotalPrice = cartData.totalPrice || 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.productQuantity = 1;
      this.isProcessing = false;
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.currentMode = 'drawer';
      this.isProcessing = false;
    }
  }

  increaseQty() {
    this.productQuantity++;
  }

  decreaseQty() {
    if (this.productQuantity > 1) {
      this.productQuantity--;
    }
  }

  closeModal() {
    this.currentMode = 'drawer';
    this.close.emit();
  }

  async addToCart(item: any) {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      const finalQty = Number(this.productQuantity) || 1;
      const itemWithQty = { ...item, quantity: finalQty };

      // تحويل الواجهة للشريط الثابت فوراً لإعطاء استجابة سريعة للعميل
      this.currentMode = 'sticky';
      this.addedToCart.emit();

      // تنفيذ الحفظ في الخلفية
      await this.cart.addToCart(itemWithQty);
      console.log('Added to bag successfully!');

    } catch (err) {
      console.log('Error adding to cart:', err);
      // لو حصل خطأ نرجع الـ Drawer تاني عشان يقدر يحاول تاني
      this.currentMode = 'drawer';
    } finally {
      this.isProcessing = false;
    }
  }


  navCart(){
    this.Router.navigate([('/cart')])
  }
}
