import React, { createContext, useEffect, useState } from 'react'
import { Global } from "../helpers/Global"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [counters, setCounters] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await authUser()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const authUser = async () => {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")

        if (!token || !user) {
            setLoading(false)
            return false
        }

        const userObj = JSON.parse(user)
        const userId = userObj.id

        const req = await fetch(`${Global.url}user/profile/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const data = await req.json()

        const reqCounters = await fetch(`${Global.url}user/counters/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const dataCounters = await reqCounters.json()

        setAuth(data.user)
        setCounters(dataCounters)
        setLoading(false)

    }

    return (
        <AuthContext.Provider
            value={
                {
                    auth,
                    setAuth,
                    loading,
                    counters,
                    setCounters
                }
            }>
            {children}
        </AuthContext.Provider>
    )
}