
export const SORT_OPTIONS = [{
  id: 'name',
  label: "Name",
  sortLambda: (map, orderId) => (a,b) => {
    return stringComparator(orderId, map[a].name.toLowerCase(), map[b].name.toLowerCase())
  }
},{
  id: 'ownerName',
  label: "Owner",
  sortLambda: (map, orderId) => (a,b) => {
    return stringComparator(orderId, map[a].name.toLowerCase(), map[b].name.toLowerCase())
  }
},{
  id: 'updatedAt',
  label: "Modified",
  sortLambda: (map, orderId) => (a,b) => {
    let timeA = new Date(map[a].updatedAt);
    let timeB = new Date(map[b].updatedAt);
    let res = null;
    if (orderId === "asc") {
      res = timeB - timeA;
    } else {
      res = timeA - timeB;
    }
    console.log(timeA, timeB, res);
    return res;
  }
},{
  id: 'projectName',
  label: "Project",
  sortLambda: (map, orderId) => (a,b) => {
    return stringComparator(orderId, map[a].name.toLowerCase(), map[b].name.toLowerCase())
  }
}]

export const ORDER_OPTIONS = [{
  id: 'asc',
  label: "A-Z, Newer First",
},{
  id: 'desc',
  label: "Z-A, Older First",
}]

let ORDER_LIST = [
  { field:"name", ascending:true }
]

export function addSort(sortId="name", orderId="asc") {
  ORDER_LIST = ORDER_LIST.filter(i=>i.field != sortId);

  ORDER_LIST = [{
    field: sortId,
    ascending: orderId === 'asc'
  }, ...ORDER_LIST];

  if (ORDER_LIST.length > 3)
    ORDER_LIST.pop()

  return ORDER_LIST;
}

export function sortList(list, map, sortId="name", orderId="asc") {
  const sortOption = SORT_OPTIONS.find(i=>i.id===sortId);
  const sortLambda = sortOption.sortLambda(map, orderId);
  return  list.sort(sortLambda);
}


function stringComparator(orderId, str1, str2){
    if (orderId === "asc") {
      if(str1 < str2) return -1;
      if(str1  > str2) return 1;
      
      return 0;
    } else {
      if(str1 < str2) return 1;
      if(str1  > str2) return -1;
      
      return 0;
    }
}
