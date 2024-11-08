import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'
import { useLocation } from "react-router-dom"

const CardUser = () => {
    const { auth, counters } = useAuth()
    const location = useLocation()

    if (location.pathname === '/home/aprendizaje' || location.pathname === '/home') {
        return (
            <div className='bg-white dark:bg-[#242424] rounded-2xl p-5 shadow-md dark:shadow-lg dark:shadow-[#2d2d2d] dark:border-[#4a4a4a] w-full'>
                <div className="text-center mb-5">
                    <img
                        src={Global.url + "user/avatar/" + auth.image}
                        alt={auth.name}
                        className="w-24 h-24 rounded-full border-4 border-[#ffd166] dark:border-[#4a4a4a] mx-auto mb-3"
                    />
                    <h2 className="text-xl font-bold dark:text-white">{auth.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">@{auth.nick}</p>
                </div>
                <div className="flex justify-around border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="text-center">
                        <div className="font-bold text-lg text-[#346995] dark:text-[#4a81b0]">{counters.followed}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Seguidores</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg text-[#346995] dark:text-[#4a81b0]">{counters.following}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Siguiendo</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg text-[#346995] dark:text-[#4a81b0]">{counters.publications}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Publicaciones</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default CardUser