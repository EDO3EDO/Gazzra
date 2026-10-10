import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private firestore = inject(Firestore);
  private guestId: string;

  constructor() {
    this.guestId = localStorage.getItem('visitor_id') || this.generateNewId();
    localStorage.setItem('visitor_id', this.guestId);
  }

  private generateNewId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36);
  }

  getCart(): Observable<any> {
    return new Observable(observer => {
      const cartRef = doc(this.firestore, `carts/${this.guestId}`);

      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const items = data['items'] || [];

          const totalQuantity = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);
          const totalPrice = items.reduce((sum: number, item: any) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

          observer.next({
            items,
            totalQuantity,
            totalPrice
          });
        } else {
          observer.next({ items: [], totalQuantity: 0, totalPrice: 0 });
        }
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  async addToCart(product: any) {
    const cartRef = doc(this.firestore, `carts/${this.guestId}`);

    // جلب البيانات الحالية بـ aysnc آمن
    const cartSnapshot = await getDoc(cartRef);
    let items = cartSnapshot.exists() ? [...(cartSnapshot.data()['items'] || [])] : [];

    const index = items.findIndex((i: any) => i.id === product.id);
    const quantityToAdd = Number(product.quantity) || 1;

    if (index > -1) {
      items[index] = {
        ...items[index],
        quantity: Number(items[index].quantity || 1) + quantityToAdd,
        coverImage: product.coverImage
      };
    } else {
      items.push({
        ...product,
        quantity: quantityToAdd
      });
    }

    // الحفظ في فايربيس
    await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true });
  }

  async removeFromCart(productId: string) {
    const cartRef = doc(this.firestore, `carts/${this.guestId}`);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      let items = cartSnapshot.data()['items'] || [];
      items = items.filter((i: any) => i.id !== productId);
      await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true });
    }
  }

  async updateQuantity(productId: string, delta: number) {
    const cartRef = doc(this.firestore, `carts/${this.guestId}`);
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      let items = cartSnapshot.data()['items'] || [];
      const index = items.findIndex((i: any) => i.id === productId);

      if (index > -1) {
        items[index].quantity += delta;
        if (items[index].quantity <= 0) {
          items = items.filter((i: any) => i.id !== productId);
        }
        await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true });
      }
    }
  }

  async clearCart() {
    const cartRef = doc(this.firestore, `carts/${this.guestId}`);
    await deleteDoc(cartRef);
  }
}
