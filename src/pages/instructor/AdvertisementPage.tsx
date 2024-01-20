import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { tabbar } from '../../constants/tabbar.constant'
import { cn } from '../../util/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AdvertisementPage = () => {
    const navigate = useNavigate();
    const active = useSelector((state: RootState) => state.appState.activeState);

    return (
        <div className='flex flex-col gap-10 mt-10 mb-40'>
            <div className='w-full bg-white shadow-md shadow-gray-300 rounded-md p-5 flex justify-between items-center'>
                <h1 className='font-bold text-2xl'>Gói quảng cáo</h1>
                <Button size='lengthen' rounded='md' onClick={() => navigate("/instructor/packages")}>
                    Mua gói quảng cáo
                </Button>
            </div>

            {/* <div className='w-full bg-white shadow-md shadow-gray-300 rounded-md flex flex-col'>
                <ul className='flex justify-start border-b-[1px] border-gray-300 rounded-tl-md rounded-bl-md'>
                    {
                        tabbar.mentorAdsTabbar.map((tab, i) => (
                            <li 
                                key={i}
                                className={cn('hover:bg-blue-100 px-5 py-2 border-r-[1px] border-gray-300 cursor-pointer',
                                'first:rounded-tl-md', {
                                    'bg-secondColor text-white hover:bg-secondColor': active && tab.state.includes(active)
                                })}
                                onClick={() => navigate(tab.path)}
                            >
                                { tab.display }
                            </li>
                        ))
                    }
                </ul>
            </div> */}
            <div className="block w-full border-[1px] border-gray-300 rounded-md bg-white">
                <ul className="flex cursor-pointer">
                {
                    tabbar.mentorAdsTabbar.map((tab, index) => (
                    <li 
                        key={index} 
                        className="flex-1"
                        onClick={() => navigate(tab.path)}
                    >
                        <div className={cn("py-4 px-3 text-center transition-all duration-300", {
                        "bg-secondColor text-white font-semibold": active && tab.state.includes(active),
                        "hover:bg-blue-50": active !== tab.state,
                        "rounded-tl-md rounded-bl-md": index === 0,
                        "rounded-tr-md rounded-br-md": index === tabbar.mentorManageCoursesTabbar.length - 1
                        })}>
                        <span>{tab.display}</span>
                        </div>
                    </li>
                    ))
                }
                </ul>
            </div>
            <Outlet />
        </div>
    )
}

export default AdvertisementPage
