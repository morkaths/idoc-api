import * as jwt from 'jsonwebtoken';
import { AuthConfig } from './type';

const ACCESS_BLACKLIST_PREFIX = 'idoc:auth:blacklist:access:';

export class TokenService {
  constructor(private readonly config: AuthConfig) {}

  async verifyToken(token: string): Promise<any> {
    let decoded: any;

    if (this.config.publicKey) {
        decoded = jwt.verify(token, this.config.publicKey, { algorithms: this.config.algorithms || ['RS256'] });
    } else {
      // Fallback to decode if no key provided (not recommended for production but supported for legacy/internal)
      decoded = jwt.decode(token);
    }

    if (!decoded || !decoded.jti) {
      throw new Error('Invalid token structure');
    }

    // Check Blacklist
    const isBlacklisted = await this.config.redis.get(`${ACCESS_BLACKLIST_PREFIX}${decoded.jti}`);
    if (isBlacklisted) {
      throw new Error('Token revoked');
    }

    return decoded;
  }
}
