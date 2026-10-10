import { inject, Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { addDoc, collection, doc, Firestore, getDocs, query, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { ProductMain } from '../interface/ProductMain';
import { where } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  ////inject
  private storage = inject(Storage);
  private firestore = inject(Firestore);



async uploadProductImage(file: File): Promise<string> {
    const filePath = `products/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);

    const snapshot = await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }



/////// add New product
async addProduct(
  productData: {
    title: string;
    price: number;
    category: string;
    Restoc: string; // أضفناها لتتطابق مع الـ Signal عندك
    variants: { color: string; size: string; stock: number; images: File[] }[]
  },
  coverFile: File,
  subFiles: File[]
) {
  try {
    const productsRef = collection(this.firestore, 'products');
    const newProductId = doc(productsRef).id;

    // 1. رفع صورة الغلاف الأساسية
    const coverPath = `products/cover_${Date.now()}_${coverFile.name}`;
    const coverRef = ref(this.storage, coverPath);
    const coverSnapshot = await uploadBytes(coverRef, coverFile);
    const coverImageUrl = await getDownloadURL(coverSnapshot.ref);

    // 2. رفع الصور الفرعية العامة
    const subImagesUrls: string[] = [];
    for (const file of subFiles) {
      const filePath = `products/sub_${Date.now()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      subImagesUrls.push(url);
    }

    // 3. رفع صور الـ Variants الخاصة بكل لون
    const processedVariants = [];
    for (const variant of productData.variants) {
      const variantImageUrls: string[] = [];

      if (variant.images && variant.images.length > 0) {
        for (const imgFile of variant.images) {
          const variantFilePath = `products/variants_${Date.now()}_${imgFile.name}`;
          const variantFileRef = ref(this.storage, variantFilePath);
          const variantSnapshot = await uploadBytes(variantFileRef, imgFile);
          const variantUrl = await getDownloadURL(variantSnapshot.ref);
          variantImageUrls.push(variantUrl);
        }
      }

      // إضافة الـ variant مع استبدال ملفات الـ File بالـ URLs التي تم رفعها
      processedVariants.push({
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
        images: variantImageUrls
      });
    }

    // 4. تجميع بيانات المنتج النهائية للحفظ في الـ Firestore
    const completeProduct = {
      ...productData,
      variants: processedVariants, // استبدلنا الـ variants القديمة بالمعالجة (التي تحتوي على روابط الصور)
      id: newProductId,
      coverImage: coverImageUrl,
      images: subImagesUrls,
      createdAt: new Date()
    };

    const customDocRef = doc(this.firestore, 'products', newProductId);
    await setDoc(customDocRef, completeProduct);

    console.log('تم إضافة المنتج برقم: ', newProductId);
    return newProductId;

  } catch (error) {
    console.error('حصل خطأ أثناء إضافة المنتج:', error);
    throw error;
  }
}



async getProducts(): Promise<ProductMain[]> {
  try {
    const productsRef = collection(this.firestore, 'products');

    const querySnapshot = await getDocs(productsRef);

    return querySnapshot.docs.map(doc => doc.data() as ProductMain);

  } catch (error) {
    console.error('حصل خطأ أثناء جلب المنتجات:', error);
    throw error;
  }
}


////// get Best Seler




async getProductsBestSeler(): Promise<ProductMain[]> {
  try {
    const productsRef = collection(this.firestore, 'products');
    const querySnapshot = await getDocs(productsRef);

    const allProducts = querySnapshot.docs.map(doc => {
      const data = doc.data() as ProductMain;
      return {
        ...data,
        id: doc.id
      };
    });

    return allProducts.filter(product =>
      product.Restoc &&
      product.Restoc.trim() !== "" &&
      product.Restoc !== null
    );

  } catch (error) {
    console.error('حصل خطأ أثناء جلب المنتجات:', error);
    throw error;
  }
}


}
