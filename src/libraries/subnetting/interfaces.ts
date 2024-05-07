interface SubnetInfo {
  initialIp: string;
  initialMask: number;
  n?: number;
  m?: number;
  numberOfNetworks?: number;
  numberOfHosts?: number;
  initialHostPerNetwork?: number[];
  hostPerNetwork?: number[];
}

interface Network {
  name: string;
  subnet: string;
  mask: number;
  firstIp: string;
  lastIp: string;
  broadcast: string;
}

interface SubnetResult {
  subnetInfo: SubnetInfo;
  networks: Network[];
}

interface SubnetTreeResult {
  networks: Network[];
  treeStr: string;
  subnetInfo: SubnetInfo;
  d3Tree: any;
}
