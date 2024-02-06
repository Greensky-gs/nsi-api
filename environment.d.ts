declare global {
    namespace NodeJS {
        interface ProcessEnv {
            db: string;
            dbp: string;
            dbh: string;
            dbu: string;
        }
    }
}

export {}