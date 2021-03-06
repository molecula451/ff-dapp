import {Injectable} from '@angular/core';
declare let require: any;
const Web3 = require('web3');
const contract = require('@truffle/contract');
import { DebugService } from './debug.service';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard'
import { environment } from 'src/environments/environment';

declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  
  //Block Native Options
  initializationOptions = {
    dappId: environment.BLOCK_NATIVE_KEY,
    networkId: 5,
    subscriptions: {
        wallet: wallet => {
            this.web3 = new Web3(wallet.provider)
        }
    }
  }

  constructor(private debugService: DebugService) {
    this.blockNativeOnboard(this.initializationOptions);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 1000));
        await delay;
        return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    this.log('artifactsToContract called');

    return contractAbstraction;
  }

  private async blockNativeOnboard(options) {
    const onboard = Onboard(options)
    await onboard.walletSelect();
    await onboard.walletCheck();
  }

  /** Log a OrgService message with the MessageService */
  private log(message: string) {
    this.debugService.add(`Web3Service: ${message}`);
  }

}