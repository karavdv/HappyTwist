import type { SQLiteDatabase } from "expo-sqlite";

import { CATALOG_CALMING_METHODS, } from "./catalogCalmingMethods";

export async function seedCalmingMethods(database: SQLiteDatabase,): Promise<void> {
  await database.withTransactionAsync(async () => {
    for (const method of CATALOG_CALMING_METHODS) {
      await database.runAsync(
        `
          INSERT INTO calming_methods (
            id,
            name,
            source
          )
          VALUES (?, ?, ?) --om problemen te voorkomen met speciale tekens, zoals apostrof, of SQL-injecte, worden de waarden als parameters doorgegeven in plaats van direct in de SQL-query te plaatsen.

          ON CONFLICT(id) DO UPDATE SET --gezien kleine database voldoende maar verder opzoeken over filtering met CASE om enkel de waarden aan te passen die effectief verschillen.
            name = excluded.name,
            updated_at = CURRENT_TIMESTAMP

          WHERE
            calming_methods.source = 'catalog'
            AND calming_methods.name IS NOT excluded.name;
        `,
        [
          method.id,
          method.name,
          method.source,
        ],
      );
    }

    for (const method of CATALOG_CALMING_METHODS) {
      for (const media of method.media) {
        await database.runAsync(
          `
          INSERT INTO calming_method_media (
            id,
            calming_method_id,
            media_type,
            storage_type,
            media_reference,
            purpose,
            variant_group,
            sort_order,
            duration_ms,
            metadata_json
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

          ON CONFLICT(id) DO UPDATE SET
            calming_method_id =
              excluded.calming_method_id,
            media_type =
              excluded.media_type,
            storage_type =
              excluded.storage_type,
            media_reference =
              excluded.media_reference,
            purpose =
              excluded.purpose,
            variant_group =
              excluded.variant_group,
            sort_order =
              excluded.sort_order,
            duration_ms =
              excluded.duration_ms,
            metadata_json =
              excluded.metadata_json,
            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            calming_method_media.calming_method_id
              IS NOT excluded.calming_method_id
            OR calming_method_media.media_type
              IS NOT excluded.media_type
            OR calming_method_media.storage_type
              IS NOT excluded.storage_type
            OR calming_method_media.media_reference
              IS NOT excluded.media_reference
            OR calming_method_media.purpose
              IS NOT excluded.purpose
            OR calming_method_media.variant_group
              IS NOT excluded.variant_group
            OR calming_method_media.sort_order
              IS NOT excluded.sort_order
            OR calming_method_media.duration_ms
              IS NOT excluded.duration_ms
            OR calming_method_media.metadata_json
              IS NOT excluded.metadata_json;
        `,
          [
            media.id,
            method.id,
            media.mediaType,
            media.storageType,
            media.mediaReference,
            media.purpose,
            media.variantGroup,
            media.sortOrder,
            media.durationMs,
            media.metadataJson,
          ],
        );
      }
    }
  });

}