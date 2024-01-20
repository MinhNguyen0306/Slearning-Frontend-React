import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import userApi from '../api/modules/user.api'
import { logout, setLoggedinUser } from '../redux/features/user/user.slice'
import { RootState } from '../redux/store'

const LearnerLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const authUser = async () => {
      const {response, error} = await userApi.getById(user.id);

      if(response) dispatch(setLoggedinUser(response.data))
      if(error) dispatch(logout())
    }

    authUser()
  }, [dispatch]) 

  return (
    <>
      <div className='max-w-screen min-h-screen flex flex-col'>
        <Header role="learner" />
        <div className='relative container w-[1380px] min-h-screen pt-[80px]'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default LearnerLayout
