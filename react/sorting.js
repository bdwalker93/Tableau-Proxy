export const SORT_OPTIONS = [{
  id: 'name',
  label: "Name",
},{
  id: 'ownerName',
  label: "Owner",
},{
  id: 'updatedAt',
  label: "Modified",
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

export function sort(sortId="name", orderId="asc") {
  ORDER_LIST = ORDER_LIST.filter(i=>i.field != sortId);

  ORDER_LIST = [{
    field: sortId,
    ascending: orderId === 'asc'
  }, ...ORDER_LIST];

  if (ORDER_LIST.length > 3)
    ORDER_LIST.pop()

  return ORDER_LIST;
}
