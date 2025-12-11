import { Profile, IProfile } from '../models/profile.model';
import { BaseRepository } from '../core/base.repository';

class ProfileRepository extends BaseRepository<IProfile> {
  constructor() {
    super(Profile);
  }

  async findList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ) {
    const {
      query,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...rest
    } = filter;

    const conditions: any[] = [];

    if (query) {
      const regex = new RegExp(String(query), 'i');
      conditions.push({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { bio: regex },
        ],
      });
    }

    if (userId) {
      conditions.push({ userId });
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push({ [key]: value });
      }
    });

    const match = conditions.length > 0 ? { $and: conditions } : {};
    const options = {
      page: Math.max(1, Number(page)),
      limit: Math.max(1, Number(limit)),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      lean: true,
    };

    return this.paginate(match, options);
  }
}

export const profileRepository = new ProfileRepository();