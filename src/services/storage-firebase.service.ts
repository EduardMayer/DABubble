import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, StorageReference } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageFirebaseService {
  constructor(private storage: Storage) {}

  async uploadFile(file: File): Promise<string> {
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

  async uploadFileToStorage(storageRef: StorageReference, file: File): Promise<void> {
    await uploadBytes(storageRef, file);
  }

  async getDownloadUrl(storageRef: StorageReference): Promise<string> {
    return getDownloadURL(storageRef);
  }
}
