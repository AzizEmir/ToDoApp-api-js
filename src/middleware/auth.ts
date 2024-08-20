import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    userId: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    data: null,
                    error: "Invalid token"
                });
            }

            req.user = decoded as UserPayload;
            next();
        });
    } else {
        return res.status(401).json({
            data: null,
            error: "Authorization header missing"
        });
    }
};