import { Outlet } from "react-router-dom"
import { useEffect } from 'react';
import Header from "../components/Header"
import { LearningSidebar } from "../components/Sidebar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { cn } from "../util/utils"
import userApi from "../api/modules/user.api";
import { logout, setLoggedinUser } from "../redux/features/user/user.slice";

const LearningLayout = () => {
    const dispatch = useDispatch();
    const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);
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
        <div className='max-w-screen min-h-screen flex flex-col'>
            <Header role='learner'/>
            <div className='flex items-start w-full'>
                <LearningSidebar />
                <div className={cn('pt-[80px] min-h-screen flex-1 transition-all duration-500', {
                "pl-[350px]": sidebarExpand
                })}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default LearningLayout
