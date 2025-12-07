const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation - Catalog Service',
      version: '1.0.0',
      description: 'API for Book, Author, Category',
    },
    servers: [{ url: 'http://localhost:8000/api/v1' }],
  },
  apis: ['./docs/*.yaml', './docs/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;