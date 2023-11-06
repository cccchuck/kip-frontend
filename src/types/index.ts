type Category = {
  label: string
  value: number
}

const categories: Category[] = [
  {
    label: 'Education',
    value: 1,
  },
  {
    label: 'Entertainment',
    value: 2,
  },
  {
    label: 'Sport',
    value: 3,
  },
  {
    label: 'Marketing',
    value: 4,
  },
  {
    label: 'Business',
    value: 5,
  },
  {
    label: "Developer's Tool",
    value: 6,
  },
  {
    label: 'Finance',
    value: 7,
  },
  {
    label: 'Lifestyle',
    value: 8,
  },
  {
    label: 'Academics',
    value: 9,
  },
  {
    label: 'Productivity',
    value: 10,
  },
  {
    label: 'Utility',
    value: 11,
  },
]

type BaseResponse<T> = {
  statusCode: number
  message: string
  data: T
}

type UploadRequest = FormData
type UploadResponse = string

type GetURIRequest = {
  name: string
  description: string
  category: number
  CID: string
}
type GetURIResponse = string

type CreateCollectionRequest = {
  collectionId: number
  cover: string
  fileKey: string
}

export { categories }

export type {
  Category,
  BaseResponse,
  UploadResponse,
  UploadRequest,
  GetURIRequest,
  GetURIResponse,
  CreateCollectionRequest,
}
