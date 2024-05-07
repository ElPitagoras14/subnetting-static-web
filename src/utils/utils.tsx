import { createTree, treeToStr, getD3Tree } from "@/libraries/subnetting/tree";

function castSubnet(
  subnet: SubnetResult,
  subnetTypeInfo: SubnetInfo
): SubnetTreeResult {
  const networks = subnet.networks;

  const tree = createTree(subnet);
  const d3Tree = getD3Tree(tree);
  const treeStr = treeToStr(tree, null, false);
  const result = {
    networks,
    treeStr: treeStr,
    subnetInfo: subnetTypeInfo,
    d3Tree: d3Tree,
  };
  console.log(result);
  return result;
}

function castFlsmInfo(subnet: any): SubnetResult {
  return castSubnet(subnet, subnet.subnetInfo);
}

function castVlsmInfo(subnet: any): SubnetResult {
  return castSubnet(subnet, subnet.subnetInfo);
}

export { castFlsmInfo, castVlsmInfo };

export const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
