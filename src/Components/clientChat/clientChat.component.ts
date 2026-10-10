import { Component, OnInit, OnDestroy, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientChatService } from '../../services/ClientChat.service';

@Component({
  selector: 'app-clientChat',
  templateUrl: './clientChat.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  styleUrls: ['./clientChat.component.css']
})
export class ClientChatComponent implements OnInit, OnDestroy {
  private chatService = inject(ClientChatService);

  // حالة الشات
  isOpen = signal<boolean>(false);

  // تحويل المتغيرات إلى Signals
  newMessageText = signal<string>('');
  selectedFile = signal<File | null>(null);
  filePreviewUrl = signal<string | null>(null);
  isUploading = signal<boolean>(false);

  messages = this.chatService.messages;

  // جلب أو توليد الـ visitor_id الموحد للزائر (بنفس فكرة سيرفيس الكارت)
  readonly userUid = this.getVisitorUid();
  userName = 'زائر متجر بلوم';

  private unsubscribeMessages?: () => void;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnInit() {
    this.unsubscribeMessages = this.chatService.listenToMessages(this.userUid);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // دالة جلب الـ visitor_id من ال localStorage أو إنشائه
  private getVisitorUid(): string {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'user_' + Date.now().toString(36) + Math.random().toString(36);
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  closeChat() {
    this.isOpen.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviewUrl.set(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreviewUrl.set(null);
      }
    }
  }

  cancelAttachment() {
    this.selectedFile.set(null);
    this.filePreviewUrl.set(null);
  }

  async sendMessage() {
    const text = this.newMessageText().trim();
    const file = this.selectedFile();
    if (!text && !file) return;

    this.isUploading.set(true);
    let mediaUrl: string | undefined = undefined;

    try {
      if (file) {
        mediaUrl = await this.chatService.uploadMedia(file);
      }

      await this.chatService.sendMessage(this.userUid, this.userName, text, mediaUrl);

      this.newMessageText.set('');
      this.cancelAttachment();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isUploading.set(false);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  ngOnDestroy() {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }
  }
}
