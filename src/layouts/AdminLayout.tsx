import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { AdminSidebar } from '../components/Sidebar'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userApi from '../api/modules/user.api'
import { RootState } from '../redux/store'
import { logout, setLoggedinUser } from '../redux/features/user/user.slice'

const AdminLayout = () => {
    const dispatch = useDispatch();
    const user = useSelector((state:RootState) => state.user.user);

    useEffect(() => {
        const getUserFresh = async () => {
            const { response, error } = await userApi.getById(user.id);
            if(response) dispatch(setLoggedinUser(response.data))
            if(error) dispatch(logout())
        }

        getUserFresh()
    }, [dispatch])

    return (
        <>
            <div className='max-w-screen min-h-screen flex flex-col'>
                <Header role='admin' isLoggin={true} />
                <div className='flex items-start w-full'>
                    <AdminSidebar />
                    <div className='container pt-[80px] min-h-screen flex-1 overflow-x-hidden'>
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default AdminLayout
