import Koa from 'koa';
//import { AppBookDatabasseState, AppWharehouseDatabaseState } from "./spec.ts"

const app = new Koa<AppBookDatabaseState & AppWarehouseDatabaseState, Koa.DefaultContext>()

// Not sure where the following code goes excatly
app.use(async (ctx, next): Promise<void> => {

    ctx.state = state

    await next()

})

