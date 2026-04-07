import bcrypt from 'bcrypt';
import cors from 'cors';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;
const SECRET = 'test_secret_key';
console.log("🚀 Server file started");

// 🚀 SIGNUP API
app.post('/auth/signup', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, identifier, password } = req.body;

        // 🔴 Validation
        if (!firstName || !lastName || !identifier || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🔴 Check if user exists
        const [existing]: any = await db.query(
            'SELECT id FROM users_auth WHERE identifier = ?',
            [identifier]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert user
        const [result]: any = await db.query(
            `INSERT INTO users_auth (first_name, last_name, identifier, password)
       VALUES (?, ?, ?, ?)`,
            [firstName, lastName, identifier, hashedPassword]
        );

        const userId = result.insertId;

        // 🔑 Generate JWT
        const token = jwt.sign(
            { id: userId, identifier },
            SECRET,
            { expiresIn: '1d' }
        );

        // ✅ FINAL RESPONSE (exact format you want)
        return res.json({
            token,
            user: {
                id: userId,
                firstName,
                lastName,
            },
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message || 'Server error',
        });
    }
});


// 🔐 LOGIN API
app.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        // 🔴 Validation
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identifier and password required' });
        }

        // 🔍 Find user
        const [users]: any = await db.query(
            'SELECT * FROM users_auth WHERE identifier = ?',
            [identifier]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = users[0];

        // 🔐 Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // 🔑 Generate JWT
        const token = jwt.sign(
            { id: user.id, identifier },
            SECRET,
            { expiresIn: '1d' }
        );

        // ✅ RESPONSE
        return res.json({
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
            },
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message || 'Server error',
        });
    }
});

// 🔐 OTP LOGIN API (NEW)
app.post('/auth/otp-login', async (req: Request, res: Response) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ message: 'Identifier required' });
        }

        // 🔍 Find user
        const [users]: any = await db.query(
            'SELECT * FROM users_auth WHERE identifier = ?',
            [identifier]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = users[0];

        // 🔑 Generate JWT
        const token = jwt.sign(
            { id: user.id, identifier },
            SECRET,
            { expiresIn: '1d' }
        );

        // ✅ RESPONSE
        return res.json({
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
            },
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message || 'Server error',
        });
    }
});

console.log("🚀 Server file started");

// ▶️ START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});