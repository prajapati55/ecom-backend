import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user.toJSON();
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      message: 'Logged in successfully',
      access_token: this.jwtService.sign(payload),
    };
  }
}
