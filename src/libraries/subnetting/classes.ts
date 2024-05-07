class SubnettingNode {
  mask: number;
  subnet: string;
  name: string | null;
  left: SubnettingNode | null;
  right: SubnettingNode | null;

  constructor(mask: number, subnet: string, name: string | null = null) {
    this.mask = mask;
    this.subnet = subnet;
    this.name = name;
    this.left = null;
    this.right = null;
  }

  toString(): string {
    if (this.name) {
      return `${this.mask}-${this.name}`;
    }
    return `${this.mask}`;
  }
}

class Trunk {
  prev: Trunk | null;
  str: string | null;

  constructor(prev: Trunk | null = null, string: string | null = null) {
    this.prev = prev;
    this.str = string;
  }
}

export { SubnettingNode, Trunk };
