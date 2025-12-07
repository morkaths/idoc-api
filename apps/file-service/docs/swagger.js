const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config({ path: '../.env' });

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Service API',
      version: '1.0.0',
      description: 'API documentation for File Service',
    },
    servers: [
      { url: process.env.API_URL },
      { url: 'http://localhost:5003/api' }
    ],
    tags: [
      { name: 'File', description: 'File operations' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
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
        FileUpload: {
          type: 'object',
          required: ['file'],
          properties: {
            file: {
              type: 'string',
              format: 'binary'
            }
          },
        },
        FileUploadUrl: {
          type: 'object',
          required: ['filename', 'type'],
          properties: {
            filename: { type: 'string' },
            type: { type: 'string' }
          }
        },
        FileConfirm: {
          type: 'object',
          required: ['key'],
          properties: {
            key: { type: 'string' }
          }
        },
        File: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            key: { type: 'string' },
            filename: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'number' },
            url: { type: 'string' },
            provider: { type: 'string' },
            metadata: { type: 'object', additionalProperties: true }
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