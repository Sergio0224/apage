import React, { useState, useEffect } from 'react';
import { Global } from "../../../../helpers/Global"

const formatPoints = (points) => {
    if (points >= 1000000) {
        return (points / 1000000).toFixed(1) + 'M';
    } else if (points >= 1000) {
        return (points / 1000).toFixed(1) + 'K';
    }
    return points.toString();
};

const LeaderboardList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                if (allUsers.length >= 10) return;

                const response = await fetch(Global.url + "user/list/" + page, {
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                // Añadir nuevos usuarios al array existente
                const newUsers = [...allUsers, ...data.users];
                setAllUsers(newUsers);

                // Si aún no tenemos 10 usuarios y hay más páginas, cargar la siguiente
                if (newUsers.length < 10 && data.users.length === 5) {
                    setPage(prev => prev + 1);
                } else {
                    // Ordenar por puntos y tomar los primeros 10
                    const topUsers = newUsers
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 10);
                    setUsers(topUsers);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, allUsers.length]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            {users.map((user, index) => (
                <div key={user._id} className="flex items-center">
                    <div className="flex-1 flex items-center space-x-3">
                        <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full 
                    ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-gray-100 text-gray-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-blue-600'} 
                    font-medium text-sm`}
                        >
                            {index + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    className="w-8 h-8 rounded-full"
                                    alt={user.name}
                                />
                            ) : (
                                <InitialAvatar name={user.name} size={32} fontSize={16} />
                            )}
                            <span className="font-medium dark:text-white">{user.name}</span>
                        </div>
                    </div>
                    <div className="w-24 text-right">
                        <span className="text-sm text-blue-500 font-medium">
                            {formatPoints(user.points)} pts
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LeaderboardList;