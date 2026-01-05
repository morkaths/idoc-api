import { IProfile } from '../models/profile.model';
import { profileRepository } from '../repositories/profile.repository';
import { ProfileDto } from '../dtos/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { BaseService } from '@libs/core';
import { Pagination } from '../types';

class ProfileService extends BaseService<IProfile, ProfileDto> {
  constructor() {
    super(profileRepository, ProfileMapper);
  }

  async findList(
    page: number,
    limit: number,
    filter: { [key: string]: any }
  ): Promise<{ data: ProfileDto[]; pagination: Pagination }> {
    const result = await profileRepository.findList(page, limit, filter);
    const data = (result.items || []).map(profile => this.mapper.toDto(profile));
    return { data, pagination: result.pagination };
  }
}

export default new ProfileService();