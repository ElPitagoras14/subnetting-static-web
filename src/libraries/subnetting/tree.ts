import { SubnettingNode, Trunk } from "./classes";
import { addHost } from "./utils";

function getData(networks: Network[]): [string[], number[], string[]] {
  const subnetList: string[] = [];
  const maskList: number[] = [];
  const nameList: string[] = [];

  for (const net of networks) {
    subnetList.push(net.subnet);
    maskList.push(net.mask);
    nameList.push(net.name);
  }
  return [subnetList, maskList, nameList];
}

function createRec(
  node: SubnettingNode,
  n: number,
  mask: number[],
  subnet: string[],
  name: string[]
): [SubnettingNode, number] {
  if (node.mask === mask[n]) {
    return [node, n + 1];
  }

  if (node.mask < mask[n]) {
    node.name = null;
    let [leftNode, n1] = createRec(
      new SubnettingNode(node.mask + 1, subnet[n], name[n]),
      n,
      mask,
      subnet,
      name
    );
    node.left = leftNode;
    if (n1 >= mask.length) {
      node.right = new SubnettingNode(
        node.mask + 1,
        addHost(subnet[n], Math.pow(2, 32 - node.mask - 1)),
        "Free Net"
      );
      return [node, n1 + 1];
    }
    let [rightNode, n2] = createRec(
      new SubnettingNode(node.mask + 1, subnet[n1], name[n1]),
      n1,
      mask,
      subnet,
      name
    );
    node.right = rightNode;
    return [node, n2];
  }

  if (node.mask > mask[n]) {
    node.name = "Dummy Net";
    return [node, n];
  }

  return [node, n];
}

function createTree(subnet: SubnetResult): SubnettingNode {
  const networks = subnet.networks;
  const mask = subnet.subnetInfo.initialMask;
  const subnetAddr = subnet.subnetInfo.initialIp;
  const root = new SubnettingNode(mask, subnetAddr);
  const [subnetList, maskList, nameList] = getData(networks);
  return createRec(root, 0, maskList, subnetList, nameList)[0];
}

function downloadTxtFile(text: string, filename: string): void {
  const element = document.createElement("a");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}

function saveTree(treeStr: string, filename: string = "tree.txt"): void {
  downloadTxtFile(treeStr, filename);
}

function showTrunks(p: Trunk | null, message: string[]): string[] {
  if (p === null) {
    return message;
  }
  showTrunks(p.prev, message);
  message.push(p.str!);
  return message;
}

function treeToStr(
  node: SubnettingNode | null,
  prev: Trunk | null = null,
  isRight: boolean = false
): string {
  let message = "";
  if (node === null) {
    return message;
  }

  let prevStr = "    ";
  const trunk = new Trunk(prev, prevStr);
  message += treeToStr(node.right, trunk, true);

  if (prev === null) {
    trunk.str = "———";
  } else if (isRight) {
    trunk.str = ".———";
    prevStr = "   |";
  } else {
    trunk.str = "`———";
    prev.str = prevStr;
  }

  message += showTrunks(trunk, []).join("");
  message += " " + node.toString() + "\n";

  if (prev) {
    prev.str = prevStr;
  }
  trunk.str = "   |";
  message += treeToStr(node.left, trunk, false);
  return message;
}

function getD3Tree(root: SubnettingNode | null): any {
    console.log(root);
  if (root === null) {
    return null;
  }

  const dictTmp: {
    name: string;
    attributes: { mask: number; subnet: string };
    children?: any[];
  } = {
    name: root.toString(),
    attributes: { mask: root.mask, subnet: root.subnet },
  };

  if (root.left !== null) {
    dictTmp.children = [getD3Tree(root.left), getD3Tree(root.right)];
  }

  return dictTmp;
}

export { Trunk, createTree, saveTree, treeToStr, getD3Tree };
