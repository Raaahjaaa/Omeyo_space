import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageCircle, RefreshCw } from "lucide-react";
import { chatService, ChatMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const SharedChat = () => {
  const [user1Name, setUser1Name] = useState('Alice');
  const [user2Name, setUser2Name] = useState('Bob');
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2' | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        loadMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const startChat = async () => {
    try {
      const chatId = await chatService.startChat(user1Name, user2Name);
      setChatId(chatId);
      setIsConnected(true);
      toast({
        title: "Chat Started!",
        description: `Chat ID: ${chatId}`,
      });
      loadMessages();
    } catch (error) {
      toast({
        title: "Failed to start chat",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !isConnected) return;

    try {
      const sender = currentUser === 'user1' ? user1Name : user2Name;
      await chatService.sendMessage(sender, newMessage);
      
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      toast({
        title: "Message sent!",
        description: "Your message has been sent.",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async () => {
    if (!isConnected) return;
    
    try {
      const apiMessages = await chatService.getMessages();
      const formattedMessages: Message[] = apiMessages.map((msg, index) => ({
        id: index.toString(),
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Shared Chat - Two Users, One Server
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">User 1 Name</label>
                <Input
                  value={user1Name}
                  onChange={(e) => setUser1Name(e.target.value)}
                  placeholder="Enter user 1 name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">User 2 Name</label>
                <Input
                  value={user2Name}
                  onChange={(e) => setUser2Name(e.target.value)}
                  placeholder="Enter user 2 name"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={startChat} disabled={isConnected}>
                Start Shared Chat
              </Button>
              {isConnected && (
                <Button variant="outline" onClick={loadMessages}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Messages
                </Button>
              )}
            </div>

            {chatId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Chat ID:</strong> {chatId}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Messages auto-refresh every 3 seconds
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isConnected && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* User 1 Chat */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user1Name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user1Name}</h3>
                    <Badge variant="secondary" className={`text-xs ${currentUser === 'user1' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      User 1 {currentUser === 'user1' && '(Active)'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === user1Name ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender === user1Name
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={currentUser === 'user1' ? newMessage : ''}
                    onChange={(e) => {
                      setCurrentUser('user1');
                      setNewMessage(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type as ${user1Name}...`}
                    className={currentUser === 'user1' ? 'border-blue-500 bg-blue-50' : ''}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentUser('user1');
                      sendMessage();
                    }}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User 2 Chat */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-500 text-white">
                      {user2Name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user2Name}</h3>
                    <Badge variant="secondary" className={`text-xs ${currentUser === 'user2' ? 'bg-green-100 text-green-700' : ''}`}>
                      User 2 {currentUser === 'user2' && '(Active)'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === user2Name ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender === user2Name
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={currentUser === 'user2' ? newMessage : ''}
                    onChange={(e) => {
                      setCurrentUser('user2');
                      setNewMessage(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type as ${user2Name}...`}
                    className={currentUser === 'user2' ? 'border-green-500 bg-green-50' : ''}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentUser('user2');
                      sendMessage();
                    }}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedChat; 