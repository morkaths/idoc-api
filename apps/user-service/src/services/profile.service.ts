import { IProfile } from '../models/profile.model';
import { profileRepository } from '../repositories/profile.repository';
import { ProfileDto } from '../dtos/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { BaseService } from '../core/base.service';
import { Pagination } from '../types';

class ProfileService extends BaseService<IProfile, ProfileDto> {
  constructor() {
    super(profileRepository, ProfileMapper);
  }

  async getList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ): Promise<{ data: ProfileDto[]; pagination: Pagination }> {
    const result = await profileRepository.findList(page, limit, filter);
    const data = (result.items || []).map((d: any) => this.mapper.toDto(d as IProfile));
    return { data, pagination: result.pagination };
  }
}

export default new ProfileService();