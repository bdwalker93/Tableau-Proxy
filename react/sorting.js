export const SORT_OPTIONS = [{
  id: 'name',
  label: "Name",
  sortLambda: (map, orderId) => (a,b) => {
    console.log('A AND B', a, b);
    console.log(' THE MAP', map);
    if (orderId === "asc") {
      return map[a].name > map[b].name
    } else {
      return map[a].name < map[b].name
    }
  }
},{
  id: 'ownerName',
  label: "Owner",
},{
  id: 'updatedAt',
  label: "Modified",
  sortLambda: orderId => (a,b) => {
    if (orderId === "asc") {
      return new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()
    } else {
      return new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime()
    }
  }
},{
  id: 'projectName',
  label: "Project",
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
  return list.sort(sortLambda);
}
