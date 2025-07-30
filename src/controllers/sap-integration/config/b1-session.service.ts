import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as https from 'https';
import { Model } from 'mongoose';
import {
  SapSession,
  SapSessionDocument,
} from 'src/schemas/common/sap-session.schema';

@Injectable()
export class B1SessionService {
  private readonly logger = new Logger(B1SessionService.name);

  constructor(
    @InjectModel(SapSession.name)
    private readonly sessionModel: Model<SapSessionDocument>,
  ) {}

  //!--> Login to SAP service layer using B1 service layer...............................|
  async login_toSAP() {
    const serviceLayerCredentials = {
      CompanyDB: process.env.SAP_DB,
      UserName: process.env.SAP_USER,
      Password: process.env.SAP_PWD,
    };

    try {
      const session = await axios.post(
        process.env.SAP_HOST + '/Login',
        serviceLayerCredentials,
        {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );

      return {
        session: session.data.SessionId,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //!--> Get active session token......................................................|
  async request_TOKEN() {
    const sap_connection = await this.sessionModel.findOne({ target: 'SAP' });

    const exist_sessionDate = new Date(sap_connection.date);
    const current_sessionDate = new Date();

    const timeGap = current_sessionDate.getTime() - exist_sessionDate.getTime();
    const difference = timeGap / (1000 * 60);

    if (difference > 26) {
      const sapConnection = await this.login_toSAP();

      const sessionData = {
        sessionToken: sapConnection.session,
        date: new Date(),
      };

      const updateSession = await this.sessionModel.updateOne(
        { target: 'SAP' },
        { $set: sessionData },
      );

      if (updateSession) {
        return sapConnection.session;
      }
    } else {
      return sap_connection.sessionToken;
    }
  }
}
