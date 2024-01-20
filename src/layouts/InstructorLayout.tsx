import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { cn } from '../util/utils'
import { useEffect } from 'react'
import userApi from '../api/modules/user.api'
import { logout, setLoggedinUser } from '../redux/features/user/user.slice'

const InstructorLayout = () => {
  const { confirmModalOpen, createLectureModalOpen } = useSelector((state: RootState) => state.appState);
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
      <div className={cn('max-w-screen min-h-screen flex flex-col', {
        "overflow-hidden max-h-screen" : confirmModalOpen.open || createLectureModalOpen.open
      })}>
          <Header role='instructor' isLoggin={true} />
          <div className='flex items-start w-full'>
              <Sidebar />
              <div className='container pt-[80px] min-h-screen flex-1 overflow-x-hidden'>
                  <Outlet />
              </div>
          </div>
          <Footer />
      </div>
    </>
  )
}

export default InstructorLayout
