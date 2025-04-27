import * as SecureStore from 'expo-secure-store';

export async function saveSecureItem(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving secure item [${key}]:`, error);
  }
}

export async function getSecureItem(key) {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    console.error(`Error reading secure item [${key}]:`, error);
    return null;
  }
}

export async function deleteSecureItem(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting secure item [${key}]:`, error);
  }
}
