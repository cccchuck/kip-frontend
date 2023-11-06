import {
  AskRequest,
  AskResponse,
  BaseResponse,
  CreateCollectionRequest,
  GetAnswerRequest,
  GetAnswerResponse,
  GetCollectionsCoverResponse,
  GetURIRequest,
  GetURIResponse,
  UploadResponse,
} from '@/types'
import { HTTP } from '@/utils/requests'

const request = new HTTP({
  baseURL: 'http://localhost:3000',
  timeout: 10 * 1000,
})

const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return await request.post<BaseResponse<UploadResponse>>(
    '/file/uploadFile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

const uploadCover = async (file: File) => {
  const formData = new FormData()
  formData.append('cover', file)
  return await request.post<BaseResponse<UploadResponse>>(
    '/file/uploadCover',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

const getURI = async (data: GetURIRequest) => {
  return await request.post<BaseResponse<GetURIResponse>>(
    '/collection/getURI',
    data
  )
}

const createCollection = async (data: CreateCollectionRequest) => {
  return await request.post<BaseResponse<boolean>>(
    '/collection/createCollection',
    data
  )
}

const getCollectionsCover = async (data: { ids: number[] }) => {
  return await request.post<BaseResponse<GetCollectionsCoverResponse[]>>(
    '/collection/getCollectionsCover',
    data
  )
}

const ask = async (data: AskRequest) => {
  return await request.post<BaseResponse<AskResponse>>('/query/ask', data, {
    timeout: 20 * 1000,
  })
}

const getAnswer = async (data: GetAnswerRequest) => {
  return await request.post<BaseResponse<GetAnswerResponse>>(
    '/query/getAnswer',
    data
  )
}

export {
  uploadFile,
  uploadCover,
  getURI,
  createCollection,
  getCollectionsCover,
  ask,
  getAnswer,
}
