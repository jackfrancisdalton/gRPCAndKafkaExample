import { Injectable } from '@nestjs/common';
import * as Proto from '@repo/protos';

@Injectable()
export class AppService {
  /**
   * @returns {DateResponse} The current date formatted as an object.
   */
  getCurrentDate(): Proto.date.DateResponse {
    const now = new Date();
    return {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1, // JS months are 0-indexed
      day: now.getUTCDate(),
      iso: now.toISOString().split('T')[0] || "FAIL - TODO Handle this better",
    };
  }
}
