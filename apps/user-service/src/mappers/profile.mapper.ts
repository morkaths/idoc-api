import { createClassTransformerMapper } from '../core/base.mapper';
import { ProfileDto } from '../dtos/profile.dto';

export const ProfileMapper = createClassTransformerMapper<any, ProfileDto>(ProfileDto);