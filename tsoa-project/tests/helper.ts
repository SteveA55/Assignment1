import Koa from 'koa';
//import { AppBookDatabasseState, AppWharehouseDatabaseState } from "./spec.ts"
import { beforeEach, it } from 'vitest'

const app = new Koa<AppBookDatabaseState & AppWarehouseDatabaseState, Koa.DefaultContext>()


app.use(async (ctx, next): Promise<void> => {

    ctx.state = state

    await next()

})



beforeEach(async (context: any) => {

    context.foo = 'bar'
})

it('should work', (context) => {

    console.log(context)

})

