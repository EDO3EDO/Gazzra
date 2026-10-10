import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopupComponent } from "../popup/popup.component";
import { ProductMain, ProductVariant } from '../../interface/ProductMain';
import { AdminService } from '../../services/admin.service';
import { ClientChatComponent } from "../clientChat/clientChat.component";

@Component({
  selector: 'app-mainPage',
  templateUrl: './mainPage.component.html',
  styleUrls: ['./mainPage.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PopupComponent, RouterLink, ClientChatComponent]
})
export class MainPageComponent implements OnInit {

  constructor(private Router: Router) { }
  private admin = inject(AdminService);

  Showproduct = signal<ProductMain[]>([]);
  Bestproduct = signal<ProductMain[]>([]);

  ngOnInit() {
    this.loadAllData();
    this.getBestSeler();
  }

  // Best Seller
  async getBestSeler() {
    try {
      const data = await this.admin.getProductsBestSeler();
      this.Bestproduct.set(data);
      console.log('Best Done');
    } catch (err) {
      console.log(err);
    }
  }

  // Products
  async loadAllData() {
    try {
      const data = await this.admin.getProducts();
      this.Showproduct.set(data);
      console.log('get Is good');
    } catch (err) {
      console.log(err);
    }
  }

  // دالة تغيير صورة المنتج بناءً على اللون المختار وتحديث الـ Signal
  selectVariantColor(product: ProductMain, variant: ProductVariant, event?: Event) {
    if (event) {
      event.stopPropagation(); // منع الانتقال لصفحة التفاصيل
    }

    // التأكد من أن الـ variant يحتوي على صور في المصفوفة ونأخذ الصورة الأولى
    if (variant.images && variant.images.length > 0) {
      const variantImage = variant.images[0];

      // 1. تحديث المنتج في قائمة الـ Best Products
      this.Bestproduct.update(products =>
        products.map(p => p.id === product.id ? { ...p, coverImage: variantImage } : p)
      );

      // 2. تحديث المنتج في قائمة الـ Show Products
      this.Showproduct.update(products =>
        products.map(p => p.id === product.id ? { ...p, coverImage: variantImage } : p)
      );
    }
  }

showAllBest: boolean = false;

  toggleViewAllBest() {
    this.showAllBest = !this.showAllBest;
  }

get displayedBestProducts(): ProductMain[] {
    const products = this.Bestproduct();
    if (!products) return [];
    return this.showAllBest ? products : products.slice(0, 4);
  }



  orderSelected = signal([
    { orderUid: 1, select: false, icon: 'electrical_services' },
    { orderUid: 2, select: false, icon: 'plumbing' },
    { orderUid: 3, select: false, icon: 'ac_unit' },
    { orderUid: 4, select: false, icon: 'carpenter' },
    { orderUid: 5, select: false, icon: 'cleaning_services' },
    { orderUid: 6, select: false, icon: 'pest_control' },
  ]);

  check(id: number) {
    this.orderSelected.update(up => up.map(order => {
      const end = !order.select;
      if (order.orderUid === id) {
        return { ...order, select: end };
      } else {
        return { ...order, select: false };
      }
    }));
  }

  searchText: string = '';
  secretWord: string = 'siuuuu';
  isButtonVisible: boolean = false;

  checkSearchInput() {
    const trimmedText = this.searchText.trim().toLowerCase();
    if (trimmedText === this.secretWord.toLowerCase()) {
      this.isButtonVisible = true;
    } else {
      this.isButtonVisible = false;
    }
  }

  adminPage() {
    const suii = new Audio('ronaldo-siuuuu.mp3');
    this.Router.navigate(['admin']);
    suii.play();
  }

  go() {
    this.Router.navigate(['go']);
  }

  // Popup Custom State
  isQuickViewOpen = false;
  isCartOpen = false;
  selectedProduct = signal<ProductMain | null>(null);

  openQuickView(product: ProductMain, event: Event) {
    event.stopPropagation();

    // إعادة تعيين مؤقتة للبوب أب لتفريغ المنتج القديم وجعل الانتقال سلس ومضبوط للمنتج الجديد
    this.isQuickViewOpen = false;
    this.selectedProduct.set(null);

    setTimeout(() => {
      this.selectedProduct.set(product);
      this.isQuickViewOpen = true;
    }, 50);
  }

  closeQuickView() {
    this.isQuickViewOpen = false;
    this.selectedProduct.set(null);
  }

  cartPage() {
    this.Router.navigate(['/cart']);
  }

  too: boolean = false;

  toggle() {
    this.too = !this.too;
  }

  //// Footer

  FAQ() {
    this.Router.navigate(['/faq']);
  }

  US() {
    this.Router.navigate(['/about-us']);
  }

  contact() {
    this.Router.navigate(['/contact']);
  }

  termes() {
    this.Router.navigate(['/termes']);
  }

  return() {
    this.Router.navigate(['/return']);
  }
}
