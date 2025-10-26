import { Profile, IProfile } from '../models/profile.model';
import { FilterQuery } from 'mongoose';

const ProfileService = {
  /**
   * Get all profiles.
   * @returns List of all profiles.
   */
  getAll: async (): Promise<IProfile[]> => {
    return await Profile.find().exec();
  },

  /**
   * Get profile by ID.
   * @param id - ID of the profile.
   * @returns The found profile or null if not found.
   */
  getById: async (id: string): Promise<IProfile | null> => {
    return await Profile.findById(id).exec();
  },

  /**
   * Find profiles by filter.
   * @param filter - The filter to find profiles.
   * @returns List of found profiles.
   */
  find: async (filter: FilterQuery<IProfile>): Promise<IProfile[]> => {
    return Profile.find(filter).exec();
  },

  /**
   * Find one profile by filter.
   * @param filter - The filter to find the profile.
   * @returns The found profile or null if not found.
   */
  findOne: async (filter: FilterQuery<IProfile>): Promise<IProfile | null> => {
    return Profile.findOne(filter).exec();
  },

  /**
   * Create a new profile.
   * @param profile - The profile information.
   * @returns The created profile.
   */
  create: async (profile: IProfile): Promise<IProfile> => {
    const newProfile = new Profile(profile);
    return await newProfile.save();
  },

  /**
   * Update a profile.
   * @param id - ID of the profile.
   * @param profile - The profile information to update.
   * @returns The updated profile or null if not found.
   */
  update: async (id: string, profile: Partial<IProfile>): Promise<IProfile | null> => {
    return await Profile.findByIdAndUpdate(id, profile, { new: true, runValidators: true }).exec();
  },

  /**
   * Update a profile by user ID.
   * @param userId - User ID associated with the profile.
   * @param profile - The profile information to update.
   * @returns The updated profile or null if not found.
   */
  updateByUserId: async (userId: string, profile: Partial<IProfile>): Promise<IProfile | null> => {
    return await Profile.findOneAndUpdate({ userId }, profile, { new: true, runValidators: true }).exec();
  },

  /**
   * Delete a profile by ID.
   * @param id - ID of the profile.
   * @returns The deleted profile or null if not found.
   */
  delete: async (id: string): Promise<IProfile | null> => {
    return await Profile.findByIdAndDelete(id).exec();
  },
}

export default ProfileService;