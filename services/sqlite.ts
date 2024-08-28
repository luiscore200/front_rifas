import * as SQLite from 'expo-sqlite';
//import * as SQLite from 'expo-sqlite/legacy';
import { SQLiteDatabase } from 'expo-sqlite';


// Ruta y nombre del archivo de la base de datos
const DB_NAME = 'database.db';

interface ColumnConfig {
    name: string;
    type: string;
    nullable?: boolean;
    default?: any;
    options?:string;
  }

class Database {
  private static instance: any;

   constructor() {}  // El constructor es privado para evitar instanciaciones directas

  // Método para obtener la instancia única de la base de datos

 async openDb() {
  if(!Database.instance){
   const aa =  SQLite.openDatabaseAsync(DB_NAME);
   Database.instance=aa;
   return aa;
  }else{
    return Database.instance;
  }
  
}

async runQuery (query:string){
    try {
        // Abre la base de datos
        const db = await this.openDb();
    
        await db.runAsync(query);
        console.log(`query run successfully!`);
    } catch (error) {
        console.error(`Failed to fetch query`, error);
    
    }
}

async createTable(tableName: string, columns: ColumnConfig[], options?: string, indices?: string[]): Promise<void> {
  try {
      const db = await this.openDb();
      const columnsDefinition = columns.map(col => {
          let columnDef = `${col.name} ${col.type}`;
          if (!col.nullable) {
              columnDef += ' NOT NULL';
          }
          if (col.default !== undefined) {
              columnDef += ` DEFAULT ${typeof col.default === 'string' ? `'${col.default}'` : col.default}`;
          }
          if (col.options) {
              columnDef += ` ${col.options}`;
          }
          return columnDef;
      }).join(', ');

      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition} ${options ? ', ' + options : ''});`;
   //   console.log(tableName + " : ", query);
      await db.runAsync(query);
      console.log(`Table ${tableName} created successfully!`);

      // Crear índices si están definidos
      if (indices && indices.length > 0) {
          for (const indexColumns of indices) {
              const indexName = `idx_${tableName}_${indexColumns.replace(/,\s*/g, '_')}`;
              const indexQuery = `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${indexColumns});`;
              await db.runAsync(indexQuery);
              console.log(`Index ${indexName} created successfully on ${tableName}`);
          }
      }
  } catch (error) {
      console.error(`Failed to create table ${tableName}:`, error);
  }
}


  async insert(tableName: string, rows: Record<string, any>[]): Promise<void> {
    try {
      const db = await this.openDb();
      if (rows.length === 0) return;
  
      const columns = Object.keys(rows[0]);
      const placeholders = columns.map(() => '?').join(', ');
  
      const processValue = (row: Record<string, any>, col: string): any => {
        if (col === 'id' && !row.id) {
          row.id = -Date.now(); // Asigna un ID negativo basado en el timestamp actual
        }
        const value = row[col];
        if (typeof value === 'boolean') {
          return value ? 1 : 0;
        }
        return value;
      };
  
   
      // Prepara los valores para la consulta SQL
      const values: any[] = [];
      const placeholdersGroup = rows.map(row => {
        const rowValues = columns.map(col => processValue(row, col));
        values.push(...rowValues);
        return `(${placeholders})`;
      }).join(', ');
  
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholdersGroup}`;
  
      // Ejecuta la consulta para todas las filas a la vez
      await db.runAsync(query, values);
  
      console.log(`Inserted ${rows.length} rows into ${tableName}`);
    } catch (error) {
      console.error(`Failed to insert rows into ${tableName}:`, error);
    }
  }
  

  // Método para obtener todos los registros de una tabla
  async index(tableName: string): Promise<any> {
    try {
        const db= await this.openDb();
      const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
      return result;
    } catch (error) {
      console.error(`Failed to fetch rows from ${tableName}:`, error);
      
    }
  }




  async find(
    tableName: string,
    criteria: Record<string, any>,
    columns: string[] = ['*']
  ): Promise<any[]> {
    try {
      const db = await this.openDb();

      const whereClauses = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(criteria);

      const query = `SELECT ${columns.join(', ')} FROM ${tableName} WHERE ${whereClauses}`;
      const result = await db.getAllAsync(query, values);

      return result;
    } catch (error) {
      console.error(`Failed to find records in ${tableName}:`, error);
      return [];
    }
  }



  // Método para eliminar una tabla
