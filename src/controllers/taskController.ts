import { Request, Response } from 'express';
import { v6 as uuidv6 } from 'uuid';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../config/dbTask';

interface UserPayload {
    userId: string;
}

// Yeni görev oluştur
export const createTask = async (req: Request, res: Response): Promise<Response> => {
    console.log("[POST /tasks]");

    const { title, description, completed } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            data: null,
            error: "Authorization header missing"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token'ı doğrula ve kullanıcı bilgilerini al
        const decoded = jwt.verify(token, 'your_jwt_secret') as UserPayload;
        const userId = decoded.userId;

        if (!title || !description || completed === undefined) {
            return res.status(400).json({
                data: null,
                error: "Missing required fields: title, description, completed"
            });
        }

        // Veritabanı bağlantısını kur
        const { db } = await connectToDatabase();
        const tasksCollection = db.collection('tasks');

        // Yeni görev oluştur
        const task = {
            id: uuidv6(),  // UUIDv6 ile id oluştur
            title,
            description,
            completed,
            userId // Kullanıcı ID'sini ekle
        };

        // Veritabanına kaydet
        await tasksCollection.insertOne(task);

        return res.status(201).json({
            data: "Task created successfully",
            error: null
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            data: null,
            error: errorMessage
        });
    }
};

// Tüm görevleri getir
export const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    console.log("[GET /tasks]");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            data: null,
            error: "Authorization header missing"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token'ı doğrula ve kullanıcı bilgilerini al
        const decoded = jwt.verify(token, 'your_jwt_secret') as UserPayload;
        const userId = decoded.userId;

        // Veritabanı bağlantısını kur
        const { db } = await connectToDatabase();
        const tasksCollection = db.collection('tasks');

        // Kullanıcıya ait görevleri bul
        const tasks = await tasksCollection.find({ userId }).toArray();

        return res.status(200).json({
            data: tasks,
            error: null
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            data: null,
            error: errorMessage
        });
    }
};

// Çoklu görevleri sil
export const deleteTasks = async (req: Request, res: Response) => {
    console.log("[DELETE /tasks]");

    const { ids } = req.body;

    // IDs doğrulama
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
            data: null,
            error: "An array of task IDs is required"
        });
    }

    try {
        const { collection } = await connectToDatabase();

        // Çoklu görevleri sil
        const result = await collection.deleteMany({ id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                data: null,
                error: "No tasks found with the provided IDs"
            });
        }

        res.status(200).json({
            data: `${result.deletedCount} task(s) deleted successfully`,
            error: null
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                data: null,
                error: error.message
            });
        } else {
            res.status(500).json({
                data: null,
                error: 'An unknown error occurred'
            });
        }
    }
};