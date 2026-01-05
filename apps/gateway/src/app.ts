import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from '@libs/config';

const app = express();

app.use(cors());

// Define the services and their Swagger JSON endpoints
const services = [
    { name: 'User Service', url: `${config.services.user.url}/api/docs-json` },
    { name: 'Catalog Service', url: `${config.services.catalog.url}/api/docs-json` },
    { name: 'File Service', url: `${config.services.file.url}/api/docs-json` },
    { name: 'Borrow Service', url: `${config.services.borrow.url}/api/docs-json` },
    { name: 'Auth Service', url: `${config.services.auth.url}/v3/api-docs` },
    { name: 'Statistics Service', url: `${config.services.statistics.url}/v3/api-docs` }
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
