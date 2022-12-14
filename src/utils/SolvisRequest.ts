const request = require('needle');

import { PlatformConfig, Logger } from 'homebridge';

export class SolvisRequest {

  readonly urlLogin = 'http://cloud.linked-go.com:84/cloudservice/api/app/user/login.json';
  readonly urlDevicesList = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/deviceList.json';
  readonly urlDevicesData = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/getDataByCode.json';
  readonly urlUpdateDevice = 'http://cloud.linked-go.com:84/cloudservice/api/app/device/control.json';

  constructor(
    public readonly config: PlatformConfig,
    public readonly log: Logger,
  ) {}

  createInstance() {
    return {};
  }

  
  Login() {
    this.log('Login call');
    return new Promise((resolve, reject) => {
      request.get(
          this.config['url'],
        {
            username: this.config['username'],
            password: this.config['password'],
            auth: 'digest',
            parse: 'xml'
          },
         (error, headers, response, body) => {         
          if (error) {
            reject(error);
          } else if (response.statusCode === 401) {
            reject('NotLoggedIn');
          } else {
            this.log('Erfolg: Login');
            resolve(response);
          }
        });
    });
  }
  
  
//  Login() {
//    this.log('Login call');
//    return new Promise((resolve, reject) => {
//      request.get(
//          this.config['url'],
//          {
//            username: this.config['username'],
//            password: this.config['password'],
//            auth: 'digest',
//            parse: 'xml'
//          },
//         (error, headers, response, body) => {
//           if (response.statusCode === 401) {
//            reject('NotLoggedIn');
//          }
//          if (error) {
//            reject(error);
//          } else {
//            this.log('Erfolg: ' + response.headers);
//            resolve(headers);
//          }
//        });
//    });
//  }
  
getSolvisXML() {
    this.log('getSolvisXML');
    return new Promise((resolve, reject) => {
      request.get(
          this.config['xml'],
          {
            parse: 'xml'
          },
         (error, headers, response, body) => {
          if (error) {
            reject(error);
          } else if (headers.statusCode === 401) {
            this.log('Not logged in --> Login');
            this.Login().then((results)=> {
        if (results!==undefined) {
          this.log(results);
          this.log('XML erfolgreich');
                  } else {
          this.log.error('Error login in!');
        }
      });
          } else {
            this.log('Erfolg XML: ');
      //      resolve(body.children[0].value);
      //      resolve(body);
            resolve(headers);
          }
        });
    });
  }
  GetDeviceList(token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlDevicesList,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  GetDeviceStatus(deviceCode: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlDevicesData,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            device_code: deviceCode,
            protocal_codes: ['T02', 'T05', 'T12', 'R02', 'power', 'Manual-mute'],
          },
          json: true,
        }, (error, response, body) => {

          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            //this.log.error('error');
            reject(error);
          } else {
            //this.log.error(response);
            resolve(body);
          }
        });
    });
  }

  ChangePowerOfDevice(deviceCode: string, turnOn: boolean, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: turnOn? '1':'0',
              protocol_code: 'Power',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  ChangeTargetTemperatureOfDevice(deviceCode: string, value: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: value,
              protocol_code: 'R02',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  ChangeSilenceModeOfDevice(deviceCode: string, value: string, token: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlUpdateDevice,
          method: 'POST',
          headers: {
            'x-token': token,
          },
          body: {
            param: [{
              device_code: deviceCode,
              value: value,
              protocol_code: 'Manual-mute',
            }],
          },
          json: true,
        }, (error, response, body) => {
          if (response.statusCode === 401) {
            reject('NotLoggedIn');
          }

          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

}
