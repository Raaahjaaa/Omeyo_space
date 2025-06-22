
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSetupProps {
  selectedMood: string;
  onComplete: (profile: any) => void;
}

const ProfileSetup = ({ selectedMood, onComplete }: ProfileSetupProps) => {
  const [ageRange, setAgeRange] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');

  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
  
  const interestOptions = [
    'Technology', 'Music', 'Movies', 'Books', 'Sports', 'Travel',
    'Food', 'Art', 'Gaming', 'Science', 'Philosophy', 'Business',
    'Health', 'Nature', 'Photography', 'Languages'
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 5
        ? [...prev, interest]
        : prev
    );
  };

  const handleComplete = () => {
    if (ageRange && interests.length > 0) {
      onComplete({
        ageRange,
        interests,
        location,
        mood: selectedMood
      });
    }
  };

  const isComplete = ageRange && interests.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tell us a bit about yourself</h1>
          <p className="text-lg text-gray-600">This helps us find better conversation matches</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Age Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {ageRanges.map((range) => (
                <Button
                  key={range}
                  variant={ageRange === range ? "default" : "outline"}
                  className={ageRange === range ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  onClick={() => setAgeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Interests</CardTitle>
            <p className="text-sm text-gray-600">Select up to 5 interests</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 ${
                    interests.includes(interest)
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {interests.length}/5
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">General Location (Optional)</CardTitle>
            <p className="text-sm text-gray-600">Helps with time zone matching</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="location">Country or Region</Label>
              <Input
                id="location"
                placeholder="e.g., United States, Europe, Asia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={!isComplete}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProfileSetup;
