
export function truncateViewName(name, trunkLength){
  if(name.length > trunkLength){
    return name.substring(0, trunkLength - 1) + "...";
  }
  return name;
}
