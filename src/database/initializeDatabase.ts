import type { SQLiteDatabase } from "expo-sqlite";
import { seedCalmingMethods } from "../features/calmingMethods/data/seedCalmingMethods";

const DATABASE_VERSION = 1; //later nodig voor updates van de database. Als er een nieuwe versie van de database is, kan de app de database bijwerken naar de nieuwe versie zonder gegevens te verliezen. De versie wordt opgeslagen in de database zelf en kan worden opgehaald met PRAGMA user_version.

// Write-Ahead Logging (WAL) is een journaling-modus die de prestaties van de database kan verbeteren door gelijktijdige lees- en schrijfbewerkingen mogelijk te maken. In plaats van de hele database te vergrendelen tijdens een schrijfoperatie, schrijft WAL de wijzigingen naar een apart logbestand, waardoor andere processen de database kunnen blijven lezen terwijl er wordt geschreven.

export async function initializeDatabase(
    database: SQLiteDatabase,
): Promise<void> {
    await database.execAsync(`
    PRAGMA journal_mode = WAL; 
    PRAGMA foreign_keys = ON;
  `);

    const result = await database.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version",
    );

    const currentDatabaseVersion = result?.user_version ?? 0;

    if (currentDatabaseVersion < DATABASE_VERSION) {

        if (currentDatabaseVersion < 1) {
            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS calming_methods (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                image_type TEXT NOT NULL
                CHECK (image_type IN ('bundled', 'local')),
                image_reference TEXT NOT NULL,
                source TEXT NOT NULL
                CHECK (source IN ('catalog', 'custom')),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }

        await database.execAsync(
            `PRAGMA user_version = ${DATABASE_VERSION};`,
        );
    }

    await seedCalmingMethods(database);
}
