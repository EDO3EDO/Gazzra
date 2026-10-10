import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { CartServiceService } from './CartService.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore = inject(Firestore);
  private Cart = inject(CartServiceService);

  constructor() { }

  creatSerialNumber(): number {
    return Math.floor(10000 + Math.random() * 50000);
  }

  async CreatOrder(
    CustomerData: {
      Name: string;
      Phone: string;
      OtherPhone: string;
      Location: string;
      area: string;
      payment: string;
    },
    CartItem: any[],
    totalPrice: number,
    gustId: string
  ): Promise<string> {
    const serial = this.creatSerialNumber();

    try {
      const OrderRef = collection(this.firestore, 'Order');

      const OrderData = {
        customerData: CustomerData,
        cart: CartItem,
        gust: gustId,
        Total: totalPrice,
        SerialNumber: `#${serial}`,
        CreatDate: new Date(),
        status: 'panding',
        returnStatus: 'none'
      };

      const docRef = await addDoc(OrderRef, OrderData);
      await this.Cart.clearCart();

      return docRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getorder(orderId: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, 'Order', orderId);
      const Doc = await getDoc(docRef);
      if (Doc.exists()) {
        return {
          id: Doc.id,
          ...Doc.data()
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }




  async getAllOrders(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'Order'));

      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        let formattedDate = data.CreatDate;

        if (data.CreatDate && typeof data.CreatDate.toDate === 'function') {
          formattedDate = data.CreatDate.toDate();
        }

        return {
          id: docSnap.id,
          ...data,
          CreatDate: formattedDate
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verifyAndRequestReturn(phone: string, serialNumber: string, selectedItems: any[]): Promise<any> {
    try {
      const ordersRef = collection(this.firestore, 'Order');
      const formattedSerial = `#${serialNumber.replace('#', '').trim()}`;

      const q = query(ordersRef, where('SerialNumber', '==', formattedSerial));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('رقم الأوردر غير صحيح.');
      }

      let matchedOrder: any = null;
      let matchedDocId = '';

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const customerPhone = data.customerData?.Phone?.trim();

        if (customerPhone === phone.trim()) {
          matchedOrder = data;
          matchedDocId = docSnap.id;
        }
      });

      if (!matchedOrder) {
        throw new Error('رقم الهاتف غير مطابق لرقم الهاتف المسجل لهذا الأوردر.');
      }

      const orderDocRef = doc(this.firestore, 'Order', matchedDocId);

      // حفظ مصفوفة المنتجات المختارة بالإرجاع مع أسبابها وملاحظاتها
      await updateDoc(orderDocRef, {
        returnStatus: 'requested',
        returnItems: selectedItems,
        returnRequestedAt: new Date()
      });

      return {
        id: matchedDocId,
        ...matchedOrder,
        returnItems: selectedItems,
        returnStatus: 'requested'
      };

    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

async getReturnOrders(): Promise<any[]> {
  try {
    const ordersRef = collection(this.firestore, 'Order');

    const q = query(ordersRef, where('returnStatus', '==', 'requested'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Query returned no documents. Check if any order has returnStatus: 'requested'");
    }

    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data() as any;
      let formattedDate = data.CreatDate;
      let formattedReturnDate = data.returnRequestedAt;

      if (data.CreatDate && typeof data.CreatDate.toDate === 'function') {
        formattedDate = data.CreatDate.toDate();
      }
      if (data.returnRequestedAt && typeof data.returnRequestedAt.toDate === 'function') {
        formattedReturnDate = data.returnRequestedAt.toDate();
      }

      return {
        id: docSnap.id,
        ...data,
        CreatDate: formattedDate,
        returnRequestedAt: formattedReturnDate
      };
    });
  } catch (err) {
    console.error("Firestore Query Error:", err);
    throw err;
  }
}



}


