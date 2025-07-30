import { EmailSenderService } from './../../../config/services/email-sender/email-sender.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AwsS3BucketService } from 'src/config/services/aws-s3-bucket/aws-s3-bucket.service';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { Model } from 'mongoose';
import * as generator from 'generate-password';
import * as argon from 'argon2';
import * as fs from 'fs';
import { CheckUniquenessService } from 'src/config/services/uniqueness-checker/uniqueness-checker.service';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { statusChangerService } from 'src/config/services/status-changer/status-changer.service';
import { SystemLogService } from 'src/controllers/log-management/system-log/system-log.service';
import { EditLogService } from 'src/controllers/log-management/edit-log/edit-log.service';
import {
  CreateCheckUniqueStructure,
  UpdateCheckUniqueStructure,
} from 'src/config/services/uniqueness-checker/uniqueness-checker.interface';
import { UniqueCodeGeneratorInterface } from 'src/config/services/unique-code-generator/unique-code-generator.interface';
import { UserType } from 'src/config/enums/user-management/user.enum';
import { EmailSenderInterface } from 'src/config/services/email-sender/email-sender.interface';
import { SystemLogStructure } from 'src/controllers/log-management/system-log/dto/system-log-structure.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { FilterUserDto } from './dto/filter-user.dto';
import { StatusChangerInterface } from 'src/config/services/status-changer/status-changer.interface';
import { EditLogDto } from 'src/controllers/log-management/edit-log/dto/edit-log.dto';
import { EditLogOptions } from 'src/config/enums/log-management/edit-log.enum';
import { HiddenActionService } from 'src/controllers/web-socket/hidden-action/hidden-action.service';
import { EmailTemplateService } from 'src/config/templates/email.template';
import * as cheerio from 'cheerio';

