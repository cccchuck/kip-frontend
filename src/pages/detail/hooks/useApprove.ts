import { KIPQueryAddress, KIPTokenAddress } from '@/config'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { approveABI } from '../config'
import { useState } from 'react'

export const useApprove = () => {
  const [allowanceAmount, setAllowanceAmount] = useState(0n)

  const { config } = usePrepareContractWrite({
    address: KIPTokenAddress,
    abi: approveABI,
    functionName: 'approve',
    args: [KIPQueryAddress, allowanceAmount],
  })

  const { data, write } = useContractWrite(config)

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  return { allowanceAmount, setAllowanceAmount, write, isSuccess, isLoading }
}
