import { app, init } from './api/server/server';
import { helloRoutes } from './api/routes/hello.routes';

app.register(helloRoutes);

init();
