import Layout from '@/layout'
import Explore from '@/pages/explore'
import LandPage from '@/pages/landpage'
import Home from '@/pages/home'
import { createBrowserRouter } from 'react-router-dom'
import Create from '@/pages/create'
import Detail from '@/pages/detail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandPage />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
      {
        path: '/create',
        element: <Create />,
      },
      {
        path: '/detail',
        element: <Detail />,
      },
    ],
  },
])

export default router
