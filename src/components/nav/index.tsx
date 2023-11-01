import { Button } from '@nextui-org/react'

import './index.less'

const Nav = () => {
  return (
    <nav className="kip-nav">
      <div className="kip-nav__brand">KIP</div>
      <div className="kip-nav__funcs">
        <Button color="primary">Launch APP</Button>
      </div>
    </nav>
  )
}

export default Nav
