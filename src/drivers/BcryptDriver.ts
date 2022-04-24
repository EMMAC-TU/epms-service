import bcrypt from 'bcrypt'

/**
 * 
 */
export class BcryptDriver {
    public constructor() {}

    /**
     * 
     * @param password 
     * @returns 
     */
    public async saltPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const saltedPassword = await bcrypt.hash(password, salt);

        return saltedPassword;
    }

    /**
     * 
     * @param loginPassword 
     * @param hashedPassword 
     * @returns 
     */
    public async comparePasswords(loginPassword: string, hashedPassword: string): Promise<boolean> {
        const arePasswordsSame = await bcrypt.compare(loginPassword, hashedPassword);
        return arePasswordsSame;
    }
}