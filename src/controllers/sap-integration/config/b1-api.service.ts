import { ConflictException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { GetRequestStructure } from './interfaces/get-request.interface';
import { PostRequestStructure } from './interfaces/post-request.interface';
import { B1SessionService } from './b1-session.service';
import { PaginationRequestStructure } from './interfaces/pagination-request.interface';
import { PatchRequestStructure } from './interfaces/patch-request.interface';

@Injectable()
export class B1ApiService {
  constructor(private b1SessionService: B1SessionService) {}

  //!--> @GET()
  //!--> Get request to SAP............................................................|
  async request_GET(requestOptions: GetRequestStructure) {
    if (
      !requestOptions.logic ||
      requestOptions.logic === '' ||
      requestOptions.logic === null ||
      requestOptions.logic === undefined
    ) {
      delete requestOptions.logic;
    }

    const token = await this.b1SessionService.request_TOKEN();

    try {
      const getResponse = await axios.get(
        process.env.SAP_HOST + `/${requestOptions.path}` + requestOptions.logic,
        {
          headers: {
            Cookie: `B1SESSION=${token}`,
            'B1S-CaseInsensitive': true,
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );
      return getResponse.data.value;
      //!-->
    } catch (error) {
      console.log(error);
      throw new ConflictException(error.response.data.error.message);
    }
  }

  //!--> @POST()
  //!--> Post request to SAP................................................................|
  async request_POST(requestOptions: PostRequestStructure) {
    const token = await this.b1SessionService.request_TOKEN();

    try {
      const postResponse = await axios.post(
        process.env.SAP_HOST + `/${requestOptions.path}`,
        requestOptions.body,
        {
          headers: { Cookie: `B1SESSION=${token}` },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );

      return postResponse.data;
      //!-->
    } catch (error) {
      console.log(error);
      throw new ConflictException(error.response.data.error.message);
    }
  }

  //!--> @PATCH()
  //!--> Patch request to SAP...............................................................|
  async request_PATCH(requestOptions: PatchRequestStructure) {
    const token = await this.b1SessionService.request_TOKEN();

    try {
      const postResponse = await axios.patch(
        process.env.SAP_HOST +
          `/${requestOptions.path}('${requestOptions.id}')`,
        requestOptions.body,
        {
          headers: { Cookie: `B1SESSION=${token}` },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );

      return postResponse.data;
      //!-->
    } catch (error) {
      console.log(error);
      throw new ConflictException(error.response.data.error.message);
    }
  }

  //!--> @COUNT()
  //!--> Count request to SAP............................................................|
  async counting_GET(requestOptions: GetRequestStructure) {
    if (
      !requestOptions.logic ||
      requestOptions.logic === '' ||
      requestOptions.logic === null ||
      requestOptions.logic === undefined
    ) {
      delete requestOptions.logic;
    }

    const token = await this.b1SessionService.request_TOKEN();

    try {
      const getResponse = await axios.get(
        process.env.SAP_HOST + `/${requestOptions.path}` + requestOptions.logic,
        {
          headers: {
            Cookie: `B1SESSION=${token}`,
            'B1S-CaseInsensitive': true,
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      );
      return getResponse.data;
      //!-->
    } catch (error) {
      console.log(error);
      throw new ConflictException(error.response.data.error.message);
    }
  }

  //!--> @Pagination()
  //!--> Pagination request to SAP........................................................|
  async pagination_GET(requestOptions: PaginationRequestStructure) {
    const data_endpoint: GetRequestStructure = {
      path: requestOptions.path,
      logic:
        `?$top=${requestOptions.limit}&$skip=${requestOptions.skip}` +
        requestOptions.datalogic,
    };

    const dataCollection: any[] = await this.request_GET(data_endpoint);

    const counting_endPoint: GetRequestStructure = {
      path: requestOptions.path,
      logic: '/$count' + requestOptions.counterlogic,
    };

    const count: number = await this.counting_GET(counting_endPoint);

    return {
      data: dataCollection,
      dataCount: count,
      pageCount: Math.ceil(count / requestOptions.limit),
      currentPage: requestOptions.page,
    };
  }
}
