import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from 'src/shared/schema/users';
import config from 'config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import {
  conparePassword,
  generateHashPassword,
} from 'src/shared/utility/password-manager';
import { EmailService } from 'src/email/email.service';
import { generateAuthToken } from 'src/shared/utility/token-generator';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
    private readonly emailService: EmailService,
  ) {}
  // CREATE USER
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await generateHashPassword(
        createUserDto.password,
      );
      //check is it for admin
      if (
        createUserDto.type === UserType.ADMIN &&
        createUserDto.secretToken !== config.get('adminSecretToken')
      ) {
        throw new Error('Not allowed to create admin');
      } else {
        createUserDto.isVerified = true;
      }
      //user is already exist
      const user = await this.userDB.findOne({
        email: createUserDto.email,
      });

      if (user) {
        throw new Error('Email already exist');
      }
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);
      //create User
      const newUser = await this.userDB.create({
        ...createUserDto,
        isVerified: false,
        otp,
        otpExpiryTime,
      });
      if (newUser.type !== UserType.ADMIN) {
        await this.emailService.sendMail({
          email: createUserDto.email,
          subject: 'Activate your account!',
          template: './activation-mail',
          name: createUserDto.name,
          activationCode: otp,
        });
      }
      return {
        success: true,
        message: 'Please check,We sent the OTP code to your email',
        result: { email: newUser.email },
      };
    } catch (error) {
      throw error;
    }
  }
  //LOGIN USER
  async login(email: string, password: string) {
    try {
      const userExist = await this.userDB.findOne({ email: email });
      if (!userExist) {
        throw new Error('User not found');
      }
      if (!userExist.isVerified) {
        throw new Error('Please verify your email');
      }
      const isPasswordMatch = await conparePassword(
        password,
        userExist.password,
      );
      if (!isPasswordMatch) {
        throw new Error('Invalid Password');
      }
      const token = await generateAuthToken(userExist._id);
      return {
        success: true,
        message: 'Login successful',
        result: {
          user: {
            name: userExist.name,
            email: userExist.email,
            type: userExist.type,
            _id: userExist._id,
          },
          token: token,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  // VERIFY EMAIL
  async verifyEmail(otp: string, email: string) {
    try {
      const user = await this.userDB.findOne({ email: email });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.otp !== Number(otp)) {
        throw new Error('Invalid OTP');
      }
      if (new Date() > user.otpExpiryTime) {
        throw new Error('OTP expired');
      }
      user.isVerified = true;
      await user.save();
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  // FORGOT PASSWORD
  async forgotPassword(email: string) {
    try {
      const userExist = await this.userDB.findOne({ email });
      if (!userExist) {
        throw new Error('User not found');
      }
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);
      userExist.otp = otp;
      userExist.otpExpiryTime = otpExpiryTime;
      await userExist.save();
      await this.emailService.sendMail({
        email: userExist.email,
        subject: 'ForgotPassword Email',
        template: './forgot-password-email',
        name: userExist.name,
        activationCode: otp,
      });
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmForgot(data: any) {
    const { email, otp, password } = data;
    const userExist = await this.userDB.findOne({ email });
    if (!userExist) throw new Error('User not found');
    if (userExist.otp !== Number(otp)) {
      throw new Error('Invalid OTP,Please check your OTP');
    }

    if (new Date() > userExist.otpExpiryTime) {
      throw new Error('OTP expired, Please try again');
    }
    userExist.password = await generateHashPassword(password);
    userExist.isVerified = true;
    await userExist.save();
    return {
      success: true,
      message: 'Change password successfully',
    };
  }
  async findAll(type: string) {
    try {
      return {
        success: true,
        message: 'Get all users',
        result: await this.userDB.find({ type: type }),
      };
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userDB.updateOne(
      { _id: id },
      { $set: updateUserDto },
    );

    if (result.matchedCount > 0) {
      // Nếu có tài liệu khớp, lấy tài liệu đã cập nhậ

      const updatedUser = await this.userDB.findById(id);
      const { _id, name, email, type } = updatedUser;
      return {
        success: true,
        message: 'Get all users',
        result: { _id, name, email, type },
      };
    } else {
      throw new Error('User not found');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
