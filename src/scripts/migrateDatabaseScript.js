import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
 
const migrateDatabase = async () => {
  try {
    console.log('Starting migration...');
    const querySnapshot = await getDocs(collection(db, 'user_roles'));
    const updatePromises = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.permissions && !Array.isArray(data.permissions)) {
        const arrayPermissions = Object.values(data.permissions)
          .filter(value => typeof value === 'string')
          .map(permission => permission.toLowerCase());

        updatePromises.push(
          updateDoc(doc.ref, {
            permissions: arrayPermissions
          })
        );
      }
    });

    await Promise.all(updatePromises);
    console.log(`Successfully migrated ${updatePromises.length} users`);
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// To run the migration:
// migrateDatabase();
