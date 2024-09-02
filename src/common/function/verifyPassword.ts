import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

  export const verifyPassword = async (
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    try {
      return await bcrypt.compare(rawPassword, hashedPassword);
    } catch (e: unknown) {
      const err = e as Error;
      throw new BadRequestException(err.message);
    }
  };