async deleteTable(tableName: string): Promise<void> {
    try {
        // Abre la base de datos
        const db = await this.openDb();
        
        // Ejecuta la consulta para eliminar la tabla
        await db.runAsync(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`Table ${tableName} deleted successfully!`);
    } catch (error) {
        console.error(`Failed to delete table ${tableName}:`, error);
    
    }
}

async deleteDataTable(tableName: string, where?: Record<string, any>): Promise<void> {
  try {
      const db = await this.openDb();
      
      let query = `DELETE FROM ${tableName}`;

      // Si se pasan condiciones, generar la cláusula WHERE
      if (where && Object.keys(where).length > 0) {
          const conditions = Object.keys(where).map(key => {
              const value = where[key];
              if (typeof value === 'string') {
                  return `${key} = '${value}'`;
              } else {
                  return `${key} = ${value}`;
              }
          }).join(' AND ');
          query += ` WHERE ${conditions}`;
      }

      // Ejecutar la consulta
      await db.runAsync(query);
      
      console.log(`Data from table ${tableName} deleted successfully!`);
  } catch (error) {
      console.error(`Failed to delete data from table ${tableName}:`, error);
  }
}

async indexWithRelations(
  mainTable: { tableName: string, alias?: string },
  relatedTables: { tableName: string, alias: string, foreignKey: string }[],
  mainTableFields: string[],
  relatedTableFields: { alias: string, fields: string[] }[],
  whereClause?: string
): Promise<any[]> {
  try {
    const db = await this.openDb();

    // Definir alias para la tabla principal
    const mainAlias = mainTable.alias ? `${mainTable.alias}_` : '';

    // Construcción de los campos del SELECT para la tabla principal
    const mainFields = mainTableFields.map(field => 
      mainAlias ? `${mainAlias}${field} AS ${mainAlias}${field}` : `${mainTable.tableName}.${field}`
    ).join(', ');

    // Construcción de los campos del SELECT para las tablas relacionadas
    const relatedFields = relatedTableFields.map(rt =>
      rt.fields.map(field => `${rt.alias}.${field} AS ${rt.alias}_${field}`).join(', ')
    ).join(', ');

    // Construcción de los JOINs
    const joins = relatedTables.map(rt => 
      `LEFT JOIN ${rt.tableName} ${rt.alias} ON ${mainAlias}${rt.foreignKey} = ${rt.alias}.id`
    ).join(' ');

    // Construcción del WHERE si existe
    const where = whereClause ? `WHERE ${whereClause}` : '';

    // Construcción de la consulta SQL
    const query = `
      SELECT 
        ${mainFields}, 
        ${relatedFields}
      FROM ${mainTable.tableName} ${mainAlias}
      ${joins}
      ${where};
    `;

  //  console.log('Generated Query:', query);

    const rows = await db.getAllAsync(query);

    return rows;
  } catch (error) {
    console.error(`Failed to fetch data from ${mainTable.tableName} with related tables:`, error);
    return [];
  }
}


async update(
  tableName: string,
  fieldsToUpdate: { [field: string]: any },
  whereClause: [{ [field: string]: any }, string]
): Promise<void> {
  try {
    const db = await this.openDb();

    // Construcción de la parte SET para la consulta SQL
    const setClause = Object.keys(fieldsToUpdate)
      .map(field => `${field} = ?`)
      .join(', ');

    // Desestructuramos la cláusula WHERE y el condicional
    const [conditions, conditional] = whereClause;

    // Construcción de la parte WHERE para la consulta SQL
    const where = Object.keys(conditions)
      .map(field => `${field} = ?`)
      .join(` ${conditional} `);

    // Construcción de la consulta SQL
    const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE ${where};
    `;

    // Valores a usar en la consulta
    const values = [
      ...Object.values(fieldsToUpdate),
      ...Object.values(conditions)
    ];

    console.log('Generated Query:', query);
    console.log('where:', where);
    console.log('Generated Query:', values);
    await db.runAsync(query, values);
    console.log('Update successful!');
  } catch (error) {
    console.error(`Failed to update data in ${tableName}:`, error);
  }
}



async reset(){
   
   SQLite.deleteDatabaseAsync(DB_NAME);
}




}

export default Database;
