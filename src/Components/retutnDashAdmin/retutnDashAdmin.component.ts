import { Component, OnInit, inject, signal } from '@angular/core';
import { OrderService } from '../../services/Order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-retutnDashAdmin',
  templateUrl: './retutnDashAdmin.component.html',
  imports: [DatePipe],
  styleUrls: ['./retutnDashAdmin.component.css']
})
export class RetutnDashAdminComponent implements OnInit {
  private orderService = inject(OrderService);

  returnOrders = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // سجنال لتخزين الأوردر المحدد لعرضه داخل المودال
  selectedOrderForModal = signal<any | null>(null);

  ngOnInit() {
    this.loadReturnOrders();
  }

  async loadReturnOrders() {
    try {
      this.isLoading.set(true);
      const orders = await this.orderService.getReturnOrders();
      this.returnOrders.set(orders);
    } catch (error) {
      console.error('Error fetching return orders:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // دالة لتحديد الأوردر وإرساله للمودال
  openOrderDetails(order: any) {
    this.selectedOrderForModal.set(order);
  }

  async updateReturnStatus(orderId: string, status: string) {
  }
}
