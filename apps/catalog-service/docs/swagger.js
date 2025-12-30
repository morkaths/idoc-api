const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config({ path: '../.env' });

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catalog Service API',
      version: '1.0.0',
      description: 'API documentation for Catalog Service',
    },
    servers: [
      { url: process.env.API_URL },
      { url: 'http://localhost:5002/api' }
    ],
    tags: [
      { name: 'Book', description: 'Book management' },
      { name: 'Category', description: 'Category management' },
      { name: 'Author', description: 'Author management' }
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
        BookDto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            description: { type: 'string' },
            slug: { type: 'string' },
            publisher: { type: 'string' },
            publishedDate: { type: 'string', format: 'date-time' },
            edition: { type: 'string' },
            isbn: { type: 'string' },
            language: { type: 'string' },
            pages: { type: 'integer' },
            price: { type: 'number' },
            stock: { type: 'number' },
            coverUrl: { type: 'string' },
            fileKey: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            authorIds: { type: 'array', items: { type: 'string' } },
            categoryIds: { type: 'array', items: { type: 'string' } }
          }
        },
        CategoryDto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            parentId: { type: 'string' },
            translations: {
              type: 'array',
              items: { $ref: '#/components/schemas/CategoryTranslationDto' }
            }
          }
        },
        CategoryTranslationDto: {
          type: 'object',
          properties: {
            lang: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        },
        AuthorDto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            avatarUrl: { type: 'string' },
            birthDate: { type: 'string', format: 'date-time' },
            nationality: { type: 'string' },
            bio: { type: 'string' }
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
module.exports = swaggerSpec;