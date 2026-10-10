import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/Order.service';

@Component({
  selector: 'app-returnStep2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './returnStep2.component.html',
  styleUrls: ['./returnStep2.component.css']
})
export class ReturnStep2Component implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);

  public orderId = signal<string>('');
  public orderData = signal<any>(null);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  public returnForm!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.orderId.set(id);

    if (!id) {
      this.errorMessage.set('لم يتم العثور على معرف الأوردر.');
      this.isLoading.set(false);
      return;
    }

    this.initForm();
    this.fetchOrderDetails(id);
  }

  private initForm(): void {
    this.returnForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  public get items(): FormArray {
    return this.returnForm.get('items') as FormArray;
  }

  private async fetchOrderDetails(id: string): Promise<void> {
    try {
      const data = await this.orderService.getorder(id);

      if (!data) {
        this.errorMessage.set('هذا الأوردر غير موجود.');
        this.isLoading.set(false);
        return;
      }

      if (data.CreatDate && typeof data.CreatDate.toDate === 'function') {
        data.CreatDate = data.CreatDate.toDate();
      }

      this.orderData.set(data);

      const cartItems = data.cart || data.items || [];
      if (cartItems.length === 0) {
        this.errorMessage.set('لا توجد منتجات في هذا الطلب.');
        this.isLoading.set(false);
        return;
      }

      const formArray = this.items;

      cartItems.forEach((item: any, index: number) => {
        const isFirst = index === 0;
        const itemGroup = this.fb.group({
          selected: [isFirst],
          name: [item.name || item.title || 'منتج'],
          price: [item.price || 0],
          quantity: [item.quantity || 1],
          image: [item.image || item.coverImage || item.img || ''],
          sku: [item.sku || item.id || 'SKU-000'],
          color: [item.color || 'افتراضي'],
          size: [item.size || 'وحيد'],
          reason: [isFirst ? 'size-tight' : '', Validators.required],
          comments: ['']
        });

        // مراقبة التغييرات ديناميكياً للتحكم في الـ Validators وإظهار/إخفاء الحقول
        itemGroup.get('selected')?.valueChanges.subscribe((isSelected) => {
          const reasonControl = itemGroup.get('reason');
          if (isSelected) {
            reasonControl?.setValidators(Validators.required);
          } else {
            reasonControl?.clearValidators();
            reasonControl?.setValue('');
          }
          reasonControl?.updateValueAndValidity();
        });

        formArray.push(itemGroup);
      });

      this.isLoading.set(false);
    } catch (err) {
      console.error('Error in fetchOrderDetails:', err);
      this.errorMessage.set('حدث خطأ أثناء جلب تفاصيل الأوردر.');
      this.isLoading.set(false);
    }
  }

  // دالة مساعدة لتفعيل العنصر عند الضغط على زر "+ Select for return"
  public selectItem(index: number, state: boolean): void {
    this.items.at(index).get('selected')?.setValue(state);
  }

  public goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public async onSubmit(): Promise<void> {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    const formValues = this.returnForm.value.items;
    const selectedItems = formValues.filter((item: any) => item.selected);

    if (selectedItems.length === 0) {
      alert('يرجى اختيار منتج واحد على الأقل للإرجاع.');
      return;
    }

    try {
      this.isLoading.set(true);
      const currentOrder = this.orderData();
      await this.orderService.verifyAndRequestReturn(
        currentOrder.customerData?.Phone || '',
        currentOrder.SerialNumber || '',
        selectedItems
      );
      this.router.navigate(['/return-success']);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إرسال طلب الإرجاع.');
      this.isLoading.set(false);
    }
  }
}
