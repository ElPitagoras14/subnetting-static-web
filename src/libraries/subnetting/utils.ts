function decimalToBinary(decimal: string): string {
  const num = parseInt(decimal);
  return num.toString(2);
}

function binaryToDecimal(binary: string): string {
  return parseInt(binary, 2).toString();
}

function getPotentialBitNumber(number: number): number {
  return Math.ceil(Math.log2(number));
}

function castOctetsToInt(ip: string): number[] {
  const octets = ip.split(".");
  return octets.map((octet) => parseInt(octet));
}

function castOctetsToStr(octetsList: number[]): string[] {
  return octetsList.map((octet) => octet.toString());
}

function addHost(ip: string, host: number): string {
  const octets = castOctetsToInt(ip);
  octets[3] += host;
  for (let i = 3; i > 0; i--) {
    let tmp = octets[i];
    if (tmp > 255) {
      octets[i - 1] += 1;
      octets[i] = 0;
    }
  }
  return castOctetsToStr(octets).join(".");
}

function getPreviousIp(ip: string): string {
  const octets = castOctetsToInt(ip);
  octets[3] -= 1;
  for (let i = 3; i > 0; i--) {
    let tmp = octets[i];
    if (tmp < 0) {
      octets[i - 1] -= 1;
      octets[i] = 255;
    }
  }
  return castOctetsToStr(octets).join(".");
}

function getNextIp(ip: string): string {
  const octets = castOctetsToInt(ip);
  octets[3] += 1;
  for (let i = 3; i > 0; i--) {
    let tmp = octets[i];
    if (tmp > 255) {
      octets[i - 1] += 1;
      octets[i] = 0;
    }
  }
  return castOctetsToStr(octets).join(".");
}

function isValidIp(ip: string): boolean {
  const octets = castOctetsToInt(ip);
  if (octets.length !== 4) {
    return false;
  }
  for (const octet of octets) {
    if (octet < 0 || octet > 255) {
      return false;
    }
  }
  return true;
}

export {
  decimalToBinary,
  binaryToDecimal,
  getPotentialBitNumber,
  castOctetsToInt,
  castOctetsToStr,
  addHost,
  getPreviousIp,
  getNextIp,
  isValidIp,
};
