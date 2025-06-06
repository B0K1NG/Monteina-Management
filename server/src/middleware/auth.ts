import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const generateToken = (user: { id: number; email: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Prieiga uždrausta. Susisiekite su administratorium.' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Kažkas nutiko. Susisiekite su administratoriumi.' });
    }
  };

  export const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.user?.role !== role) {
        res.status(403).json({ error: 'Draudžiama. Nepakanka teisių.' });
        return;
      }
      next();
    };
  };
  