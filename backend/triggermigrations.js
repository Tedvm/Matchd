import { appDataSource } from './datasource.js';

export async function triggerMigrations() {
  try {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize(); // important !
    }

    await appDataSource.runMigrations();
    console.log('Migrations applied.');
  } catch (err) {
    console.error('Error applying migrations:', err);
  }
}
