
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Search, Bell } from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import ProfileSetup from "@/components/ProfileSetup";
import ProfileSetupHeartbreak from "@/components/ProfileSetupHeartbreak";
import ProfileSetupDepression from "@/components/ProfileSetupDepression";
import ChatInterface from "@/components/ChatInterface";
import DualChatInterface from "@/components/DualChatInterface";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'mood' | 'profile' | 'matching' | 'chat' | 'dual-chat'>('landing');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentStep('mood');
  };

  const handleMoodSelected = (mood: string) => {
    setSelectedMood(mood);
    setCurrentStep('profile');
  };

  const handleProfileComplete = (profile: any) => {
    setUserProfile(profile);
    setCurrentStep('matching');
    // Simulate matching process
    setTimeout(() => {
      setCurrentStep('chat');
    }, 3000);
  };

  if (currentStep === 'mood') {
    return <MoodSelector onMoodSelected={handleMoodSelected} />;
  }

  if (currentStep === 'profile') {
    if (selectedMood === 'heartbreak') {
      return <ProfileSetupHeartbreak onComplete={handleProfileComplete} onBack={() => setCurrentStep('mood')} />;
    } else if (selectedMood === 'depression') {
      return <ProfileSetupDepression onComplete={handleProfileComplete} onBack={() => setCurrentStep('mood')} />;
    } else {
      return <ProfileSetup selectedMood={selectedMood} onComplete={handleProfileComplete} onBack={() => setCurrentStep('mood')} />;
    }
  }

  if (currentStep === 'matching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center animate-pulse">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding your match...</h2>
            <p className="text-gray-600 mb-4">We're connecting you with someone who shares your mood and interests.</p>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-500">This usually takes a few seconds...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'chat') {
    return <ChatInterface userProfile={userProfile} selectedMood={selectedMood} />;
  }

  if (currentStep === 'dual-chat') {
    return <DualChatInterface userProfile={userProfile} selectedMood={selectedMood} onBack={() => setCurrentStep('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200 mb-6">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Safe & Anonymous
            </Badge>
            <span className="text-sm text-gray-600">Connecting minds, protecting privacy</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Omeyo Space
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with strangers for meaningful conversations based on your mood and interests. 
            Experience genuine human connection in a safe, anonymous environment.
          </p>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Chatting
              <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => setCurrentStep('dual-chat')}
              size="lg" 
              variant="outline"
              className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Try Dual Chat
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Our AI pairs you with compatible strangers based on mood, interests, and conversation preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Complete anonymity with end-to-end encryption. No real names, no permanent records, just genuine conversation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800">Safe Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                AI-powered moderation and community reporting ensure respectful, appropriate conversations for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200 p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Conversations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Safe Interactions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
              <div className="text-gray-600">Moderation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
