import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProfileSetupDepressionProps {
  onComplete: (profile: any) => void;
  onBack?: () => void;
}

const ProfileSetupDepression = ({ onComplete, onBack }: ProfileSetupDepressionProps) => {
  const [ageRange, setAgeRange] = useState('');
  const [feeling, setFeeling] = useState('');
  const [support, setSupport] = useState('');
  const [coping, setCoping] = useState('');
  const [extra, setExtra] = useState('');

  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const isComplete = ageRange && feeling && support && coping;

  const handleComplete = () => {
    if (isComplete) {
      onComplete({
        ageRange,
        feeling,
        support,
        coping,
        extra,
        mood: 'depression'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              ← Back
            </Button>
          )}
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Depression overcome - About You</h1>
          <p className="text-lg text-gray-600">Help us match you for the best support</p>
        </div>
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Age Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {ageRanges.map((range) => (
                <Button
                  key={range}
                  variant={ageRange === range ? "default" : "outline"}
                  className={ageRange === range ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setAgeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">How have you been feeling lately?</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Down, anxious, okay..."
              value={feeling}
              onChange={e => setFeeling(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Are you seeking advice or just someone to listen?</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Advice, just listening, both..."
              value={support}
              onChange={e => setSupport(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">What helps you feel better?</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Music, friends, therapy..."
              value={coping}
              onChange={e => setCoping(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Anything else you'd like to share?</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full border rounded-lg p-2 min-h-[80px]"
              placeholder="Share anything else that might help your match understand you..."
              value={extra}
              onChange={e => setExtra(e.target.value)}
            />
          </CardContent>
        </Card>
        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={!isComplete}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find My Match
          </Button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your information is kept completely anonymous and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupDepression; 