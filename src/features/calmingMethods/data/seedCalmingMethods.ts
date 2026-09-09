import type { SQLiteDatabase } from "expo-sqlite";

import { CATALOG_CALMING_METHODS } from "./catalogCalmingMethods";

export async function seedCalmingMethods( database: SQLiteDatabase,): Promise<void> {
  await database.withTransactionAsync(async () => {
    for (const method of CATALOG_CALMING_METHODS) {
      await database.runAsync(
        `
          INSERT INTO calming_methods (
            id,
            name,
            image_type,
            image_reference,
            source
          )
          VALUES (?, ?, ?, ?, ?) --om problemen te voorkomen met speciale tekens, zoals apostrof, of SQL-injecte, worden de waarden als parameters doorgegeven in plaats van direct in de SQL-query te plaatsen.
          ON CONFLICT(id) DO UPDATE SET --gezien kleine database voldoende maar verder opzoeken over filtering met CASE om enkel de waarden aan te passen die effectief verschillen.
            name = excluded.name,
            image_type = excluded.image_type,
            image_reference = excluded.image_reference,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            calming_methods.name <> excluded.name
            OR calming_methods.image_type <> excluded.image_type
            OR calming_methods.image_reference <> excluded.image_reference;
        `,
        method.id,
        method.name,
        method.imageType,
        method.imageReference,
        method.source,
      );
    }
  });
}