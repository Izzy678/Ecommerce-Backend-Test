import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    return new Promise((resolve) => {
      bcrypt.hash(password, 10, (err: Error, hash: string) => {
        if (err) throw new BadRequestException(err.message);
        resolve(hash);
      });
    });
  };
  
