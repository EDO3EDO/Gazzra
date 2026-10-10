export interface AdminChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string;
  createdAt: any;
  isAdminResponse?: boolean;
}

export interface UserChatSummary {
  userUid: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  lastMessage: string;
  updatedAt: any;
  unreadByAdminCount: number;
  status?: 'active' | 'closed' | 'pending';
}

export interface SystemAdmin {
  adminId: string;
  adminName: string;
  activeChatUid?: string;
  allChats: UserChatSummary[];
  currentChatMessages: AdminChatMessage[];
}



export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string;
  createdAt: any;
}

export interface ChatSession {
  userUid: string;
  userName: string;
  lastMessage: string;
  updatedAt: any;
  unreadByAdminCount: number;
}

export interface SystemConfig {
  chatRoomId: string;
  autoScroll: boolean;
  soundEnabled: boolean;
}

export interface System {
  currentUser: {
    uid: string;
    displayName: string;
  };
  config: SystemConfig;
  activeChat?: ChatSession;
}
