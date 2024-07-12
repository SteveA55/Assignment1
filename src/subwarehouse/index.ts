import { type ZodRouter } from 'koa-zod-router'
import { placeBooksOnShelfRouter } from './place_on_shelf'
import { placeOrderRouter } from './place_order'
import { listOrdersRouter } from '../suborders/list_orders'
import { getBookInfoRouter } from './get_book_info'
import { fulfilOrderRouter } from '../suborders/fulfil_order'

export function setupWarehouseRoutes(router: ZodRouter): void {
  // Placing Books on Shelves
  placeBooksOnShelfRouter(router)

  placeOrderRouter(router)

  listOrdersRouter(router)

  getBookInfoRouter(router)

  fulfilOrderRouter(router)
}
