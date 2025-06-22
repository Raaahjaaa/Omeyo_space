
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MoodSelectorProps {
  onMoodSelected: (mood: string) => void;
}

const MoodSelector = ({ onMoodSelected }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string>('');

  const moods = [
    {
      id: 'support',
      title: 'Seeking Support',
      description: 'Looking for advice, emotional support, or someone to listen',
      color: 'from-blue-500 to-indigo-600',
      icon: '🤝'
    },
    {
      id: 'casual',
      title: 'Casual Chat',
      description: 'Just want to have a friendly, relaxed conversation',
      color: 'from-green-500 to-teal-600',
      icon: '😊'
    },
    {
      id: 'interests',
      title: 'Interest-Based',
      description: 'Discuss hobbies, passions, or specific topics',
      color: 'from-purple-500 to-pink-600',
      icon: '🎯'
    },
    {
      id: 'professional',
      title: 'Professional Network',
      description: 'Career advice, networking, or industry discussions',
      color: 'from-orange-500 to-red-600',
      icon: '💼'
    }
  ];

  const handleContinue = () => {
    if (selectedMood) {
      onMoodSelected(selectedMood);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">What brings you here today?</h1>
          <p className="text-lg text-gray-600">Choose your mood to find the perfect conversation partner</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {moods.map((mood) => (
            <Card
              key={mood.id}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
                selectedMood === mood.id
                  ? 'border-indigo-500 shadow-lg bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedMood(mood.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${mood.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {mood.icon}
                </div>
                <CardTitle className="text-xl text-gray-800">{mood.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{mood.description}</p>
                {selectedMood === mood.id && (
                  <Badge className="mt-3 bg-indigo-100 text-indigo-700">Selected</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedMood}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Profile Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
