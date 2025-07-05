
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Flag, UserX, MoreVertical, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { chatService, ChatMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  userProfile: any;
  selectedMood: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'stranger';
  timestamp: Date;
}

const ChatInterface = ({ userProfile, selectedMood }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Start a chat session
        const user1 = userProfile?.name || 'User1';
        const user2 = 'Anonymous Stranger';
        await chatService.startChat(user1, user2);
        
        // Get existing messages
        const apiMessages = await chatService.getMessages();
        const formattedMessages: Message[] = apiMessages.map((msg, index) => ({
          id: index.toString(),
          text: msg.text,
          sender: msg.sender === user1 ? 'user' : 'stranger',
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
        setIsConnected(true);
        
        toast({
          title: "Chat Connected!",
          description: "You're now connected with someone. Start chatting!",
        });
      } catch (err) {
        setError('Failed to connect to chat. Please try again.');
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
    if (newMessage.trim() && isConnected) {
      try {
        const user1 = userProfile?.name || 'User1';
        const messageText = newMessage; // Store the message text before clearing
        
        // Add message to UI immediately
        const message: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Send message to API
        await chatService.sendMessage(user1, messageText);
        
      } catch (err) {
        toast({
          title: "Message Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReport = () => {
    alert('Report submitted. Our moderation team will review this conversation.');
  };

  const handleBlock = () => {
    setIsConnected(false);
    alert('User blocked. You will be matched with someone else.');
  };

  const handleEndChat = () => {
    setIsConnected(false);
    alert('Chat ended. Thanks for using our platform!');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Ended</h2>
            <p className="text-gray-600 mb-6">Thanks for using our platform. Hope you had a great conversation!</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Start New Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <Card className="rounded-b-none border-b-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    S
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">Anonymous Stranger</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getMoodColor(selectedMood)}>
                      {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Mood
                    </Badge>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleReport} className="text-orange-600">
                    <Flag className="h-4 w-4 mr-2" />
                    Report User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBlock} className="text-red-600">
                    <UserX className="h-4 w-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEndChat}>
                    End Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1 rounded-none border-x-0 bg-white/60 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="rounded-t-none border-t-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Remember to keep conversations respectful and appropriate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
