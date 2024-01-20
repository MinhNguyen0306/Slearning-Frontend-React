import React from 'react'
import { Outlet } from 'react-router-dom'

const NotHeaderLayout = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <Outlet />
    </div>
  )
}

export default NotHeaderLayout
