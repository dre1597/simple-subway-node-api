import { app, init } from './api/server/server';
import { helloRoutes } from './api/routes/hello.routes';
import { cardRoutes } from './api/routes/card.routes';

app.register(helloRoutes);
app.register(cardRoutes, { prefix: '/cards' });

init();
