import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors());

// Define the services and their Swagger JSON endpoints
const services = [
    { name: 'User Service', url: 'http://localhost:5001/api/docs-json' },
    { name: 'Catalog Service', url: 'http://localhost:5002/api/docs-json' },
    { name: 'File Service', url: 'http://localhost:5003/api/docs-json' },
    { name: 'Borrow Service', url: 'http://localhost:5004/api/docs-json' },
    { name: 'Auth Service', url: 'http://localhost:8080/v3/api-docs' },
    { name: 'Payment Service', url: 'http://localhost:8081/v3/api-docs' },
    { name: 'Statistics Service', url: 'http://localhost:8085/v3/api-docs' }
];

// Configure Swagger UI with Explorer enabled
const options = {
    explorer: true,
    swaggerOptions: {
        urls: services,
        dom_id: '#swagger-ui',
        deepLinking: true,
        layout: "StandaloneLayout"
    }
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(undefined, options));

export default app;
