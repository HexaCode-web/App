import React from "react";

import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  listAll,
  uploadBytesResumable,
} from "firebase/storage";

import { con } from "./Conf.js";
import { SHA256 } from "crypto-js";

export const app = initializeApp(con);
export const db = getFirestore(app);
const storage = getStorage(app);

export const UPLOADVIDEO = async (path, photo, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, photo);

  // Subscribe to the "state_changed" event to track the upload progress
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress); // Pass the progress value to the provided onProgress callback
    },
    (error) => {
      throw new Error(`Error uploading photo: ${error.message}`);
    }
  );

  try {
    await uploadTask; // Wait for the upload to complete
    const url = await getDownloadURL(uploadTask.snapshot.ref);
    return url;
  } catch (error) {
    throw new Error(`Error getting download URL: ${error.message}`);
  }
};

export const UPLOADPHOTO = async (path, photoUri) => {
  try {
    // 1. Convert local URI to blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (error) {
        console.log(error);

        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", photoUri, true);
      xhr.send(null);
    });

    // 2. Get filename from URI
    const filename = photoUri.substring(photoUri.lastIndexOf("/") + 1);

    // 3. Create storage reference
    const storage = getStorage();
    const storageRef = ref(storage, path);

    // 4. Upload the blob
    const snapshot = await uploadBytes(storageRef, blob);

    // 5. Clean up the blob
    blob.close();

    // 6. Get download URL
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const EMPTYFOLDER = async (path) => {
  try {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);

    if (res.items.length > 0) {
      // Folder exists and contains items
      for (const itemRef of res.items) {
        await deleteObject(itemRef); // Delete each item
      }
    }
  } catch (error) {
    console.error("Error checking or deleting folder:", error);
  }
};

export const DELETEPHOTO = async (path) => {
  await deleteObject(ref(storage, path));
};
export const GETCOLLECTION = async (target) => {
  try {
    const cleanData = [];
    const srcData = await getDocs(collection(db, target));
    srcData.forEach((doc) => {
      const info = doc.data();
      cleanData.push(info);
    });
    return cleanData;
  } catch (error) {
    return error;
  }
};
export const GETCOLLECTIONFORBACKUP = async (target) => {
  try {
    const cleanData = [];
    const srcData = await getDocs(collection(db, target));
    srcData.forEach((doc) => {
      cleanData.push({
        id: doc.id,
        data: doc.data(), // Extract the document data
      });
    });
    return cleanData; // Return an array of documents with id and data
  } catch (error) {
    console.error(`Error fetching collection ${target}:`, error);
    throw error; // Ensure the error is propagated
  }
};

export const updateDB = async () => {
  try {
    await setDoc(doc(db, "DateUpdated", "DateUpdated"), {
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
export const BackUpDate = async () => {
  try {
    await setDoc(doc(db, "BackUpDate", "BackUpDate"), {
      BackUpDate: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
export const UPDATECOLLECTION = async (collectionName, data) => {
  try {
    const collectionRef = collection(db, collectionName); // Get a reference to the collection

    // Update each document in the collection
    for (const item of data) {
      const docRef = doc(collectionRef, String(item.id)); // Get a reference to the document
      await setDoc(docRef, item); // Update the document with the spread-out data
    }
    await updateDB();
  } catch (error) {
    console.error(`Error updating collection ${collectionName}:`, error);
    throw error;
  }
};
const saveVisitTimestamp = () => {
  localStorage.setItem("lastVisit", new Date().toISOString());
};

const getLastVisitTimestamp = () => {
  const lastVisit = localStorage.getItem("lastVisit");
  return lastVisit ? new Date(lastVisit) : null;
};

export const compareVisitTimestamps = async () => {
  const lastVisit = getLastVisitTimestamp();
  const currentVisit = new Date();
  let shouldFetchData = false;

  if (lastVisit) {
    const db = getFirestore();
    const dataUpdatedDoc = await getDoc(doc(db, "DateUpdated", "DateUpdated"));
    const dataUpdatedTimestamp = dataUpdatedDoc.exists()
      ? dataUpdatedDoc.data().updatedAt.toDate()
      : null;

    if (dataUpdatedTimestamp) {
      shouldFetchData =
        currentVisit > lastVisit && lastVisit < dataUpdatedTimestamp;
    }
  } else {
    // If no previous visit timestamp, assume new visit and fetch data
    shouldFetchData = true;
  }

  // Update the last visit timestamp
  saveVisitTimestamp();

  return shouldFetchData;
};
export const QUERY = async (collectionName, propertyInDB, operation, value) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(propertyInDB, operation, value)
    );

    const querySnapshot = await getDocs(q);

    const matches = [];

    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });

    return matches;
  } catch (error) {
    console.error("Error during query:", error);
    throw new Error("Error during query");
  }
};
export const REALTIME = (collection, id, setData) => {
  const docRef = doc(db, collection, id);
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    setData(snapshot.data());
  });

  return unsubscribe;
};
export const GETDOC = async (collection = String, id = Number) => {
  try {
    const docSnap = await getDoc(doc(db, collection, id.toString()));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  } catch (error) {
    return error;
  }
};
//      GETDOC("users", user.id).then((value) => { });
export function encrypt(str) {
  let shift = 3;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
export function hashPassword(password) {
  const salt = process.env.EXPO_PUBLIC_SALT;

  const saltedPassword = password + salt;
  return SHA256(saltedPassword).toString();
}

export const SETDOC = async (
  collection = "", // Default to empty string instead of String constructor
  id = "", // Added default value
  newValue = {}, // Default to empty object instead of Object constructor
  isNewDocument = false // Renamed from 'New' to be more descriptive
) => {
  if (!collection || !id) {
    throw new Error("Collection name and document ID are required");
  }

  try {
    const docRef = doc(db, collection, id.toString());

    if (isNewDocument) {
      // For new documents, just set the data
      await setDoc(docRef, newValue);
      return { success: true, message: "Document created successfully" };
    }

    // For existing documents, first check if it exists
    const res = await GETDOC(collection, id);
    if (res === "Error") {
      throw new Error(`No document found with ID: ${id}`);
    }

    // Update existing document
    await setDoc(docRef, newValue, { merge: true }); // Using merge to preserve other fields

    // Only call updateDB if it's defined and necessary
    if (typeof updateDB === "function") {
      await updateDB();
    }

    return { success: true, message: "Document updated successfully" };
  } catch (error) {
    console.error("Error in SETDOC:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
//         SETDOC("users", tempData.id, { ...tempData });

export const UPDATEDOC = async (collection = String, id, newData = Object) => {
  try {
    await updateDoc(doc(db, collection, id.toString()), newData);
    await updateDB();
  } catch (error) {
    console.log(error);
  }
};

export const DELETEDOC = async (collection = String, id = Number) => {
  try {
    await deleteDoc(doc(db, collection, id.toString()));
    await updateDB();
  } catch (error) {
    console.log(error);
  }
};
