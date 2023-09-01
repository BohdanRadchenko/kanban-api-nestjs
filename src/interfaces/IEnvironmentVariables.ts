export interface IEnvironmentVariables {
	PORT: number;
	NODE_ENV: string;
	DB_HOST: string;
	DB_PORT: number;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	DB_NAME: string;
	JWT_ACCESS_SECRET: string;
	JWT_REFRESH_SECRET: string;
}
