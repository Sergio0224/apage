import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from "../../../hooks/useAuth"
import Footer from './Footer'

const PublicLayout = () => {
  const { auth } = useAuth()
  return (
    <>
      {!auth._id ? <Outlet /> : <Navigate to="/home" />}
      {/*<Footer />*/}
    </>
  )
}

export default PublicLayout