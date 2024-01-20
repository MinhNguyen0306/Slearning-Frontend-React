import React from 'react'
import { Roles } from '../types/model/Role'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Navigate, useLocation } from 'react-router-dom'

type Props = {
    allowedRoles: Roles
    children: React.ReactNode
}

const ProtectedPage: React.FC<Props> = ({ allowedRoles, children }) => {
    const user = useSelector((state:RootState) => state.user.user);
    const location = useLocation();
    const alloweds = allowedRoles.map(allowed => allowed.id);
    
    return (
        <>
            {
                user.id
                    ? user.roles.find(role => alloweds.includes(role.id))
                        ? children
                        : <Navigate to='/unauthorize' state={{ from: location }} replace/>
                    : <Navigate to='/auth' state={{ from: location }} replace/>
            }
        </>
    )
}

export default ProtectedPage