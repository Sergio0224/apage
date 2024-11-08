import Header from '../Layout/Header'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import CardUser from '../../modules/User/CardUser'
import Loading from '../../shared/Loading'

const LearningLayout = () => {
    const { auth, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading></Loading>
    } else {
        return (
            <div className='h-full w-full flex justify-center'>
                <div className='w-11/12 min-h-screen flex flex-col'>
                    <div className={`p-6 ${(location.pathname === '/home/settings') ? "flex justify-center" : (location.pathname === '/home/people') ? "" : "flex justify-between"}`}>
                        {auth._id ? <Outlet /> : <Navigate to="/" />}
                    </div>
                </div>
            </div>
        )
    }
}

export default LearningLayout