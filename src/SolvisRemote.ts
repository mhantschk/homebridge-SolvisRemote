import {AccessoryPlugin, API, HAP, Logging, PlatformConfig, StaticPlatformPlugin,} from "homebridge";
import {ExampleSwitch} from "./switch-accessory";
import {SolvisRequest} from './utils/Solvisrequest';

const PLATFORM_NAME = "SolvisRemote";

/*
 * IMPORTANT NOTICE
 *
 * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the "hap-nodejs" module).
 * The above import block may seem like, that we do exactly that, but actually those imports are only used for types and interfaces
 * and will disappear once the code is compiled to Javascript.
 * In fact you can check that by running `npm run build` and opening the compiled Javascript file in the `dist` folder.
 * You will notice that the file does not contain a `... = require("homebridge");` statement anywhere in the code.
 *
 * The contents of the above import statement MUST ONLY be used for type annotation or accessing things like CONST ENUMS,
 * which is a special case as they get replaced by the actual value and do not remain as a reference in the compiled code.
 * Meaning normal enums are bad, const enums can be used.
 *
 * You MUST NOT import anything else which remains as a reference in the code, as this will result in
 * a `... = require("homebridge");` to be compiled into the final Javascript code.
 * This typically leads to unexpected behavior at runtime, as in many cases it won't be able to find the module
 * or will import another instance of homebridge causing collisions.
 *
 * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `hap` property
 * of the api object, which can be acquired for example in the initializer function. This reference can be stored
 * like this for example and used to access all exported variables and classes from HAP-NodeJS.
 */
let hap: HAP;

export = (api: API) => {
  hap = api.hap;

  api.registerPlatform(PLATFORM_NAME, SolvisRemote);
};

class SolvisRemote implements StaticPlatformPlugin {
public Token = '';
 

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
    ) {
    this.log = log;

    // probably parse config or something here
   
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      log.debug(SolvisRequest);
      this.Token = this.getToken(true);
    });
  
    log.info("SolvisRemote platform finished initializing!");
    
  }

  /*
   * This method is called to retrieve all accessories exposed by the platform.
   * The Platform can delay the response my invoking the callback at a later time,
   * it will delay the bridge startup though, so keep it to a minimum.
   * The set of exposed accessories CANNOT change over the lifetime of the plugin!
   */
  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback([
      new ExampleSwitch(hap, this.log, "Switch 1"),
      new ExampleSwitch(hap, this.log, "Switch 2"),
    ]);
  }

   getToken(start:boolean): string {
   
      this.log.debug('getToken');
   
      //const SolvisRequest = new SolvisRequest(this.config, this.log);

      SolvisRequest.Login().then((results)=> {

        if (results!==undefined) {

          this.log(results);

                  } else {
          this.log.error('Error login in!');
        }

      });
    

    return '';
  }  
  
}
