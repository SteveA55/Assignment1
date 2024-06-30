let client: any;


export function getBookDatabase(dbName?: string): BookDatabaseAccessor {

  const database = client.db(dbName ?? Math.floor(Math.random() * 100000).toPrecision().toString())

}


export interface AppWarehouseDatabaseState {

  warehouse: WarehouseData

}




export async function getDefaultWarehouseDatabase(name?: string): Promise<WarehouseData> {

  const db = await getWarehouseDatabase(name)

  return new DatabaseWarehouse(db)

}