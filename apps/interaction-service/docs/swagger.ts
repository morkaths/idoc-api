import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@libs/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Interaction Service API',
      version: '1.0.0',
      description: 'API documentation for Interaction Service (Review, Bookmark, Collection)',
    },
    servers: [
      { url: config.app.url },
      { url: `${config.services.interaction.url}/api` }
    ],
    tags: [
      { name: 'Bookmark', description: 'Bookmark management' },
      { name: 'Collection', description: 'Collection management' },
      { name: 'Review', description: 'Review management' }
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
        BookmarkDto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            collectionId: { type: 'string' },
            itemId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CollectionDto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            itemCount: { type: 'number' },
            isPublic: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ReviewDto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            itemId: { type: 'string' },
            rating: { type: 'number' },
            content: { type: 'string' },
            isHidden: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
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