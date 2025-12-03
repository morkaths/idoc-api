import { IProfile } from '../models/profile.model';
import ProfileRepository from '../repositories/profile.repository';
import { ProfileDto } from '../dtos/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { BaseService } from '../core/base.service';

class ProfileService extends BaseService<IProfile, ProfileDto> {
  constructor() {
    super(ProfileRepository, ProfileMapper);
  }

  async search(params: { [key: string]: any }): Promise<ProfileDto[]> {
    const { query, ...rest } = params;
    const conditions: any[] = [];
    if (query) {
      conditions.push({
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
        ],
      });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });
    const filter = conditions.length > 0 ? { $and: conditions } : {};
    return this.find(filter);
  }

}

export default new ProfileService();