import { Injectable, NestMiddleware } from '@nestjs/common';
import {Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        // Verify the token and attach the decoded payload (containing user ID) to the request object
        const decoded = this.jwtService.verify(token);
        req.user = { id: decoded.userId };
      } catch (error) {
        // Handle token verification error (e.g., invalid/expired token)
      }
    }

    next();
  }
}
