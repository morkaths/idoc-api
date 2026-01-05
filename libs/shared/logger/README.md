# Shared Logger Library

This library provides a configured Winston logger for use across Node.js services, including specialized transports for different log contexts (SQL, Security, API, Error).

## Features

- **Console Logging**: Pretty-printed and colorized for development.
- **File Logging**: Automatic daily rotation, JSON format, separated into specific log files:
  - `error-%DATE%.log`: All error level logs.
  - `sql-%DATE%.log`: Database queries (context: 'SQL').
  - `security-%DATE%.log`: Auth/Security events (context: 'SECURITY').
  - `api-%DATE%.log`: HTTP requests (context: 'API').
  - `app-%DATE%.log`: General application logs (excluding the above special contexts).
- **Decorators**: `@Log()` decorator for automatic method entry/exit and error logging.
- **Middleware**: Ready-to-use Express middleware for HTTP logging and error handling.

## Usage

### 1. Basic Logging

Import `logger` directly for manual logging.

```typescript
import { logger } from '@idoc-api/logger';

// General logs (goes to app-*.log)
logger.info('User processed successfully');
logger.warn('Configuration missing, using defaults');

// Error logs (goes to error-*.log)
logger.error('Failed to connect to database', { stack: error.stack });

// Specialized Contexts (goes to respective files)
logger.info('SELECT * FROM users', { context: 'SQL' });
logger.info('User login failed', { context: 'SECURITY' });
```

### 2. Method Decorator

Use `@Log()` to automatically log:
- Entry: `Enter: ClassName.methodName()`
- Exit: `Exit: ClassName.methodName()`
- Errors: `Exception in ClassName.methodName(): message`

```typescript
import { Log } from '@idoc-api/logger';

export class UserService {
    @Log()
    async createUser(dto: CreateUserDto) {
        // ... business logic
    }
}
```

### 3. Express Middleware

Register the provided middleware in your Express app.

**HTTP Request Logging**
Logs method, URL, status code, and duration to `api-*.log`.

```typescript
import { httpLogger } from '@idoc-api/logger';

app.use(httpLogger);
```

**Global Error Handling**
Catches errors, logs them to `error-*.log` with system context, and sends a standardized JSON response.

```typescript
import { errorHandler } from '@idoc-api/logger';

// Register as the last middleware
app.use(errorHandler);
```

### 4. Environment Variables

Configure behavior using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` |
| `LOG_DIR` | Directory to store log files | `logs` |
