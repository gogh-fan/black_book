import { MemoryStore } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
}

declare module 'express' {
  interface Request {
    sessionStore: MemoryStore;
  }
}
