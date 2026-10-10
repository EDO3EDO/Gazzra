import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, doc, query, orderBy, serverTimestamp, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';
import { AdminChatMessage, UserChatSummary } from '../interface/chat';

@Injectable({ providedIn: 'root' })
export class AdminChatService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  chatsList = signal<UserChatSummary[]>([]);
  activeMessages = signal<AdminChatMessage[]>([]);
  selectedUserUid = signal<string | null>(null);

  private unsubscribeChats?: () => void;
  private unsubscribeMessages?: () => void;

  constructor() {}

  listenToAllChats() {
    if (this.unsubscribeChats) {
      this.unsubscribeChats();
      this.unsubscribeChats = undefined;
    }

    const chatsRef = collection(this.firestore, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    this.unsubscribeChats = onSnapshot(q, (snapshot) => {
      const chats: UserChatSummary[] = [];
      snapshot.forEach((docSnap) => {
        chats.push({ userUid: docSnap.id, ...docSnap.data() } as UserChatSummary);
      });
      this.chatsList.set(chats);
    }, (err) => {
      console.error('Error fetching chats:', err);
    });

    return () => {
      if (this.unsubscribeChats) {
        this.unsubscribeChats();
        this.unsubscribeChats = undefined;
      }
    };
  }

  // 2. استماع لرسائل مستخدم معين عند الضغط عليه
  listenToUserMessages(userUid: string) {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
      this.unsubscribeMessages = undefined;
    }

    this.selectedUserUid.set(userUid);
    const messagesRef = collection(this.firestore, `chats/${userUid}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    this.unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs: AdminChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        msgs.push({ id: docSnap.id, ...docSnap.data() } as AdminChatMessage);
      });
      this.activeMessages.set(msgs);
    }, (err) => {
      console.error('Error fetching messages:', err);
    });

    return () => {
      if (this.unsubscribeMessages) {
        this.unsubscribeMessages();
        this.unsubscribeMessages = undefined;
      }
    };
  }

  // 3. إرسال رد من الأدمن (مع دعم عدم وجود لوجين عن طريق إرسال بيانات ثابتة أو افتراضية)
  async sendAdminMessage(adminId: string = 'admin_default', adminName: string = 'الإدارة', text: string, mediaUrl?: string) {
    const userUid = this.selectedUserUid();
    if (!userUid || (!text?.trim() && !mediaUrl)) return;

    const chatDocRef = doc(this.firestore, `chats/${userUid}`);
    const messagesRef = collection(this.firestore, `chats/${userUid}/messages`);

    // تحديث الشات الرئيسي بآخر رسالة وتصفير عدد الرسائل غير المقروءة للأدمن
    await updateDoc(chatDocRef, {
      lastMessage: text?.trim() ? text : 'ملف مرفق',
      updatedAt: serverTimestamp(),
      unreadByAdminCount: 0
    });

    // إضافة الرسالة في الفرع الخاص بالرسائل
    await addDoc(messagesRef, {
      senderId: adminId,
      senderName: adminName,
      text: text || '',
      mediaUrl: mediaUrl || null,
      createdAt: serverTimestamp(),
      isAdminResponse: true
    });
  }

  async markAsRead(userUid: string) {
    const chatDocRef = doc(this.firestore, `chats/${userUid}`);
    await updateDoc(chatDocRef, { unreadByAdminCount: 0 });
  }

  async uploadMedia(file: File): Promise<string> {
    let fileToUpload = file;

    if (file.type.startsWith('image/')) {
      try {
        fileToUpload = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true });
      } catch (error) {
        console.warn('Compression error:', error);
      }
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = `chat_media/admin_${Date.now()}_${cleanFileName}`;
    const storageRef = ref(this.storage, filePath);
    const uploadResult = await uploadBytes(storageRef, fileToUpload);
    return await getDownloadURL(uploadResult.ref);
  }
}
