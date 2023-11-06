import {
  BaseResponse,
  CreateCollectionRequest,
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

export { uploadFile, uploadCover, getURI, createCollection }
