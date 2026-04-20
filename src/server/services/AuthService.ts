import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser, IUserInput, ILoginInput, IAuthResponse } from '../interfaces/IUser';

class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'payshield-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async register(userData: IUserInput): Promise<IAuthResponse> {
    
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw Object.assign(new Error('User already exists with this email'), { statusCode: 400 });
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(credentials: ILoginInput): Promise<IAuthResponse> {
    
    const user = await User.findOne({ email: credentials.email }).select('+password');
    if (!user) {
      throw Object.assign(new Error('Account not found. Please register to continue.'), { statusCode: 404 });
    }

    const isMatch = await user.comparePassword(credentials.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn as any }
    );
  }
}

export default AuthService;
