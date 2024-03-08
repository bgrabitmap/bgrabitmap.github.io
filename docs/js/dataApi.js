import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js'

export async function getQuotes() {
  const db = getFirestore();
  return getDocs(collection(db, "quotes"));
}