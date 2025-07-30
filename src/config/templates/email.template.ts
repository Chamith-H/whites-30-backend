export class EmailTemplateService {
  //!--> Send first time password | User Creation.......................................|
  async register_userPassword(
    name: string,
    username: string,
    password: string,
  ) {
    const emailBody = `<div>
    <h4>Dear ${name},</h4>
    <p>Thank you for choosing our services! To ensure the security of your account, we require you to verify your verification</p>
    <p></p>

    <h4>Username : ${username}</h4>
    <h4>Password : ${password}</h4>

    <p>Once your email address has been successfully verified, you will gain access to all the features and benefits our platform has to offer. If you did not initiate this verification or believe it to be an error, please contact our support team immediately at [support email or phone number]. Note: For security reasons, please do not share this password with anyone. </p>

    <h4>Best regards </br> <p>CYOL</p></h4>
</div>`;

    return emailBody;
  }

  //!--> Send OTP Code | Forgot password | Email Verification...........................|
  async send_otpCode(name: string, otp: string) {
    const emailBody = `<div>
    <h4>Dear ${name},</h4>
    <p>Thank you for choosing our services! To ensure the security of your account, we require you to verify your verification</p>
    <p></p>

    <h4>OTP Code : ${otp}</h4>

    <p>Once your email address has been successfully verified, you will gain access to all the features and benefits our platform has to offer. If you did not initiate this verification or believe it to be an error, please contact our support team immediately at [support email or phone number]. Note: For security reasons, please do not share this password with anyone. </p>

    <h4>Best regards </br> <p>CYOL</p></h4>
</div>`;

    return emailBody;
  }

  //!--> Send new password | Forgot password...........................................|
  async send_newPassword(name: string, username: string, password: string) {
    const emailBody = `<div>
    <h4>Dear ${name},</h4>
    <p>Thank you for choosing our services! To ensure the security of your account, we require you to verify your verification</p>
    <p></p>

    <h4>Username : ${username}</h4>
    <h4>New Password : ${password}</h4>

    <p>Once your email address has been successfully verified, you will gain access to all the features and benefits our platform has to offer. If you did not initiate this verification or believe it to be an error, please contact our support team immediately at [support email or phone number]. Note: For security reasons, please do not share this password with anyone. </p>

    <h4>Best regards </br> <p>CYOL</p></h4>
</div>`;

    return emailBody;
  }
}
