import React from 'react'
import Header from './Header'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from "../../../hooks/useAuth"
import CardUser from '../../modules/User/CardUser'
import Loading from '../../shared/Loading'
import BannedScreen from './BannedScreen'


const PrivateLayout = () => {
  const { auth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading></Loading>
  } // En PrivateLayout.jsx
  if (auth?.isBanned) {
    return <BannedScreen
      banReason={auth.banReason}
      banExpiresAt={auth.banExpiresAt}
    />;
  } else {
    return (
      <div className='h-full w-full flex justify-center'>
        <div className='w-11/12 min-h-screen flex flex-col'>
          <Header />
          <div className={`p-6 ${(location.pathname === '/home/settings') ? "flex justify-center" : (location.pathname === '/home/people') ? "" : "flex justify-between"}`}>
            {auth._id ? <Outlet /> : <Navigate to="/" />}

          </div>
        </div>
      </div>
    )
  }
}

export default PrivateLayout