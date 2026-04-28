import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';

export interface UserCredential {
  _id: string;
  username: string;
  passwordHash: string;    
  token?: string;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {
  private db: any;

  constructor() {
    this.db = new PouchDB('auth_db');
    console.log('PouchDB initialized');
  }

  // Save credentials to PouchDB (for offline fallback)
  async saveCredentials(username: string, password: string, token: string): Promise<void> {
    const passwordHash = await this.hashPassword(password);
    const docId = `user_${username}`;

    try {
      const existing = await this.db.get(docId);
      await this.db.put({
        ...existing,
        username,
        passwordHash,
        token,
        lastLogin: new Date()
      });
    } catch (err: any) {
      if (err.status === 404) {
        await this.db.put({
          _id: docId,
          username,
          passwordHash,
          token,
          lastLogin: new Date()
        });
      } else {
        throw err;
      }
    }
  }

  // Validate credentials against PouchDB (offline login)
  async validateLocalCredentials(username: string, password: string): Promise<string | null> {
    try {
      const docId = `user_${username}`;
      const doc: UserCredential = await this.db.get(docId);
      const passwordHash = await this.hashPassword(password);

      if (doc.passwordHash === passwordHash) {
        return doc.token || null;   
      }
      return null;
    } catch (err) {
      return null;    
    }
  }

  // Delete credentials (logout)
  async clearCredentials(username: string): Promise<void> {
    try {
      const doc = await this.db.get(`user_${username}`);
      await this.db.remove(doc);
    } catch (err) {
      console.error('Error clearing credentials:', err);
    }
  }

  // Save hashed password using SHA-256
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}