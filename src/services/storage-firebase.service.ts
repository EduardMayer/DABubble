import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, StorageReference, deleteObject, getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageFirebaseService {
  constructor(private storage: Storage) {}
  

  async uploadIMGFile(file: File): Promise<string> {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type');
    }

    const timestamp = new Date().getTime();
    const storageRef = ref(this.storage, 'Userpics/' + timestamp);

    try {
      await this.uploadFileToStorage(storageRef, file);
      const url = await this.getDownloadUrl(storageRef);
      console.log('File URL:', url);
      return url;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  }


  async uploadFile(file: File): Promise<string> {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'application/pdf') {
      throw new Error('Only images and PDFs can be uploaded.');
    }
    const storageRef = ref(this.storage, 'files/' + file.name);
  
    try {
      await this.uploadFileToStorage(storageRef, file);
      const url = await this.getDownloadUrl(storageRef);
      console.log('File URL:', url);
      return url;
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw error;
    }
  }

  async getPreviewImageUrl(file: File): Promise<string> {
    const storageRef = ref(this.storage, 'files/' + file.name);
  
    try {
      const url = await this.getDownloadUrl(storageRef);
      return url;
    } catch (error) {
      console.error('Error getting preview image URL: ', error);
      throw error;
    }
  }


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


  async uploadFileToStorage(storageRef: StorageReference, file: File): Promise<void> {
    await uploadBytes(storageRef, file);
  }

  async getDownloadUrl(storageRef: StorageReference): Promise<string> {
    return getDownloadURL(storageRef);
  }

  
}
