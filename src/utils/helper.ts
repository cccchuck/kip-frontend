export type CollectionTuple = [
  bigint,
  string,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
]

export type Collection = {
  id: bigint
  creator: string
  supply: bigint
  price: bigint
  royalty: bigint
  category: bigint
  queryCount: bigint
  mintCount: bigint
}

export const buildCollection = (collection: CollectionTuple): Collection => {
  return {
    id: collection[0],
    creator: collection[1],
    supply: collection[2],
    price: collection[3],
    royalty: collection[4],
    category: collection[5],
    queryCount: collection[6],
    mintCount: collection[7],
  }
}
