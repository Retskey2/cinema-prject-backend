import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {text: 'Hello, i am goobus!'};
  }
}
