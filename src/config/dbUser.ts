import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB URI
const uri = 'mongodb://10.0.3.210:27017';
// MongoDB Client oluşturma
const client = new MongoClient(uri);

const connectToDatabase = async (): Promise<{ db: Db, collection: Collection }> => {
    try {
        // Bağlantıyı başlat
        await client.connect();
        console.log('MongoDB bağlantısı başarılı!');

        // Veritabanı ve koleksiyon ile etkileşimde bulunabilirsiniz
        const db: Db = client.db('express-ts');
        const collection: Collection = db.collection('user');

        return { db, collection };
    } catch (error) {
        console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
        throw error;
    }
};

export default connectToDatabase;