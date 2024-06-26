import Koa from 'koa';
import Router from 'koa-router';
//import { koaSwagger } from 'koa-swagger-decorator'; // correct import for koaSwagger
//import { SwaggerRouter } from 'koa-swagger-decorator'
import { koaSwagger } from 'koa2-swagger-ui';

const app = new Koa();
const router = new Router();

// Swagger configuration
const swaggerOptions = {
    title: 'Koa Swagger API',
    version: '1.0.0',
    swaggerOptions: {
        basePath: '/',
    },
};

app.use(koaSwagger({

    routePrefix: '/docs',

    specPrefix: '/docs/spec',

    exposeSpec: true,

    swaggerOptions: {

        // spec: swagger // This object is an import of the swagger.json generated by tsoa
        url: './build/swagger.json', // example path to json


    }


}))

// Apply koaSwagger middleware
router.get('/swagger', koaSwagger(swaggerOptions));

app.use(router.routes()).use(router.allowedMethods());

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});