import Layout from '@/layout'
import Explore from '@/pages/explore'
import Home from '@/pages/home'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
    ],
  },
])

export default router
