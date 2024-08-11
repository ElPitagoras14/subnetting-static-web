import {
  getPreviousIp,
  getNextIp,
  getPotentialBitNumber,
  addHost,
  isValidIp,
} from "./utils";
import {
  InvalidIPException,
  InsufficientHostsMaskException,
  InsufficientNetworkMaskException,
} from "./exceptions";

function networksFlsm(
  ip: string,
  mask: number,
  minNetworks: number
): SubnetResult {
  if (!isValidIp(ip)) {
    throw new InvalidIPException();
  }

  const parsedMinNetworks = parseInt(minNetworks.toString());
  const networkList: Network[] = [];
  const n = getPotentialBitNumber(parsedMinNetworks);
  const newMask = mask + n;
  const m = 32 - newMask;
  if (m < 0 || n < 0) {
    throw new InsufficientNetworkMaskException();
  }

  let initialIp = ip;

  for (let i = 0; i < Math.pow(2, n); i++) {
    const red = "Net " + (i + 1);
    const netTmp = {
      name: red,
      subnet: ip,
      mask: newMask,
      firstIp: getNextIp(ip),
    };
    ip = addHost(ip, Math.pow(2, m));
    const net: Network = {
      ...netTmp,
      broadcast: getPreviousIp(ip),
      lastIp: getPreviousIp(getPreviousIp(ip)),
    }
    networkList.push(net);
  }

  const subnet: SubnetResult = {
    subnetInfo: {
      initialIp: initialIp,
      initialMask: mask,
      n: n,
      m: m,
      numberOfNetworks: Math.pow(2, n),
      numberOfHosts: Math.pow(2, m),
    },
    networks: networkList,
  };
  return subnet;
}

function hostFlsm(ip: string, mask: number, minHost: number): SubnetResult {
  if (!isValidIp(ip)) {
    throw new InvalidIPException();
  }

  const parsedMinHost = parseInt(minHost.toString());
  const m = getPotentialBitNumber(parsedMinHost + 2);
  const n = 32 - mask - m;
  if (m < 0 || n < 0) {
    throw new InsufficientHostsMaskException();
  }
  return networksFlsm(ip, mask, Math.pow(2, n));
}

function hostVlsm(ip: string, mask: number, hostList: number[]): SubnetResult {
  if (!isValidIp(ip)) {
    throw new InvalidIPException();
  }

  const networkList: Network[] = [];
  const finalHostList: number[] = [];
  let cnt = 0;
  let totalHosts = hostList.reduce((acc: number, curr: number) => {
    const parsedCurr = parseInt(curr.toString());
    return acc + Math.pow(2, getPotentialBitNumber(parsedCurr + 2));
  }, 0);
  const m = getPotentialBitNumber(totalHosts);
  const n = 32 - mask - m;
  if (m < 0 || n < 0) {
    throw new InsufficientHostsMaskException();
  }

  let initialIp = ip;

  for (const host of hostList) {
    const parsedHost = parseInt(host.toString());
    const m = getPotentialBitNumber(parsedHost + 2);
    const n = 32 - mask - m;
    const newMask = mask + n;
    const red = "Net " + (cnt + 1);
    const netTmp = {
      name: red,
      subnet: ip,
      mask: newMask,
      firstIp: getNextIp(ip),
    };
    ip = addHost(ip, Math.pow(2, m));
    const net: Network = {
      ...netTmp,
      lastIp: getPreviousIp(getPreviousIp(ip)),
      broadcast: getPreviousIp(ip),
    }
    networkList.push(net);
    finalHostList.push(Math.pow(2, m));
    cnt++;
  }

  const subnet: SubnetResult = {
    subnetInfo: {
      initialIp: initialIp,
      initialMask: mask,
      initialHostPerNetwork: hostList,
      hostPerNetwork: finalHostList,
    },
    networks: networkList,
  };
  return subnet;
}

function orderedHostVlsm(
  ip: string,
  mask: number,
  hostList: number[]
): SubnetResult {
  if (!isValidIp(ip)) {
    throw new InvalidIPException();
  }

  const orderedList = hostList.slice().sort((a: number, b: number) => {
    const parsedA = parseInt(a.toString());
    const parsedB = parseInt(b.toString());
    return parsedB - parsedA;
  });
  return hostVlsm(ip, mask, orderedList);
}

export { networksFlsm, hostFlsm, hostVlsm, orderedHostVlsm };
