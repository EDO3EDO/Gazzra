import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/Order.service';

@Component({
  selector: 'app-return-exchange',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './return-exchange.component.html',
  styleUrls: ['./return-exchange.component.css']
})
export class ReturnExchangeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private router = inject(Router);

  returnForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.returnForm = this.fb.group({
      contact_info: ['', [Validators.required]],
      order_number: ['', [Validators.required]],
      issue_description: ['']
    });
  }

  async onSubmit(): Promise<void> {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const phone = this.returnForm.value.contact_info.trim();
    const orderNumber = this.returnForm.value.order_number.trim();
    const issueDescription = this.returnForm.value.issue_description;

    try {
      // الدالة بترجع الأوردر ومعاه الـ Document ID الحقيقي في خاصية id
      const updatedOrder = await this.orderService.verifyAndRequestReturn(phone, orderNumber, issueDescription);

      localStorage.setItem('currentReturnOrder', JSON.stringify(updatedOrder));

      // التوجيه باستخدام الـ Document ID الحقيقي الخاص بفايربيز وليس الـ SerialNumber
      this.router.navigate([`/return-details/${updatedOrder.id}`]);

    } catch (error: any) {
      this.errorMessage = error.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
    } finally {
      this.isLoading = false;
    }
  }
}
