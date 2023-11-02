import React, { useState } from 'react'
import { categorys } from '@/types'

import Cover from '@/assets/test.jpg'

import './index.less'
import { Button } from '@nextui-org/react'

type CollectionsCardProps = {
  title: string
}

const CollectionsCard = ({ title }: CollectionsCardProps) => {
  return (
    <div className="kip-collections-card">
      <h1 className="kip-collections-card__title">{title}</h1>
      <div className="kip-collections">
        <div className="kip-collection-card">
          <img
            className="kip-collection-card__cover"
            src={Cover}
            alt=""
            width={280}
            height={372}
          />
          <p className="kip-collection-card__name">
            The Consequences of Chaos #2
          </p>
          <Button className="kip-collection-card__trade" color="primary">
            Trade
          </Button>
        </div>
        <div className="kip-collection-card">
          <img
            className="kip-collection-card__cover"
            src={Cover}
            alt=""
            width={280}
            height={372}
          />
          <p className="kip-collection-card__name">
            The Consequences of Chaos #2
          </p>
          <Button className="kip-collection-card__trade" color="primary">
            Trade
          </Button>
        </div>
        <div className="kip-collection-card">
          <img
            className="kip-collection-card__cover"
            src={Cover}
            alt=""
            width={280}
            height={372}
          />
          <p className="kip-collection-card__name">
            The Consequences of Chaos #2
          </p>
          <Button className="kip-collection-card__trade" color="primary">
            Trade
          </Button>
        </div>
        <div className="kip-collection-card">
          <img
            className="kip-collection-card__cover"
            src={Cover}
            alt=""
            width={280}
            height={372}
          />
          <p className="kip-collection-card__name">
            The Consequences of Chaos #2
          </p>
          <Button className="kip-collection-card__trade" color="primary">
            Trade
          </Button>
        </div>
      </div>
    </div>
  )
}

const Explore = () => {
  const [currentCategory, setCurrentCategory] = useState<number>(1)

  const handleCategoryChange = (e: React.MouseEvent, category: number) => {
    e.preventDefault()
    setCurrentCategory(category)
  }

  return (
    <div className="p-explore">
      <h1 className="kip-title">Explore</h1>
      <div className="kip-category">
        {categorys.map((category) => (
          <div
            className={`kip-category__item ${
              currentCategory === category.value ? 'active' : ''
            }`}
            key={category.value}
            onClick={(e) => handleCategoryChange(e, category.value)}
          >
            {category.label}
          </div>
        ))}
      </div>
      <CollectionsCard title="Trending KBs" />
      <CollectionsCard title="Biggest Movers" />
      <CollectionsCard title="New Collections" />
    </div>
  )
}

export default Explore
