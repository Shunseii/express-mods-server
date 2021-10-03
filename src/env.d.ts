declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_SECRET_ACCESS_KEY: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_REGION: string;
    B2_ENDPOINT: string;
    B2_IMAGES_BUCKET_NAME: string;
    B2_FILES_BUCKET_NAME: string;
    COOKIE_SECRET: string;
    PORT: string;
    CORS_ORIGIN: string;
    REDIS_URL: string;
    TYPEORM_CONNECTION: string;
    TYPEORM_HOST: string;
    TYPEORM_USERNAME: string;
    TYPEORM_PASSWORD: string;
    TYPEORM_DATABASE: string;
    TYPEORM_PORT: string;
    TYPEORM_SYNCHRONIZE: string;
    TYPEORM_LOGGING: string;
    TYPEORM_ENTITIES: string;
    TYPEORM_MIGRATIONS: string;
    TYPEORM_MIGRATIONS_DIR: string;
    TYPEORM_SEEDING_FACTORIES: string;
    TYPEORM_SEEDING_SEEDS: string;
  }
}
