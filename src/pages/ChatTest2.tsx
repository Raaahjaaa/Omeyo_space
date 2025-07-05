import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageCircle } from "lucide-react";
import { chatService2, ChatMessage } from "@/services/chatService2";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const ChatTest2 = () => {
  const [user1Name, setUser1Name] = useState('Alice');
  const [user2Name, setUser2Name] = useState('Bob');
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2' | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const startChat = async () => {
    try {
      const chatId = await chatService2.startChat(user1Name, user2Name);
      setChatId(chatId);
      setIsConnected(true);
      toast({
        title: "Chat Started! (Server 2)",
        description: `Chat ID: ${chatId}`,
      });
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
      await chatService2.sendMessage(sender, newMessage);
      
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      toast({
        title: "Message sent! (Server 2)",
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
      const apiMessages = await chatService2.getMessages();
      const formattedMessages: Message[] = apiMessages.map((msg, index) => ({
        id: index.toString(),
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
    } catch (error) {
      toast({
        title: "Failed to load messages",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-6 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="h-5 w-5" />
              Chat API Test - Server 2 (Port 3002)
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
              <Button onClick={startChat} disabled={isConnected} className="bg-green-600 hover:bg-green-700">
                Start Chat (Server 2)
              </Button>
              {isConnected && (
                <Button variant="outline" onClick={loadMessages} className="border-green-200">
                  Refresh Messages
                </Button>
              )}
            </div>

            {chatId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Chat ID:</strong> {chatId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {isConnected && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* User 1 Chat */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-500 text-white">
                      {user1Name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user1Name}</h3>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      User 1 (Server 2)
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
                    value={currentUser === 'user1' ? newMessage : ''}
                    onChange={(e) => {
                      setCurrentUser('user1');
                      setNewMessage(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type as ${user1Name}...`}
                    disabled={currentUser !== 'user1'}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentUser('user1');
                      sendMessage();
                    }}
                    disabled={currentUser !== 'user1' || !newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User 2 Chat */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-teal-500 text-white">
                      {user2Name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user2Name}</h3>
                    <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                      User 2 (Server 2)
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
                            ? 'bg-teal-500 text-white'
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
                    disabled={currentUser !== 'user2'}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentUser('user2');
                      sendMessage();
                    }}
                    disabled={currentUser !== 'user2' || !newMessage.trim()}
                    className="bg-teal-600 hover:bg-teal-700"
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

export default ChatTest2; 