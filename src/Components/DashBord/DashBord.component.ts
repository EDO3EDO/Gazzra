import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/Order.service';

@Component({
  selector: 'app-DashBord',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './DashBord.component.html',
  styleUrls: ['./DashBord.component.css']
})
export class DashBordComponent implements OnInit {

  private orderService = inject(OrderService);

  orders = signal<any[]>([]);
  selectedOrders = signal<any[]>([]);
  selectedOrdersForPrint = signal<any[]>([]);

  // Computed signal لمعرفة عدد الأوردرات المحددة فوراً
  selectedCount = computed(() => this.selectedOrders().length);

  // Computed signal للتحقق هل كل العناصر محددة أم لا
  isAllSelected = computed(() => {
    const currentOrders = this.orders();
    const currentSelected = this.selectedOrders();
    return currentOrders.length > 0 && currentSelected.length === currentOrders.length;
  });

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.orderService.getAllOrders();
      this.orders.set(data || []);
      console.log('Orders loaded successfully:', this.orders());
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders.set([]);
    }
  }

  // التحقق مما إذا كان الأوردر محدد
  isSelected(order: any): boolean {
    return this.selectedOrders().some(o => o.id === order.id);
  }

  // تحديد أو إلغاء تحديد أوردر فردي
  toggleOrderSelection(order: any, event: any): void {
    const isChecked = event.target.checked;
    const currentSelected = this.selectedOrders();

    if (isChecked) {
      if (!this.isSelected(order)) {
        this.selectedOrders.set([...currentSelected, order]);
      }
    } else {
      this.selectedOrders.set(currentSelected.filter(o => o.id !== order.id));
    }
  }

  // تحديد الكل أو إلغاؤه دفعة واحدة
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedOrders.set([...this.orders()]);
    } else {
      this.selectedOrders.set([]);
    }
  }

  // طباعة أوردر فردي
  printSingleOrder(order: any): void {
    this.selectedOrdersForPrint.set([order]);
    setTimeout(() => {
      window.print();
    }, 150);
  }

  // طباعة جميع الأوردرات المحددة مرة واحدة
  printSelectedOrders(): void {
    if (this.selectedOrders().length === 0) return;

    this.selectedOrdersForPrint.set([...this.selectedOrders()]);

    setTimeout(() => {
      window.print();
    }, 200);
  }

}
