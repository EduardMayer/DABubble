import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, StorageReference, deleteObject, getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageFirebaseService {
  constructor(private storage: Storage) {}
  

  /**
 * Uploads an image file to Firebase Storage and returns the download URL.
 * 
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded image.
 * @throws {Error} - If the file is invalid or has an unsupported type.
 */
  async uploadIMGFile(file: File): Promise<string> {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type');
    }

    const timestamp = new Date().getTime();
    const storageRef = ref(this.storage, 'Userpics/' + timestamp);

    try {
      await this.uploadFileToStorage(storageRef, file);
      const url = await this.getDownloadUrl(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  }


 /**
 * Uploads a file to Firebase Storage in the specified folder and returns the download URL.
 * 
 * @param {File} file - The file to be uploaded.
 * @param {string} folder - The folder in which the file will be stored.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded file.
 * @throws {Error} - If the file is invalid or has an unsupported type.
 */
  async uploadFile(file: File, folder: string): Promise<string> {
    const timestamp = new Date().getTime();
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      throw new Error('Invalid file type');
    }

    const fileName = `${file.name}_${timestamp}`;
    const storageRef = ref(this.storage, `${folder}/${fileName}`);
    try {
      const url = await this.uploadAndRetrieveUrl(storageRef, file);
      return url;
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw error;
    }
  }


  /**
 * Uploads a file to a specified Firebase Storage reference and returns the download URL.
 * 
 * @param {StorageReference} storageRef - The Firebase Storage reference where the file will be uploaded.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded file.
 */
  private async uploadAndRetrieveUrl(storageRef: StorageReference, file: File): Promise<string> {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
  
  /**
 * Deletes an image from Firebase Storage based on the provided image path.
 * 
 * @param {string} imagePath - The path of the image in Firebase Storage.
 * @returns {Promise<void>} - A promise that resolves when the image is successfully deleted.
 * @throws {Error} - If there is an error during the deletion process.
 */
  async deleteImage(imagePath: string): Promise<void> {
    try {
      const path = imagePath;
  
      const fileRef = ref(this.storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Fehler beim Löschen des Bildes: ', error);
      throw error;
    }
  }


  /**
 * Uploads a file to a specified Firebase Storage reference.
 * 
 * @param {StorageReference} storageRef - The Firebase Storage reference where the file will be uploaded.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully uploaded.
 */
  async uploadFileToStorage(storageRef: StorageReference, file: File): Promise<void> {
    await uploadBytes(storageRef, file);
  }

  /**
 * Retrieves the download URL for a file stored in Firebase Storage.
 * 
 * @param {StorageReference} storageRef - The Firebase Storage reference of the file.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the file.
 */
  async getDownloadUrl(storageRef: StorageReference): Promise<string> {
    return getDownloadURL(storageRef);
  }



  
}
