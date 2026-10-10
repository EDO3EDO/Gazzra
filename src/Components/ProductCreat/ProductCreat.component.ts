import { Component, signal, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ProductCreat',
  templateUrl: './ProductCreat.component.html',
  styleUrls: ['./ProductCreat.component.css']
})
export class ProductCreatComponent implements OnInit {


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  private adminService = inject(AdminService);

  // تحديث الـ signal ليدعم الـ variants والصور الخاصة بكل لون
  product = signal({
    title: '',
    price: 0,
    category: '',
    Restoc: '',
    variants: [
      { color: 'Dusty Blue', size: 'S', stock: 0, images: [] as File[] } // صف افتراضي مبدئي
    ]
  });

  newTitle(event: Event) {
    const tit = (event.target as HTMLInputElement).value;
    this.product.update(prev => ({ ...prev, title: tit }));
  }

  newPrice(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.product.update(prev => ({ ...prev, price: Number(val) }));
  }

  newCategory(event: Event) {
    const cat = (event.target as HTMLSelectElement).value;
    this.product.update(prev => ({ ...prev, category: cat }));
  }

  newReStocke(event: Event) {
    const cat = (event.target as HTMLSelectElement).value;
    this.product.update(prev => ({ ...prev, Restoc: cat }));
  }

  // دوال إدارة الـ Variants (الألوان، المقاسات، والكميات)
  addVariantRow() {
    this.product.update(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', size: 'S', stock: 0, images: [] }]
    }));
  }

  removeVariantRow(index: number) {
    this.product.update(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }

  updateVariant(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;

    this.product.update(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === 'stock' ? Number(value) : value
      };
      return { ...prev, variants: updatedVariants };
    });
  }

  // دوال إدارة صور الألوان الخاصة بكل Variant
  onVariantImagesSelected(index: number, event: any) {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files) as File[];
      this.product.update(prev => {
        const updatedVariants = [...prev.variants];
        updatedVariants[index] = {
          ...updatedVariants[index],
          images: [...updatedVariants[index].images, ...fileArray]
        };
        return { ...prev, variants: updatedVariants };
      });
    }
  }

  removeVariantImage(variantIndex: number, imageIndex: number) {
    this.product.update(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
      return { ...prev, variants: updatedVariants };
    });
  }

  selectedFiles: File[] = [];

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  async onSubmit() {
    if (this.selectedFiles.length === 0) {
      alert('من فضلك اختر صورة عامة واحدة على الأقل للمنتج!');
      return;
    }

    try {
      const coverImage = this.selectedFiles[0];
      const subImages = this.selectedFiles.slice(1);

      await this.adminService.addProduct(this.product(), coverImage, subImages);
      alert('تم إضافة المنتج وتحديد تفاصيله بنجاح! 🚀');
      this.selectedFiles = [];
    } catch (error) {
      alert('فشل حفظ المنتج، حاول مرة أخرى.');
    }
  }
}
