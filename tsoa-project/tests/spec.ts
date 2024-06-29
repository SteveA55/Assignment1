var client;

// Not sure where the following code actually goes (which file)
export function getBookDatabase (dbName?: string): BookDatabaseAccessor {

    const database = client.db(dbName ?? Math.floor(Math.random() * 100000).toPrecision().toString())

}

// Not sure where the following code actually goes (which file)
export interface AppWarehouseDatabaseState {

    warehouse: WarehouseData
  
  }
  
  
  
  
  export async function getDefaultWarehouseDatabase (name?: string): Promise<WarehouseData> {
  
    const db = await getWarehouseDatabase(name)
  
    return new DatabaseWarehouse(db)
  
  }