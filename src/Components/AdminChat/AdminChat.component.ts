import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminChatService } from '../../services/AdminChat.service';

@Component({
  selector: 'app-AdminChat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './AdminChat.component.html',
  styleUrls: ['./AdminChat.component.css']
})
export class AdminChatComponent implements OnInit, OnDestroy {
  chatService = inject(AdminChatService);

  newMessageText = '';
  private cleanupChats?: () => void;
  private cleanupMessages?: () => void;

  ngOnInit() {
    this.cleanupChats = this.chatService.listenToAllChats();
  }

  selectUser(userUid: string) {
    this.cleanupMessages = this.chatService.listenToUserMessages(userUid);
    this.chatService.markAsRead(userUid);
  }

  async sendMessage() {
    if (!this.newMessageText.trim()) return;
    const textToSend = this.newMessageText;
    this.newMessageText = '';
    await this.chatService.sendAdminMessage('admin', 'الإدارة', textToSend);
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    try {
      const mediaUrl = await this.chatService.uploadMedia(file);
      await this.chatService.sendAdminMessage('admin', 'الإدارة', 'صورة مرفقة', mediaUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  useTemplate(text: string) {
    this.newMessageText = text;
  }

  ngOnDestroy() {
    if (this.cleanupChats) this.cleanupChats();
    if (this.cleanupMessages) this.cleanupMessages();
  }
}
