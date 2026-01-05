import { createClassTransformerMapper } from '@libs/core';
import { ProfileDto } from '../dtos/profile.dto';

export const ProfileMapper = createClassTransformerMapper<any, ProfileDto>(ProfileDto);