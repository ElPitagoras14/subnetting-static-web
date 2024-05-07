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

  const networkList: Network[] = [];
  const n = getPotentialBitNumber(minNetworks);
  const newMask = mask + n;
  const m = 32 - newMask;
  if (m < 0 || n < 0) {
    throw new InsufficientNetworkMaskException();
  }

  let initialIp = ip;

  for (let i = 0; i < Math.pow(2, n); i++) {
    const red = "Net " + (i + 1);
    const netTmp: Network = {
      name: red,
      subnet: ip,
      mask: newMask,
      firstIp: getNextIp(ip),
      lastIp: getPreviousIp(getPreviousIp(ip)),
      broadcast: getPreviousIp(ip),
    };
    ip = addHost(ip, Math.pow(2, m));
    networkList.push(netTmp);
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

  const m = getPotentialBitNumber(minHost + 2);
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
  let totalHosts = hostList.reduce(
    (acc, curr) => acc + Math.pow(2, getPotentialBitNumber(curr + 2)),
    0
  );
  const m = getPotentialBitNumber(totalHosts);
  const n = 32 - mask - m;
  if (m < 0 || n < 0) {
    throw new InsufficientHostsMaskException();
  }

  let initialIp = ip;

  for (const host of hostList) {
    const m = getPotentialBitNumber(host + 2);
    const n = 32 - mask - m;
    const newMask = mask + n;
    const red = "Net " + (cnt + 1);
    const netTmp: Network = {
      name: red,
      subnet: ip,
      mask: newMask,
      firstIp: getNextIp(ip),
      lastIp: getPreviousIp(getPreviousIp(ip)),
      broadcast: getPreviousIp(ip),
    };
    ip = addHost(ip, Math.pow(2, m));
    networkList.push(netTmp);
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

  const orderedList = hostList.slice().sort((a, b) => b - a);
  return hostVlsm(ip, mask, orderedList);
}

export { networksFlsm, hostFlsm, hostVlsm, orderedHostVlsm };
