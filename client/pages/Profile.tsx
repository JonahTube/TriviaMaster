import { User } from 'lucide-react';
import PlaceholderPage from '@/components/PlaceholderPage';

export default function Profile() {
  return (
    <PlaceholderPage
      title="User Profile"
      description="Track your progress, customize your avatar, view achievements, and analyze your trivia performance."
      icon={User}
    />
  );
}
