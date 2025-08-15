import * as admin from "firebase-admin";

const db = admin.firestore();

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface Translation {
  id: string;
  koreanText: string;
  englishText: string;
  emotionalFocus: string;
  usedAI: boolean;
  createdAt: Date;
}

export interface DailyUsage {
  date: string;
  usersCount: number;
  maxUsers: number;
  lastReset: Date;
}

export class FirestoreStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as User : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const query = await db.collection('users').where('username', '==', username).limit(1).get();
    if (query.empty) return undefined;
    const doc = query.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const docRef = await db.collection('users').add({
      ...userData,
      createdAt: new Date()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as User;
  }

  async createTranslation(translationData: Omit<Translation, 'id' | 'createdAt'>): Promise<Translation> {
    const docRef = await db.collection('translations').add({
      ...translationData,
      createdAt: new Date()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Translation;
  }

  async getDailyUsage(date: string): Promise<DailyUsage | undefined> {
    const doc = await db.collection('daily_usage').doc(date).get();
    return doc.exists ? doc.data() as DailyUsage : undefined;
  }

  async incrementDailyUsage(date: string): Promise<void> {
    const docRef = db.collection('daily_usage').doc(date);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      
      if (!doc.exists) {
        transaction.set(docRef, {
          date,
          usersCount: 1,
          maxUsers: 125,
          lastReset: new Date()
        });
      } else {
        const currentCount = doc.data()?.usersCount || 0;
        transaction.update(docRef, {
          usersCount: currentCount + 1
        });
      }
    });
  }

  async resetDailyUsage(date: string): Promise<void> {
    const docRef = db.collection('daily_usage').doc(date);
    await docRef.set({
      date,
      usersCount: 0,
      maxUsers: 125,
      lastReset: new Date()
    }, { merge: true });
  }
}

export const storage = new FirestoreStorage();