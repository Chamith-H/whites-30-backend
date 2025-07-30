import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { JwtPayload } from './jwt/jwt.payload';
import { loginDto } from './dto/login.dto';
import * as generator from 'generate-password';
import * as argon from 'argon2';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { ValidatedUserDto } from './dto/validated-user.dto';
import { AwsS3BucketService } from 'src/config/services/aws-s3-bucket/aws-s3-bucket.service';
import { ActivatedUserDto } from './dto/activated-user.dto';
import { GetOtpDto } from './dto/get-otp.dto';
import { EmailSenderService } from 'src/config/services/email-sender/email-sender.service';
import { EmailSenderInterface } from 'src/config/services/email-sender/email-sender.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as cheerio from 'cheerio';
import { EmailTemplateService } from 'src/config/templates/email.template';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly s3BucketService: AwsS3BucketService,
    private readonly emailSenderService: EmailSenderService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  //!--> User login to web............................................................|
  async login(dto: loginDto) {
    // Get user according to username
    const user = await this.userModel.findOne({ userId: dto.username });

    // If no user -> 401
    if (!user) {
      throw new UnauthorizedException('Incorrect credentials!');
    }

    // Check password with argon
    const pwdMatches = await argon.verify(user.password, dto.password);

    // If unmatched password -> 401
    if (!pwdMatches) {
      throw new UnauthorizedException('Incorrect credentials!');
    }

    // Get validated user data
    const validatedUser: any = await this.userModel
      .findOne({ _id: user.id })
      .populate({ path: 'role', populate: { path: 'permissions' } });

    // If requred logics are not matched -> 401
    if (
      !validatedUser.status ||
      !validatedUser.role.status ||
      !validatedUser.role.permissions ||
      validatedUser.role.permissions.length === 0
    ) {
      throw new UnauthorizedException('Unauthorized access!');
    }

    // Get AWS-S3 profile image
    // const userProfileImage = await this.s3BucketService.getSingleFile(
    //   validatedUser.profileImage,
    // );

    // Create activated user object
    const activeUser: ActivatedUserDto = {
      userId: validatedUser._id,
      name: validatedUser.name,
      type: validatedUser.type,
      roleId: validatedUser.role._id,
      roleName: validatedUser.role.name,
      profileImage: 'https://cdn-icons-png.flaticon.com/512/9193/9193798.png',
    };

    // Fetch access permission numbers
    const permissionNumbers = validatedUser.role?.permissions?.map(
      (permission) => {
        return permission.permissionNo;
      },
    );

    // Create JWT payload
    const payload: JwtPayload = {
      id: user._id,
    };

    //-->
    return {
      jwtToken: await this.jwtService.sign(payload),
      userData: JSON.stringify(activeUser),
      accessNumbers: JSON.stringify(permissionNumbers),
    };
  }

  //!--> Validate user for request events..................................................|
  async validate(payload: JwtPayload) {
    // Get user according to DB_id
    const user: any = await this.userModel
      .findOne({ _id: payload.id })
      .populate({ path: 'role', populate: { path: 'permissions' } });

    // If user dont exist -> 401
    if (!user) {
      throw new UnauthorizedException('Unauthorized user!');
    }

    // If requred logics are not matched -> 401
    if (
      !user.status ||
      !user.role.status ||
      !user.role.permissions ||
      user.role.permissions.length === 0
    ) {
      throw new UnauthorizedException('Unauthorized access!');
    }

    // Fetch access permission numbers
    const permissionNumbers = user.role?.permissions?.map((permission) => {
      return permission.permissionNo;
    });

    // Required user details | for pass to RBAC-Role-Guard
    const validatedUser: ValidatedUserDto = {
      userId: user._id,
      name: user.name,
      type: user.type,
      roleId: user.role._id,
      roleName: user.role.name,
      permissions: permissionNumbers,
    };

    //-->
    return validatedUser;
  }

  //!--> Send reset OTP code..............................................................|
  async sendOtp(dto: GetOtpDto) {
    // Finnd user according to email
    const user: any = await this.userModel
      .findOne({ officeEmail: dto.email })
      .populate({ path: 'role' });
    if (!user) {
      throw new ConflictException('No users found!');
    }

    // Get AWS-S3 profile image
    const userProfileImage = await this.s3BucketService.getSingleFile(
      user.profileImage,
    );

    // Generate a random OTP code
    const otp = await generator.generate({
      length: 6,
      numbers: true,
      symbols: false,
      uppercase: false,
      lowercase: false,
    });

    // Update OTP code to user Document
    const updateOtpCode = await this.userModel.updateOne(
      { _id: user._id },
      { $set: { resetOtp: otp } },
    );

    if (updateOtpCode.modifiedCount !== 1) {
      throw new BadRequestException('Cannot generate OTP code!');
    }

    // Assign email template
    const tempString = await this.emailTemplateService.send_otpCode(
      user.name,
      otp,
    );

    const $ = cheerio.load(tempString);
    const modifiedHtml = $.html();

    // Compare with standard structure
    const emailData: EmailSenderInterface = {
      receiver: user.officeEmail,
      heading: 'One Time Password',
      template: modifiedHtml,
    };

    // Request to starting the mail service
    const mailStatus = await this.emailSenderService.sendEmail(emailData);

    if (!mailStatus) {
      throw new BadRequestException(
        'Sorry, password cannot be sent to this office email!',
      );
    }

    //-->
    return {
      userId: user._id,
      userName: user.name,
      role: user.role.name,
      email: user.officeEmail,
      profileImage: userProfileImage.url,
    };
  }

  //!--> Reset user password..................................................................|
  async resetPassword(dto: ResetPasswordDto) {
    // Check the user availability
    const user = await this.userModel.findOne({ _id: dto.id });
    if (!user) {
      throw new ConflictException('User not found!');
    }

    if (user.resetOtp !== dto.otp) {
      throw new ConflictException('Invalid OTP code!');
    }

    // Generate a random password
    const password = await generator.generate({
      length: 8,
      numbers: true,
    });

    // Encrypt the password
    const encryptedPassword = await argon.hash(password);

    // Assign email template
    const tempString = await this.emailTemplateService.send_newPassword(
      user.name,
      user.employeeId,
      password,
    );

    const $ = cheerio.load(tempString);
    const modifiedHtml = $.html();

    // Compare with standard structure
    const emailData: EmailSenderInterface = {
      receiver: user.officeEmail,
      heading: 'Password resetting',
      template: modifiedHtml,
    };

    // Request to starting the mail service
    const mailStatus = await this.emailSenderService.sendEmail(emailData);

    if (!mailStatus) {
      throw new BadRequestException(
        'Sorry, password cannot be sent to this office email!',
      );
    }

    // Update new password to the user
    const pwdUpdater = await this.userModel.updateOne(
      { _id: dto.id },
      { $set: { password: encryptedPassword } },
    );

    // Handle the error
    if (pwdUpdater.modifiedCount !== 1) {
      throw new BadRequestException('Cannot change this password!');
    }

    //-->
    return {
      message:
        'Password changed successfully! Your new password is sent to the E-mail',
    };
  }
}
