import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { storage } from "../firebase";

export const uploadImage = async (file: File, path: string): Promise<string> => {
  if (!storage) {
    console.error("❌ Storage not initialized. Check your Firebase configuration.");
    throw new Error("Storage not initialized");
  }

  try {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    console.log(`🚀 Starting upload for: ${file.name} to ${path}/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📤 Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error("❌ Upload failed with error code:", error.code);
          console.error("❌ Upload failed with error message:", error.message);
          
          if (error.code === 'storage/retry-limit-exceeded') {
            console.error("❌ Retry limit exceeded. This often indicates a configuration issue (wrong bucket) or a network problem.");
          } else if (error.code === 'storage/unauthorized') {
            console.error("❌ Unauthorized. Check your Firebase Storage security rules.");
          }
          
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`✅ Upload successful! URL: ${downloadURL}`);
            resolve(downloadURL);
          } catch (err) {
            console.error("❌ Error getting download URL:", err);
            reject(err);
          }
        }
      );
    });
  } catch (error) {
    console.error("❌ Error in uploadImage wrapper:", error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[], path: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, path));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};
