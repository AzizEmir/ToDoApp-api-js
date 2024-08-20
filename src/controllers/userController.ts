import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v6 as uuidv6 } from 'uuid';
import connectToDatabase from '../config/dbUser';

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<Response> => {
    console.log("[POST /user/register]");

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            data: null,
            error: "Missing required fields: username, password, email"
        });
    }

    try {
        const { collection } = await connectToDatabase();

        // Check if a user with the same username or email already exists
        const existingUser = await collection.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                data: null,
                error: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluştur
        const user = {
            id: uuidv6(), 
            username,
            password: hashedPassword,
            email
        };

        // Veritabanına kaydet
        await collection.insertOne(user);

        return res.status(201).json({
            data: "User registered successfully",
            error: null
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Registration error:", errorMessage); // Enhanced logging
        return res.status(500).json({
            data: null,
            error: errorMessage
        });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    console.log("[POST /user/login]");

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            data: null,
            error: "Missing required fields: username, password"
        });
    }

    try {
        const { collection } = await connectToDatabase();

        // Kullanıcıyı veritabanında kontrol et
        const user = await collection.findOne({ username });

        if (!user) {
            return res.status(404).json({
                data: null,
                error: "User not found"
            });
        }

        // Şifreyi doğrula
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                data: null,
                error: "Invalid password"
            });
        }

        // JWT oluştur
        const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.status(200).json({
            data: { token },
            error: null
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Login error:", errorMessage); // Enhanced logging
        return res.status(500).json({
            data: null,
            error: errorMessage
        });
    }
};