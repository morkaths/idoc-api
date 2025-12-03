import { Profile } from '../models/profile.model';
import { UserClient } from '../integrations/user.client';

export async function seedProfiles() {
  // Clear existing roles
  await Profile.deleteMany({});

  // Fetch users from auth service to link with profiles
  const users = await UserClient.getAll();

  const profiles = users.map((user, idx) => ({
    userId: user.id,
    fullName: `User ${idx + 1}`,
    birthday: new Date('1990-01-01'),
    avatar: '',
    bio: `This is the bio of ${user.username}.`,
    location: 'Việt Nam'
  }));
  await Profile.insertMany(profiles);

  console.log('Seed profile data success!');
}