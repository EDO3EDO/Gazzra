import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc, onSnapshot, serverTimestamp, increment } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';
import { ChatMessage } from '../interface/chat';

@Injectable({
  providedIn: 'root'
})
export class ClientChatService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  messages = signal<ChatMessage[]>([]);
  private unsubscribe?: () => void;

  constructor() { }

  listenToMessages(userUid: string) {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }

    const messagesRef = collection(this.firestore, `chats/${userUid}/messages`);

    this.unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        msgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });

      const sortedMsgs = msgs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeA - timeB;
      });

      this.messages.set(sortedMsgs);
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = undefined;
      }
    };
  }

  async sendMessage(userUid: string, userName: string | null, text: string, mediaUrl?: string) {
    if (!text.trim() && !mediaUrl) return;

    const chatDocRef = doc(this.firestore, `chats/${userUid}`);
    const messagesRef = collection(this.firestore, `chats/${userUid}/messages`);

    await setDoc(chatDocRef, {
      userUid,
      userName,
      lastMessage: text || 'ملف مرفق',
      updatedAt: serverTimestamp(),
      unreadByAdminCount: increment(1)
    }, { merge: true });

    await addDoc(messagesRef, {
      senderId: userUid,
      userName,
      text: text || '',
      mediaUrl: mediaUrl || null,
      createdAt: serverTimestamp()
    });
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

    const filePath = `chat_media/${Date.now()}_${fileToUpload.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadResult = await uploadBytes(storageRef, fileToUpload);
    return await getDownloadURL(uploadResult.ref);
  }
}
