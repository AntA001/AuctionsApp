import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './error-page'
import Login, { action as loginAction } from './auth/Login'
import Buyer from './buy/Buyer'
import Seller from './sell/Seller'
import AuctionDashboard, {
  loader as dashboardLoader,
} from './buy/AuctionDashboard'
import CreateAuction, { loader as auctionLoader } from './sell/CreateAuction'
import { action as createAuctionAction } from './sell/CreateAuctionModal'
import PublicLayout from './auth/PublicLayout'
import PrivateLayout from './auth/PrivateLayout'
import Home from './auth/Home'
import App, { loader as appLoader } from './App'
import { action as createBidAction } from './bid/CreateBidModal'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} errorElement={<ErrorPage />} loader={appLoader}>
      <Route element={<PublicLayout />}>
        <Route path="login" element={<Login />} action={loginAction} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="buyer" element={<Buyer />}>
          <Route
            path="auctions"
            element={<AuctionDashboard />}
            loader={dashboardLoader}
            action={createBidAction}
          />
        </Route>
        <Route path="seller" element={<Seller />}>
          <Route
            path="create"
            element={<CreateAuction />}
            loader={auctionLoader}
            action={createAuctionAction}
          />
        </Route>
      </Route>
    </Route>,
  ),
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
