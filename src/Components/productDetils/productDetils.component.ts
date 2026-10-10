import { Component, computed, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ProductMain, ProductVariant } from '../../interface/ProductMain';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartServiceService } from '../../services/CartService.service';

@Component({
  selector: 'app-productDetils',
  templateUrl: './productDetils.component.html',
  imports: [RouterLink],
  styleUrls: ['./productDetils.component.css']
})
export class ProductDetilsComponent implements OnInit, OnDestroy {

  constructor() { }
  private admin = inject(AdminService);
  private Activate = inject(ActivatedRoute);
  private cart = inject(CartServiceService)
  private Router = inject(Router)

  Showproduct = signal<ProductMain[]>([]);
  showDetils = signal<ProductMain[]>([]);

  @Input() product: ProductMain | null = null;
  @Output() addedToCart = new EventEmitter<void>();

  // متغيرات الـ Variants والـ Selection
  selectedVariant = signal<ProductVariant | null>(null);
  selectedSize = signal<ProductVariant | null>(null);
  selectedImageIndex = signal<number>(0);
  autoplayTimer: any;

  ngOnInit() {
    this.getDetils();
    this.loadAllData();
  }

  ngOnDestroy() {
    if (this.autoplayTimer) this.autoplayTimer.unsubscribe();
  }

  async getDetils() {
    try {
      const CheackId = this.Activate.snapshot.paramMap.get('id');
      const data = await this.admin.getProducts();

      if (CheackId) {
        const DataId = data.filter(v => v.id === CheackId);
        this.showDetils.set(DataId);

        // أول ما المنتج يحمل، نحدد أول لون ومقاس افتراضياً
        if (DataId.length > 0 && DataId[0].variants && DataId[0].variants.length > 0) {
          const firstVariant = DataId[0].variants[0];
          this.selectedVariant.set(firstVariant);
          this.selectedSize.set(firstVariant);
        }
      } else {
        this.showDetils.set(data);
      }
      console.log('get Detil');
    } catch (err) {
      console.log(err);
    }
  }

  currentDet = computed(() => {
    const list = this.showDetils();
    return list.length > 0 ? list[0] : null;
  });

  // استخراج المقاسات المتاحة بناءً على اللون المختار حالياً
  availableSizes = computed(() => {
    const product = this.currentDet();
    const currentVar = this.selectedVariant();
    if (!product || !product.variants || !currentVar) return [];

    // جلب كل المقاسات التي تخص نفس اللون المختار
    return product.variants.filter(v => v.color === currentVar.color);
  });

  // دمج الصور بناءً على اللون المختار أو صور المنتج الأساسية
  allImges = computed(() => {
    const pro = this.currentDet();
    const currentVar = this.selectedVariant();
    if (!pro) return [];

    // لو اللون المختار لديه صور خاصة به، نعرضها، وإلا نعرض صور المنتج الأساسية
    if (currentVar && currentVar.images && currentVar.images.length > 0) {
      return currentVar.images;
    }
    return [pro.coverImage, ...(pro.images || [])];
  });

  // عند اختيار لون جديد من الـ Buttons
  selectColorVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
    this.selectedImageIndex.set(0); // رجع الـ Index لأول صورة خاصة باللون الجديد

    // اختيار أول مقاس متاح لهذا اللون تلقائياً
    const product = this.currentDet();
    if (product && product.variants) {
      const matchSize = product.variants.find(v => v.color === variant.color);
      if (matchSize) {
        this.selectedSize.set(matchSize);
      }
    }
  }

  // عند اختيار مقاس معين
  selectSize(variant: ProductVariant) {
    this.selectedSize.set(variant);
  }

  changeImge(index: number) {
    this.selectedImageIndex.set(index);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      this.autoplayTimer.unsubscribe();
      this.autoplayTimer = undefined;
    }
  }

  async loadAllData() {
    try {
      const data = await this.admin.getProducts();
      this.Showproduct.set(data);
      console.log('get Is good');
    } catch (err) {
      console.log(err);
    }
  }

  addToCart(item: any) {
    try {
      this.cart.addToCart(item);
      console.log('Added to bag successfully!');
      this.addedToCart.emit();
      this.Router.navigate([('/cart')])
    } catch (err) {
      console.log(err);
    }
  }







}
