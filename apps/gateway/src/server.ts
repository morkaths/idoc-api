import app from './app';
import { config } from '@libs/config';

const port = config.services.gateway.port;

app.listen(port, () => {
    console.log(`Gateway Swagger UI running on http://localhost:${port}`);
});
