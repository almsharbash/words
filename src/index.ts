import { SecureEncryptionCore } from './crypto';

console.log("=== بدء تشغيل منصة المحادثة الآمنة والمشفرة ===");

interface SecureMessage {
    queueId: string;
    encryptedPayload: string;
    timestamp: number;
}

class MessageQueueSystem {
    private queues: Map<string, SecureMessage[]> = new Map();

    public createQueue(queueId: string): void {
        if (!this.queues.has(queueId)) {
            this.queues.set(queueId, []);
            console.log(`تم إنشاء أنبوب اتصال جديد بالمعرف: ${queueId}`);
        }
    }

    public sendMessage(queueId: string, secretKey: string, plainText: string): void {
        // تشفير الرسالة قبل وضعها في الأنبوب
        const encrypted = SecureEncryptionCore.encryptPayload(secretKey, plainText);
        
        const message: SecureMessage = {
            queueId,
            encryptedPayload: encrypted,
            timestamp: Date.now()
        };
        
        if (!this.queues.has(queueId)) {
            this.createQueue(queueId);
        }
        
        this.queues.get(queueId)?.push(message);
        console.log(`[إرسال] تم تشفير وإرسال الرسالة بنجاح إلى الأنبوب: ${queueId}`);
    }

    public receiveMessages(queueId: string, secretKey: string): void {
        const messages = this.queues.get(queueId) || [];
        console.log(`[استلام] فحص الرسائل في الأنبوب: ${queueId}`);
        
        messages.forEach((msg, index) => {
            // فك تشفير الرسالة عند الاستلام
            const decrypted = SecureEncryptionCore.decryptPayload(secretKey, msg.encryptedPayload);
            console.log(`الرسالة #${index + 1} بعد فك التشفير: "${decrypted}"`);
        });
    }
}

// اختبار النظام المتكامل
const chatSystem = new MessageQueueSystem();
const sessionKey = SecureEncryptionCore.generateSessionKey(); // توليد مفتاح سري فريد للجلسة

const testQueue = "secure_pipe_999";
chatSystem.createQueue(testQueue);

// إرسال رسالة مشفرة
chatSystem.sendMessage(testQueue, sessionKey, "مرحباً! هذا اختبار لنظام المحادثة المشفر الخاص بنا.");

// محاكاة استلام وقراءة الرسالة
chatSystem.receiveMessages(testQueue, sessionKey);
