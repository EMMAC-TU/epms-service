import bcrypt from 'bcrypt'

/**
 * Driver for the Bcrypt Class
 */
export class BcryptDriver {
    public constructor() {}

    /**
     * Salts a password
     * @param password Password to salt
     * @returns A salted password
     */
    public async saltPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const saltedPassword = await bcrypt.hash(password, salt);

        return saltedPassword;
    }

    /**
     * Compares a password to a salted password
     * @param loginPassword The text password
     * @param hashedPassword The hashed password to compare to
     * @returns True if the passwords are the same, false otherwise
     */
    public async comparePasswords(loginPassword: string, hashedPassword: string): Promise<boolean> {
        const arePasswordsSame = await bcrypt.compare(loginPassword, hashedPassword);
        return arePasswordsSame;
    }
}