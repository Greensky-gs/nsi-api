declare global {
    namespace NodeJS {
        interface ProcessEnv {
            db: string;
            dbp: string;
            dbh: string;
            dbu: string;
            port: string;
        }
    }
}

export {}