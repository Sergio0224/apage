import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import PublicLayout from "../components/public/Layout/PublicLayout"
import Register from "../components/public/Register/Register"
import Login from "../components/public/Login/Login"
import Config from "../components/private/Config/Config"
import Logout from "../components/private/Logout/Logout"
import PrivateLayout from '../components/private/Layout/PrivateLayout'
import { Feed } from '../components/private/Feed/Feed'
import Error_404 from '../components/shared/Error_404'
import { AuthProvider } from "../contexts/AuthProvider"
import Home from '../components/public/Home/Home'
import Learning from '../components/private/Learning/Learning'
import People from '../components/public/Home/People'
import { AlgebraicExpression } from "../contexts/AlgebraicExpression"
import Following from '../components/modules/Follow/Following'
import Followers from '../components/modules/Follow/Followers'
import Profile from '../components/modules/User/Profile'
import TopicContent from '../components/private/Learning/TopicContent'
import LearningLayout from '../components/private/Learning/LearningLayout'
import { SectionProvider } from "../contexts/SectionProvider"

const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SectionProvider>
          <AlgebraicExpression>
            <Routes>
              <Route path='/' element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
              </Route>

              <Route path='/home' element={<PrivateLayout />}>

                <Route index element={<Feed />} />
                <Route path='inicio' element={<Feed />} />
                <Route path='aprendizaje' element={<LearningLayout />} >
                  <Route index element={<Learning></Learning>}></Route>
                  <Route path=':topicId' element={<TopicContent />} />
                </Route>
                <Route path='settings' element={<Config />} />
                <Route path='logout' element={<Logout />} />
                <Route path='people' element={<People />} />

                <Route path='profile/:userId' element={<Profile />} >
                  <Route path='siguiendo' element={<Following />} />
                  <Route path='seguidores' element={<Followers />} />
                </Route>
              </Route>

              <Route path='*' element={<Error_404 />} />
            </Routes>
          </AlgebraicExpression>
        </SectionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Routing