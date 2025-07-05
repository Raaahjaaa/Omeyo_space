import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { chatService, ChatMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface DualChatInterfaceProps {
  userProfile: any;
  selectedMood: string;
  onBack?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const DualChatInterface = ({ userProfile, selectedMood, onBack }: DualChatInterfaceProps) => {
  const [user1Name, setUser1Name] = useState('Alice');
  const [user2Name, setUser2Name] = useState('Bob');
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2' | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Start a chat session
        const user1 = userProfile?.name || 'User1';
        const user2 = 'Anonymous Stranger';
        setUser1Name(user1);
        setUser2Name(user2);
        
        await chatService.startChat(user1, user2);
        
        // Get existing messages
        const apiMessages = await chatService.getMessages();
        const formattedMessages: Message[] = apiMessages.map((msg, index) => ({
          id: index.toString(),
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
        setIsConnected(true);
        
        toast({
          title: "Chat Connected!",
          description: "You're now connected with someone. Start chatting!",
        });
      } catch (err) {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to chat server. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [userProfile, toast]);

  const sendMessage = async () => {
    if (newMessage.trim() && isConnected && currentUser) {
      try {
        const sender = currentUser === 'user1' ? user1Name : user2Name;
        const messageText = newMessage;
        
        // Add message to UI immediately
        const message: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Send message to API
        await chatService.sendMessage(sender, messageText);
        
        toast({
          title: "Message sent!",
          description: "Your message has been sent.",
        });
      } catch (err) {
        toast({
          title: "Message Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
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

  const getMoodColor = (mood: string) => {
    const colors = {
      support: 'bg-blue-100 text-blue-700',
      casual: 'bg-green-100 text-green-700',
      interests: 'bg-purple-100 text-purple-700',
      professional: 'bg-orange-100 text-orange-700'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Chat...</h2>
            <p className="text-gray-600 mb-6">Setting up your conversation with someone new.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl h-screen flex flex-col p-4">
        {/* Header */}
        <Card className="rounded-b-none border-b-0 bg-white/80 backdrop-blur-sm mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">Dual Chat Interface</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getMoodColor(selectedMood)}>
                  {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Mood
                </Badge>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Dual Chat Windows */}
        <div className="flex-1 grid md:grid-cols-2 gap-6">
          {/* User 1 Window */}
          <Card className="flex flex-col bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user1Name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{user1Name}</h3>
                  <Badge variant="secondary" className={`text-xs ${currentUser === 'user1' ? 'bg-blue-100 text-blue-700' : ''}`}>
                    You {currentUser === 'user1' && '(Active)'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === user1Name ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === user1Name
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === user1Name ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
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
              </div>
            </CardContent>
          </Card>

          {/* User 2 Window */}
          <Card className="flex flex-col bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-500 text-white">
                    {user2Name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{user2Name}</h3>
                  <Badge variant="secondary" className={`text-xs ${currentUser === 'user2' ? 'bg-green-100 text-green-700' : ''}`}>
                    Stranger {currentUser === 'user2' && '(Active)'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === user2Name ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === user2Name
                          ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === user2Name ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DualChatInterface; 