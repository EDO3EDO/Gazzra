import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartServiceService } from '../../services/CartService.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/Order.service';
import { ICustomerData } from '../../interface/LocationData';

@Component({
  selector: 'app-Location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Location.component.html',
  styleUrls: ['./Location.component.css']
})
export class LocationComponent implements OnInit {

  public cart = inject(CartServiceService);
  private Router = inject(Router);
  private order = inject(OrderService);

  cartData = signal<any>(null);
  showCart = signal<any[]>([]);
  IsLoding = signal<boolean>(false);

  // ربط الفورم بشكل سليم مع الـ Reactive Forms
  checkoutForm = new FormGroup({
    Name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    area: new FormControl('', [Validators.required]),
    Location: new FormControl('', [Validators.required, Validators.minLength(10)]),
    Phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    OtherPhone: new FormControl('', [Validators.pattern(/^01[0125][0-9]{8}$/)]),
    payment: new FormControl('Credit Card', [Validators.required])
  });

  totalPrice = computed(() => {
    return this.showCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  ngOnInit() {
    this.cart.getCart().subscribe({
      next: (res) => {
        if (res) {
          this.cartData.set(res);
          this.showCart.set(res.items || []);
        } else {
          this.showCart.set([]);
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  async SubmitIng() {
    this.checkoutForm.markAllAsTouched();

    if (this.showCart().length === 0) {
      alert('العربة فارغة!');
      return;
    }

    if (this.checkoutForm.invalid) {
      alert('من فضلك أكمل بيانات التوصيل الأساسية بشكل صحيح');
      return;
    }

    this.IsLoding.set(true);
    const gust = localStorage.getItem('visitor_id') || '';

    const formValues = this.checkoutForm.value;
    const customerDataValues: ICustomerData = {
      Location: formValues.Location || '',
      Name: formValues.Name || '',
      OtherPhone: formValues.OtherPhone || '',
      Phone: formValues.Phone || '',
      area: formValues.area || '',
      payment: formValues.payment || ''
    };

    try {
      const orderId = await this.order.CreatOrder(customerDataValues, this.showCart(), this.totalPrice(), gust);
      this.Router.navigate([(`ordercompelet/${orderId}`)]);
      this.IsLoding.set(false);
    } catch (err) {
      console.log('order Missing' + err);
      this.IsLoding.set(false);
    }
  }

  selectPayment(event: any) {
    const paymentValue = event.target.value;
    let selectedMethod = 'Credit Card';

    switch (paymentValue) {
      case 'credit_card':
        selectedMethod = 'Credit Card';
        break;
      case 'cod':
        selectedMethod = 'Cash on Delivery';
        break;
      case 'installments':
        selectedMethod = 'Installments';
        break;
      default:
        selectedMethod = 'Credit Card';
    }

    this.checkoutForm.patchValue({ payment: selectedMethod });
    this.checkoutForm.get('payment')?.markAsTouched();
  }

}
