import { Profile, IProfile } from '../models/profile.model';
import { BaseRepository } from '../core/base.repository';
import { FilterQuery } from 'mongoose';

class ProfileRepository extends BaseRepository<IProfile> {
  constructor() {
    super(Profile);
  }
}

export default new ProfileRepository();