@Injectable()
export class UserService {
  constructor(
    // DB models
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    // Common services
    private readonly checkUniquenessService: CheckUniquenessService,
    private readonly uniqueCodeGenetatorService: UniqueCodeGeneratorService,
    private readonly emailSenderService: EmailSenderService,
    private readonly paginationService: PaginationService,
    private readonly statusChangerService: statusChangerService,
    private readonly s3BucketService: AwsS3BucketService,
    private readonly hiddenActionService: HiddenActionService,

    // Exportable services
    private readonly systemLogService: SystemLogService,
    private readonly editLogService: EditLogService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  //!--> Create new user......................................................................|
  async createUser(dto: UserDto, files: any, userId: string) {
    //--------------------------------------------------------------------
    // Initialize data structure to check uniqueness | for create |-> name
    const name_checkingObject: CreateCheckUniqueStructure = {
      dataModel: this.userModel,
      key: 'name',
      value: dto.name,
      error: 'Name is exist!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(name_checkingObject);

    //---------------------------------------------------------------------
    // Initialize data structure to check uniqueness | for create |-> email
    const email_checkingObject: CreateCheckUniqueStructure = {
      dataModel: this.userModel,
      key: 'officeEmail',
      value: dto.officeEmail,
      error: 'E-mail is exist!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(email_checkingObject);

    //---------------------------------------------------------------------------
    // Initialize data structure to check uniqueness | for create |-> employee ID
    const empid_checkingObject: CreateCheckUniqueStructure = {
      dataModel: this.userModel,
      key: 'employeeId',
      value: dto.employeeId,
      error: 'Employee ID is exist!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(empid_checkingObject);

    // Generate a random password
    const password = await generator.generate({
      length: 8,
      numbers: true,
    });

    // Encrypt the password
    const encryptedPassword = await argon.hash(password);

    // Assign email template
    const tempString = await this.emailTemplateService.register_userPassword(
      dto.name,
      dto.employeeId,
      password,
    );

    const $ = cheerio.load(tempString);
    const modifiedHtml = $.html();

    // Compare with standard structure
    const emailData: EmailSenderInterface = {
      receiver: dto.officeEmail,
      heading: 'User account creation',
      template: modifiedHtml,
    };

    // Request to starting the mail service
    const mailStatus = await this.emailSenderService.sendEmail(emailData);

    if (!mailStatus) {
      throw new BadRequestException(
        'Sorry, password cannot be sent to this office email!',
      );
    }

    // Initialize data structure for creating unique code
    const uniqueCodeObject: UniqueCodeGeneratorInterface = {
      dataModel: this.userModel,
      prefix: 'USR-',
    };

    // Create new unique code
    const uniqueCode =
      await this.uniqueCodeGenetatorService.create_newUniqueCode(
        uniqueCodeObject,
      );

    // Upload images to AWS S3 bucket
    const imageUrls = await this.s3BucketService.uploadFiles(
      files.images,
      `Users/${uniqueCode.requestNumber}`,
    );

    // Initialize profile image
    const profileImageUrl: string = imageUrls[0];

    // Final user details with the encrypted password
    const newUser: User = {
      number: uniqueCode.requestNumber,
      userId: uniqueCode.requestId,
      ...dto,
      profileImage: profileImageUrl,
      type: UserType.MOBILE_USER,
      resetOtp: '',
      password: encryptedPassword,
    };

    // Initialize data structure for creating system log
    const systemLog: SystemLogStructure = {
      userId: userId,
      target: 'User',
      data: newUser,
      successMessage: 'User created successfully!',
      errorMessage: 'Cannot create this user!',
    };

    // Create system log and insert document
    return await this.systemLogService.add_toSystemLog(
      this.userModel,
      systemLog,
    );
  }

  //!--> Get users with pagination..........................................................|
  async getUsers(dto: FilterUserDto, pagination: PaginationStructure) {
    // Name searching matched given string
    if (dto.name) {
      const regex = new RegExp(dto.name, 'i');
      dto.name = regex;
    }

    // DB data filtering query
    const list = await this.userModel
      .find(dto)
      .populate({ path: 'role' })
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    // Get AWS images
    const userData = await Promise.all(
      list.map(async (item) => {
        // const profileImage = await this.s3BucketService.getSingleFile(
        //   item.profileImage,
        // );

        return {
          values: item,
          image:
            'https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png',
        };
      }),
    );

    //Pass to get pagination
    const currentPage: TablePaginationInterface = {
      data: userData,
      model: this.userModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    //-->
    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Get user for view.....................................................................|
  async getSingleUserForView(id: string) {
    // Find selected user | for view | with population
    const isExist = await this.userModel
      .findOne({ _id: id })
      .populate({ path: 'role' });

    // Handle error of existance
    if (!isExist) {
      throw new ConflictException('Cannot find this user!');
    }

    // // Get user profile image
    // const profileImage = await this.s3BucketService.getSingleFile(
    //   isExist.profileImage,
    // );

    // Update activated url, instead of key path
    isExist.profileImage =
      'https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png';

    //-->
    return isExist;
  }

  //!--> Get single user for edit..............................................................|
  async getSingleUserForEdit(id: string) {
    // Find selected user | for edit | no need populations
    const isExist = await this.userModel.findOne({ _id: id });

    // Handle error of existance
    if (!isExist) {
      throw new ConflictException('Cannot find this user!');
    }

    // Get user profile image
    // const profileImage = await this.s3BucketService.getSingleFile(
    //   isExist.profileImage,
    // );

    // Update activated url, instead of key path
    isExist.profileImage =
      'https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png';

    //-->
    return isExist;
  }

  //!--> Update user...........................................................................|
  async updateUser(id: string, dto: UserDto, files: any, userId: string) {
    // Check the availability
    const isExist = await this.userModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user!');
    }

    //----------------------------------------------------------------
    // Initialize data structure to check uniqueness | for Edit | name
    const name_checkingObject: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.userModel,
      key: 'name',
      value: dto.name,
      error: "This user's name is already exist!",
    };

    // Check for creating duplicate data | name
    await this.checkUniquenessService.compare_forUPDATE(name_checkingObject);

    //------------------------------------------------------------------------
    // Initialize data structure to check uniqueness | for Edit | office-email
    const email_checkingObject: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.userModel,
      key: 'officeEmail',
      value: dto.officeEmail,
      error: 'This email is already exist!',
    };

    // Check for creating duplicate data | office-email
    await this.checkUniquenessService.compare_forUPDATE(email_checkingObject);

    //-----------------------------------------------------------------------
    // Initialize data structure to check uniqueness | for Edit | employee-ID
    const empId_checkingObject: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.userModel,
      key: 'employeeId',
      value: dto.employeeId,
      error: 'This employee ID is already exist!',
    };

    // Check for creating duplicate data | employee-ID
    await this.checkUniquenessService.compare_forUPDATE(empId_checkingObject);

    // Create dummy data for updatable profile image
    let profileImageKey: string = isExist?.profileImage;

    // When incoming profile image exist, delete current path key
    if (files && files.images && files.images.length !== 0) {
      // Remove current key paths
      const removed = await this.s3BucketService.removeFiles([
        isExist.profileImage,
      ]);

      if (removed) {
        // Upload images to AWS S3 bucket
        const imageUrls = await this.s3BucketService.uploadFiles(
          files.images,
          `Users/${isExist.number}`,
        );

        // After saving new image, assing new key to updatable profile image
        profileImageKey = imageUrls[0];
      }
    }

    // Create updatable user object
    const updatingData = {
      ...dto,
      profileImage: profileImageKey,
    };

    // Initialize data structure for edit log
    const editLog: EditLogDto = {
      method: EditLogOptions.UPDATE_PROPERTIES,
      userId: userId,
      target: 'User',
      origin: id,
      data: updatingData,
      successMessage: 'User updated successfully!',
      errorMessage: 'Cannot update this user!',
    };

    //-->
    const response = await this.editLogService.add_toEditLog(
      this.userModel,
      editLog,
    );

    // Pass to trigger live action
    if (response.message) {
      await this.hiddenActionService.reload_when_userUpdatings(id);
    }

    return response;
  }

  //!--> Change user status....................................................................|
  async changeUserStatus(id: string, userId: string) {
    // Verify the logged user request
    if (id === userId) {
      throw new ConflictException('You cannot change your account!');
    }

    // Check user for change status
    const isExist = await this.userModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user!');
    }

    // Initialize data structure for change status
    const changeStatusModel: StatusChangerInterface = {
      targetId: isExist._id,
      target: 'user',
      dataModel: this.userModel,
      currentStatus: isExist.status,
    };

    //-->
    return await this.statusChangerService.changeStatus(changeStatusModel);
  }

  //!--> async delete user....................................................................|
  async deleteUser(id: string, userId: string) {
    //Verify the logged user request
    if (id === userId) {
      throw new ConflictException('You cannot delete your account!');
    }

    // Check the availability
    const isExist = await this.userModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user!');
    }

    // Request to delete
    const deleter = await this.userModel.deleteOne({ _id: id });

    // Handle deletion error
    if (deleter.deletedCount !== 1) {
      throw new BadRequestException('Cannot delete this user!');
    }

    //-->
    return { message: 'User deleted successfully!' };
  }
}
