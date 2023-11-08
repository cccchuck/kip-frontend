import { KIPQueryAddress } from '@/config'
import { useContractWrite } from 'wagmi'
import { withdrawABI } from '../config'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export const useWithdraw = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const withdrawAmountDebounced = useDebounce(withdrawAmount, 500)

  const { write, isLoading, isSuccess } = useContractWrite({
    address: KIPQueryAddress,
    abi: withdrawABI,
    functionName: 'withdraw',
    args: [parseUnits(withdrawAmountDebounced || '0', 18)],
  })

  return { withdrawAmount, setWithdrawAmount, write, isSuccess, isLoading }
}
