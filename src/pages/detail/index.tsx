import { Button, Link, Tab, Tabs } from '@nextui-org/react'
import moment from 'moment'
import Header from '@/assets/header.jpg'
import Cover from '@/assets/test.jpg'

import './index.less'

type QueryHistoryItemProps = {
  question: string
  queryor: string
  queryTime: string
}

const QueryHistoryItem = ({ question, queryTime }: QueryHistoryItemProps) => {
  return (
    <div className="kip-query-item">
      <div className="kip-query__info">
        <div className="kip-query__question">{question}</div>
        <div className="kip-query__other">
          <span className="kip-query__time">
            {moment(queryTime, 'YYYY-MM-DD HH:mm:ss').fromNow()}
          </span>
          <Link className="kip-query__answer">View answer</Link>
        </div>
      </div>
      <div className="kip-query__func">
        <Button color="primary">Mint</Button>
      </div>
    </div>
  )
}

const Detail = () => {
  return (
    <div className="p-detail">
      <img className="kip-bg-header" src={Header} />
      <div className="kip-main">
        <div className="kip-main__left">
          <img className="kip-cover" src={Cover} />
          <Link className="kip-withdraw" color="primary" underline="always">
            Withdraw
          </Link>
        </div>
        <div className="kip-main__right">
          <div className="kip-info">
            <div className="kip-info__name">A Fasty Brush Flower Arts</div>
            <div className="kip-info__owner">
              <Link>Owner: 0xabcde...00c95</Link>
            </div>
            <div className="kip-info__description">
              <div className="kip-label">Description</div>
              <div className="kip-value">
                Add game-like elements, such as badges or leaderboards, to
                incentivize users to engage with the chatbot more frequently.
              </div>
            </div>
            <div className="kip-info__price">
              <div className="kip-label">Price per Query</div>
              <div className="kip-value">$0.1 USDT</div>
            </div>
          </div>
          <div className="kip-ask"></div>
          <div className="kip-history">
            <Tabs variant="underlined">
              <Tab key="history" title="Query History">
                <QueryHistoryItem
                  question="What is a KB(NFT)?"
                  queryor="c935"
                  queryTime="2023-10-31 10:00:23"
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
