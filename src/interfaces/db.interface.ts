export interface dbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  pool: {
    min: number;
    max: number;
  };
}

export interface S3MediaConfig {
  host: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}
