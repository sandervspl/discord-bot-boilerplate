declare module 'ascii-table';

declare namespace NodeJS {
  interface ProcessEnv {
    BOT_TOKEN: string;
    ADMIN_ID: string;
    BOT_ID: string;
    SERVERS: string;
  }
}
