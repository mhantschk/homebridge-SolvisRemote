const needle = require('needle');

import { PlatformConfig, Logger } from 'homebridge';

export class Solvisrequest {

  readonly urlLogin = 'http://cloud.linked-go.com:84/cloudservice/api/app/user/login.json';
  readonly urlDevicesList = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/deviceList.json';
  readonly urlDevicesData = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/getDataByCode.json';
  readonly urlUpdateDevice = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/control.json';
  readonly options = {
              username:this.config['user'],
              password:this.config['password'],
              auth:'digest',
              parse: 'xml'
          };
  constructor(
    public readonly config: PlatformConfig,
    public readonly log: Logger,
  ) {}

  createInstance() {
    return {};
  }

  Login() {

    return new Promise((resolve, reject) => {
      needle.get(
          url: this.config['url'],
          this.options,
         (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        
    });
  }
}  
