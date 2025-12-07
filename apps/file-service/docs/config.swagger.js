const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Service API',
      version: '1.0.0',
      description: 'API documentation for File Service',
    },
    servers: [
      {
        url: 'http://localhost:8000/api',
      },
    ],
  },
  apis: ['./routes/*.ts'], // hoặc đường dẫn tới các file controller chứa swagger comment
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;