declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string;
    readonly PORT: string;
    readonly CORS_ORIGIN: string;
    readonly DBURL: string;
    readonly JWT_SECRET_KEY: string;
    readonly FRONTEND_URL: string;
    readonly USER_PASS: string;
    readonly USER_EMAIL: string;
    readonly TWILO_FROM: string;
    readonly TWILIO_AUTH_TOKEN: string;
    readonly ACCOUNT_SID: string;
    readonly FRONTEND_URL: string;
  }
}
