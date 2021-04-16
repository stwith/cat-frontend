/*
 * @Author: Aven
 * @Date: 2021-04-09 11:47:05
 * @LastEditors: Aven
 * @LastEditTime: 2021-04-16 16:37:18
 * @Description:
 */

import PWCore, {
  Web3ModalProvider,
  PwCollector,
  Address,
  Amount,
  AddressType,
  Builder,
  Cell,
  RawProvider
} from '@lay2/pw-core';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import supported from 'src/composition/chains';
import { ChainsModel, PWCoreData } from './interface';
import { useConfig } from './baseConfig';
import { getLiveCell } from './rpcApi';
import { CatCollector } from 'src/pw-code/catCollector';
let web3Modal: Web3Modal | undefined = undefined;
let web3: Web3 | undefined = undefined;
let pw: PWCore | undefined = undefined;
const chainId = 1;

export async function canCreateCell(): Promise<boolean> {
  try {
    const cell = await new CatCollector(useConfig().indexer_rpc).collect(
      PWCore.provider.address,
      {
        neededAmount: new Amount('1')
      }
    );
    console.log(cell);
    if (cell.length > 0) return false;
    return true;
  } catch (e) {
    return false;
  }
}

async function haveWeb3(): Promise<Web3> {
  if (web3) {
    console.log(web3.currentProvider);
    return web3;
  }
  const providerOptions = {};
  web3Modal = new Web3Modal({
    network: getNetwork(),
    cacheProvider: true,
    providerOptions
  });
  web3 = new Web3(await web3Modal.connect());
  return web3;
}
function getNetwork(): string {
  return getChainData(chainId).network;
}

function getChainData(chainId: number): ChainsModel {
  const chainData = supported.filter(chain => chain.chainId == chainId)[0];
  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }
  const API_KEY = '89a648e271d54224ba4827d348cbaa54'; // todo 不知道是什么的api key
  if (
    chainData.rpcUrl.includes('infura.io') &&
    chainData.rpcUrl.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpcUrl.replace('%API_KEY%', API_KEY);
    return {
      ...chainData,
      rpcUrl: rpcUrl
    };
  }
  return chainData;
}

export async function initPWCore(): Promise<PWCoreData> {
  // web3 = await haveWeb3();
  // if (!pw) {
  //   pw = await new PWCore(useConfig().ckb_test_net).init(
  //     new Web3ModalProvider(web3), // http://cellapitest.ckb.pw/
  //     // new PwCollector(useConfig().socket_url)
  //     new CatCollector(useConfig().indexer_rpc)
  //   );
  // }
  pw = await new PWCore(useConfig().ckb_test_net).init(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new RawProvider(
      '0xf1e3108bf3f36cb2a3ef980b0f0c57b43b8ca10fa9374dfba69cac26c8307411'
    ),
    new CatCollector(useConfig().indexer_rpc)
  );
  console.log(pw);
  const ethAddress = PWCore.provider.address.addressString;
  // 获取ckb 地址
  const address = PWCore.provider.address.toCKBAddress();
  // 获取账户余额
  console.log(address);
  const ckbBalance = await PWCore.defaultCollector.getBalance(
    PWCore.provider.address
  );
  let myCat = {};
  const cells = await getLiveCell(PWCore.provider.address);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (cells[0]) {
    const outputCell = new Cell(
      new Amount('200'),
      PWCore.provider.address.toLockScript()
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    outputCell.setHexData(cells[0].output_data);
    myCat = outputCell.getData();
  }
  return {
    ckbBalance,
    address,
    ethAddress,
    myCat
  };
}

export async function getPw(): Promise<PWCore> {
  console.log('=======console.log(pw);');
  web3 = await haveWeb3();
  if (!pw) {
    pw = await new PWCore(useConfig().ckb_test_net).init(
      new Web3ModalProvider(web3), // http://cellapitest.ckb.pw/
      new PwCollector(useConfig().socket_url)
    );
  }
  console.log(pw);
  return pw;
}
// 发起交易 todo buider
export async function send(address: string, amount: string): Promise<string> {
  if (!pw) return '';
  const ckbAddress = new Address(address, AddressType.ckb);
  console.log(ckbAddress);
  const txHash = await pw.send(ckbAddress, new Amount(amount));
  return txHash;
}

export async function sendTransaction(builder: Builder): Promise<string> {
  if (!pw) return '';
  console.log(builder);
  const txHash = await pw.sendTransaction(builder);
  return txHash;
}
