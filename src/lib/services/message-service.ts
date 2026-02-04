import { Message } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export interface CreateMessageData {
  receiverId: string;
  content: string;
  appointmentId?: string;
  category?: "general" | "appointment" | "urgent";
}

export interface MessageThread {
  otherUserId: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export class MessageService {
  static async getMessages(): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  }

  static async getMessagesByUserId(userId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user messages");
    return response.json();
  }

  static async getMessagesByAppointmentId(appointmentId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/appointment/${appointmentId}`);
    if (!response.ok) throw new Error("Failed to fetch appointment messages");
    return response.json();
  }

  static async sendMessage(data: CreateMessageData): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  }

  static async markAsRead(messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to mark message as read");
  }

  static async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete message");
  }
}

export class MockMessageService {
  private static messages: Message[] = [];
  
  static async getMessagesByUserId(userId: string): Promise<Message[]> {
    await new Promise((r) => setTimeout(r, 300));
    return this.messages.filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId
    );
  }

  static async getMessagesByAppointmentId(appointmentId: string): Promise<Message[]> {
    await new Promise((r) => setTimeout(r, 300));
    return this.messages.filter((msg) => msg.appointmentId === appointmentId);
  }

  static async sendMessage(
    senderId: string,
    data: CreateMessageData
  ): Promise<Message> {
    await new Promise((r) => setTimeout(r, 500));
    
    const newMessage: Message = {
      id: Math.random().toString(36).slice(2),
      senderId,
      receiverId: data.receiverId,
      content: data.content,
      timestamp: new Date().toISOString(),
      read: false,
      appointmentId: data.appointmentId,
      category: data.category ?? "general",
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  static async markAsRead(messageId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const message = this.messages.find((m) => m.id === messageId);
    if (message) {
      message.read = true;
      message.readAt = new Date().toISOString();
    }
  }

  static async deleteMessage(messageId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    this.messages = this.messages.filter((m) => m.id !== messageId);
  }

  static groupMessagesByThread(
    messages: Message[],
    currentUserId: string
  ): Record<string, MessageThread> {
    return messages.reduce((acc, message) => {
      const otherUserId =
        message.senderId === currentUserId
          ? message.receiverId
          : message.senderId;
      const key = [currentUserId, otherUserId].sort().join("-");

      if (!acc[key]) {
        acc[key] = {
          otherUserId,
          messages: [],
          lastMessage: message,
          unreadCount: 0,
        };
      }

      acc[key].messages.push(message);

      // Update last message if this one is newer
      if (
        new Date(message.timestamp) >
        new Date(acc[key].lastMessage.timestamp)
      ) {
        acc[key].lastMessage = message;
      }

      // Count unread messages (received by current user and not read)
      if (message.receiverId === currentUserId && !message.read) {
        acc[key].unreadCount++;
      }

      return acc;
    }, {} as Record<string, MessageThread>);
  }
}
