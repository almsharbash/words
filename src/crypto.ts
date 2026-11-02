import * as crypto from 'crypto';

// وحدة التشفير وفك التشفير للأنابيب (E2EE Simulation)
export class SecureEncryptionCore {
    
    // توليد مفتاح سري عشوائي للأنبوب
    public static generateSessionKey(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    // تشفير محتوى الرسالة قبل إرسالها للأنبوب
    public static encryptPayload(secretKey: string, plainText: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // دمج الـ IV مع النص المشفر لضمان إمكانية فك التشفير لاحقاً
        return iv.toString('hex') + ':' + encrypted;
    }

    // فك تشفير الرسالة عند استلامها من الطرف الآخر
    public static decryptPayload(secretKey: string, encryptedData: string): string {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
