const API_BASE_URL = 'http://localhost:3002';

export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

export interface ChatResponse {
  chatId: string;
}

export interface MessageResponse {
  success: boolean;
  message: ChatMessage;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

class ChatService {
  private currentChatId: string | null = null;

  async startChat(user1: string, user2: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1, user2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to start chat');
      }

      const data: ChatResponse = await response.json();
      this.currentChatId = data.chatId;
      return data.chatId;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  }

  async sendMessage(sender: string, text: string): Promise<ChatMessage> {
    if (!this.currentChatId) {
      throw new Error('No active chat session');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${this.currentChatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, text }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data: MessageResponse = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(): Promise<ChatMessage[]> {
    if (!this.currentChatId) {
      throw new Error('No active chat session');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${this.currentChatId}/messages`);

      if (!response.ok) {
        throw new Error('Failed to get messages');
      }

      const data: MessagesResponse = await response.json();
      return data.messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  getCurrentChatId(): string | null {
    return this.currentChatId;
  }

  setCurrentChatId(chatId: string): void {
    this.currentChatId = chatId;
  }
}

export const chatService2 = new ChatService(); 