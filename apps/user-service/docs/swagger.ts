import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'API documentation for User Service',
    },
    servers: [
      { url: process.env.API_URL || 'http://localhost:5001/api' },
      { url: 'http://localhost:5001/api' }
    ],
    tags: [
      { name: 'Profile', description: 'Profile management' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key for authentication'
        }
      },
      schemas: {
        ProfileDto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'number' },
            fullName: { type: 'string' },
            birthday: { type: 'string', format: 'date-time' },
            avatar: { type: 'string' },
            bio: { type: 'string' },
            location: { type: 'string' }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] },
      { apiKeyAuth: [] }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
