import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react'
import moment from 'moment'
import Header from '@/assets/header.jpg'

import './index.less'
import React, { useEffect, useState } from 'react'
import { CONTRACT_MAP } from '@/web3'
import {
  Collection,
  Question,
  QuestionTuple,
  buildCollection,
  buildQueryHistory,
  getMsg,
} from '@/utils/helper'
import { formatUnits, parseUnits } from 'ethers'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import { KIPQueryAddress, KIPTokenAddress } from '@/config'
import { approveABI, queryABI, withdrawABI } from './config'
import { ask, getAnswer } from '@/api'

type Metadata = {
  name: string
  image: string
  description: string
}

type CollectionWithMetadata = Metadata & Collection

type QueryHistoryItemProps = Question

const QueryHistoryItem = ({
  id: collectionId,
  questionId,
  question,
  time,
}: QueryHistoryItemProps) => {
  const [answer, setAnswer] = useState('')
  const { data, signMessage } = useSignMessage()
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleGetAnswer = async () => {
    if (address) {
      const msg = getMsg(address)
      signMessage({ message: msg })
    }
  }

  useEffect(() => {
    if (data) {
      getAnswer({
        collectionId,
        questionId,
        address: address!,
        message: getMsg(address!),
        signature: data,
      }).then(([err, res]) => {
        if (!err && res.data) {
          setAnswer(res.data)
          onOpen()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className="kip-query-item">
      <div className="kip-query__info">
        <div className="kip-query__question">{question}</div>
        <div className="kip-query__other">
          <span className="kip-query__time">
            {moment(new Date(time * 1000), 'YYYY-MM-DD HH:mm:ss').fromNow()}
          </span>
          <Link className="kip-query__answer" onClick={handleGetAnswer}>
            View answer
          </Link>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Answer</ModalHeader>
          <ModalBody>
            <p>Question: {question}</p>
            <p>Answer: {answer}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

const Detail = () => {
  const [balance, setBalance] = useState('')
  const [allowance, setAllowance] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [question, setQuestion] = useState('')
  const [hasPaid, setHasPaid] = useState(false)
  const [collection, setCollection] = useState<CollectionWithMetadata>()
  const [questions, setQuestions] = useState<Question[]>()
  const [questionId, setQuestionId] = useState(0)
  const [answer, setAnswer] = useState('')
  const [askIsLoading, setAskIsLoading] = useState(false)
  const { data: signature, signMessage } = useSignMessage({
    message: question,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address } = useAccount()

  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    switchNetwork?.(80001)
  }, [])

  const { config } = usePrepareContractWrite({
    address: KIPQueryAddress,
    abi: withdrawABI,
    functionName: 'withdraw',
    args: [parseUnits(withdrawAmount || '0', 18)],
  })

  const { config: approveConfig } = usePrepareContractWrite({
    address: KIPTokenAddress,
    abi: approveABI,
    functionName: 'approve',
    args: [KIPQueryAddress, BigInt(collection?.price || '0')],
  })

  const { config: queryConfig } = usePrepareContractWrite({
    address: KIPQueryAddress,
    abi: queryABI,
    functionName: 'query',
    args: [BigInt(collection?.id || '0'), question],
  })

  const { data, write } = useContractWrite(config)
  const { data: approveData, write: approveWrite } =
    useContractWrite(approveConfig)
  const { data: queryData, write: queryWrite } = useContractWrite(queryConfig)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } =
    useWaitForTransaction({
      hash: approveData?.hash,
    })
  const { isLoading: queryIsLoading, isSuccess: queryIsSuccess } =
    useWaitForTransaction({
      hash: queryData?.hash,
    })

  const parseSearch = () => {
    const search = window.location.search
    const queryMap = new Map<string, string>()
    search
      .replace('?', '')
      .split('&')
      .map((keyValue) => {
        queryMap.set(keyValue.split('=')[0], keyValue.split('=')[1])
      })
    return queryMap
  }

  const init = (id: number) => {
    Promise.all([
      handleGetInfo(id),
      handleGetQueryHistory(id),
      handleGetBalance(),
      handleGetAllowance(),
    ]).then(([{ collection, metadata }, questions, balance, allowance]) => {
      setCollection({
        ...collection,
        ...metadata,
      })
      setQuestions(questions)
      setBalance(balance)
      setAllowance(allowance)
    })
  }

  const handleGetInfo = async (id: number) => {
    const uri = await CONTRACT_MAP.KIP.uri(id)
    const collection = await handleGetCollection(id)
    const metadata = await handleGetMetadata(uri)
    return { collection, metadata }
  }

  const handleGetCollection = async (id: number): Promise<Collection> => {
    const res = await CONTRACT_MAP.KIPQuery.getCollection(id)
    return buildCollection(res)
  }

  const handleGetMetadata = async (uri: string): Promise<Metadata> => {
    const res = await fetch(uri)
    return await res.json()
  }

  const handleGetQueryHistory = async (id: number): Promise<Question[]> => {
    const questions = await CONTRACT_MAP.KIPQuery.getQuestions(id)
    return questions.map((question: QuestionTuple) =>
      buildQueryHistory(question)
    )
  }

  const handleGetBalance = async () => {
    const res = await CONTRACT_MAP.KIPQuery.getBalance(address)
    return formatUnits(res, 18)
  }

  const handleGetAllowance = async () => {
    const res = await CONTRACT_MAP.KIPToken.allowance(address, KIPQueryAddress)
    return formatUnits(res, 18)
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (amount > parseFloat(balance)) {
      return
    }
    console.log(config)
    write?.()
  }

  const handleApproval = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log(approveConfig)
    approveWrite?.()
  }

  const handleQuery = async (e: React.MouseEvent) => {
    e.preventDefault()
    queryWrite?.()
    CONTRACT_MAP.KIPQuery.on('Query', (collectionId, questionId, queryor) => {
      const _questionId = parseInt(questionId, 10)
      setQuestionId(_questionId)
    })
  }

  const handleAsk = async (e: React.MouseEvent) => {
    e.preventDefault()
    setAskIsLoading(true)
    const msg = getMsg(address!)
    signMessage({
      message: msg,
    })
  }

  useEffect(() => {
    if (signature) {
      ask({
        collectionId: collection?.id!,
        questionId: questionId,
        question,
        address: address!,
        message: getMsg(address!),
        signature: signature,
      })
        .then(([err, res]) => {
          if (!err && res.data) {
            setAnswer(res.data)
          }
        })
        .finally(() => {
          setAskIsLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  useEffect(() => {
    const query = parseSearch()
    init(parseInt(query.get('id')!, 10))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isSuccess) {
      window.alert('Withdraw success')
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (approveIsSuccess) {
      window.alert('Approve Done')
    }
  }, [approveIsSuccess])

  useEffect(() => {
    if (queryIsSuccess) {
      window.alert('Query Done')
      setHasPaid(true)
    }
  }, [queryIsSuccess])

  return (
    <div className="p-detail">
      <img className="kip-bg-header" src={Header} />
      <div className="kip-main">
        <div className="kip-main__left">
          <img className="kip-cover" src={collection?.image} />
          <Link
            className="kip-withdraw"
            color="primary"
            underline="always"
            onClick={(e) => {
              e.preventDefault()
              onOpen()
            }}
          >
            Withdraw
          </Link>
        </div>
        <div className="kip-main__right">
          <div className="kip-info">
            <div className="kip-info__name">{collection?.name || '-'}</div>
            <div className="kip-info__owner">
              <Link
                href={`https://testnets.opensea.io/${collection?.creator}`}
                target="_blank"
              >
                Owner: {collection?.creator.slice(2, 8).toUpperCase() || '-'}
              </Link>
            </div>
            <div className="kip-info__description">
              <div className="kip-label">Description</div>
              <div className="kip-value">{collection?.description || '-'}</div>
            </div>
            <div className="kip-info__price">
              <div className="kip-label">Price per Query</div>
              <div className="kip-value">
                $
                {collection?.price
                  ? formatUnits(BigInt(collection.price), 18)
                  : 0}{' '}
                USDT
              </div>
            </div>
          </div>
          <div className="kip-ask mt-8 mb-4">
            <Input
              className="pr-0"
              placeholder="Ask me anything"
              value={question}
              onValueChange={setQuestion}
              endContent={
                <>
                  {allowance &&
                    parseUnits(allowance, 18) <
                      BigInt(collection?.price || '0') && (
                      <Button
                        color="primary"
                        isLoading={approveIsLoading}
                        onClick={(e) => handleApproval(e)}
                      >
                        Approval
                      </Button>
                    )}
                  {!!(
                    allowance &&
                    parseUnits(allowance, 18) >
                      BigInt(collection?.price || '0') &&
                    !hasPaid
                  ) && (
                    <Button
                      color="primary"
                      isLoading={queryIsLoading}
                      onClick={(e) => handleQuery(e)}
                    >
                      Pay
                    </Button>
                  )}
                  {hasPaid && (
                    <Button
                      color="primary"
                      isLoading={askIsLoading}
                      onClick={(e) => handleAsk(e)}
                    >
                      Ask
                    </Button>
                  )}
                </>
              }
            />
            {answer && <h1 className="my-8">Answer: {answer}</h1>}
          </div>
          <div className="kip-history">
            <Tabs variant="underlined">
              <Tab key="history" title="Query History">
                {questions?.map((question) => (
                  <QueryHistoryItem key={question.questionId} {...question} />
                ))}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Withdraw bonus</ModalHeader>
              <ModalBody>
                <p>Balance: ${balance}</p>
                <Input
                  type="number"
                  label="Amount"
                  labelPlacement="outside"
                  placeholder="Please enter amount to withdraw"
                  value={withdrawAmount}
                  onValueChange={setWithdrawAmount}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={parseFloat(withdrawAmount) > parseFloat(balance)}
                  isLoading={isLoading}
                  onPress={handleWithdraw}
                >
                  Withdraw
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Detail
