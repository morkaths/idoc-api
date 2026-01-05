import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@libs/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Borrow Service API',
      version: '1.0.0',
      description: 'API documentation for Borrow Service',
    },
    servers: [
      { url: config.urls.api },
      { url: `${config.services.borrow.url}/api` }
    ],
    tags: [
      { name: 'Borrow', description: 'Borrow management' }
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
        BorrowDto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            bookId: { type: 'string' },
            borrowTime: { type: 'string', format: 'date-time' },
            expireTime: { type: 'string', format: 'date-time' },
            returnTime: { type: 'string', format: 'date-time', nullable: true },
            extendCount: { type: 'integer', nullable: true },
            note: { type: 'string', nullable: true },
            status: { type: 'string' },
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