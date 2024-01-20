import { EditIcon, UploadIcon, PlusIcon, User2Icon, Edit3Icon, XIcon, CameraIcon, SettingsIcon, BellRingIcon, BellOffIcon, PlusCircleIcon } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { tabbar } from "../constants/tabbar.constant";
import { cn, getImage } from "../util/utils";
import { useState } from 'react';
import { setChangeAvatarModalOpen } from "../redux/features/appState/appState.slice";
import ChangeAvatarModal from "../components/modal/ChangeAvatarModal";
import { requestToken } from '../firebase';
import notificationApi from '../api/modules/notification.api';
import { DeviceType } from '../types/payload/enums/DeviceType';
import { toast } from 'react-toastify';

const LearnerProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const active = useSelector((state: RootState) => state.appState.activeState)
    const user = useSelector((state: RootState) => state.user.user);
    const [editPhone, setEditPhone] = useState<boolean>(false);

    function handleEnableNotification() {
        requestToken().then(token => {
            if(token) {
                notificationApi.storeDeviceToken(user.id, token, DeviceType.LAPTOP)
                .then((response) => {
                    if(response.response) {
                        toast.success(response.response.data.message)
                    } else {
                        toast.error(response.error.message)
                    }

                }).catch((err: Error) => {
                    toast.error(err.message)
                }) 
            } else {
                toast.error("Lấy token thất bại!")
            }
        })
    }

  return (
    <>
        <ChangeAvatarModal user={user}/>
        <div className='flex gap-10 my-12'>
            {/* Left Infomation */}
            <div className='w-[25%] flex flex-col gap-y-5'>
                {/* Invidual Info */}
                <div className='flex flex-col py-5 px-10 justify-center items-center rounded-md bg-white
                border-[1px] border-gray-300'>
                    <h2 className='font-bold text-lg mb-5'>Thông tin cá nhân</h2>
                    <div 
                        className='relative w-[130px] h-[130px] rounded-full border-[1px] border-gray-300 p-1 group cursor-pointer'
                        onClick={() => dispatch(setChangeAvatarModalOpen(true))}
                    >
                        {
                            user.avatar 
                                ?   <div className="relative w-full h-full rounded-full grid place-items-center">
                                        <img 
                                            src={getImage(user.avatar.url)} 
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                        <div className="w-full h-full absolute inset-0 z-50 bg-gray-900 bg-opacity-60 rounded-full
                                        grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <CameraIcon className="w-7 h-7 stroke-slate-200 stroke-1"/>
                                        </div>
                                    </div> 
                                :   <div className="relative w-full h-full rounded-full bg-green-600 grid place-items-center">
                                        <span className="text-white font-extrabold text-5xl">
                                            { user.fullName?.charAt(0) }
                                        </span>
                                        <div className="w-full h-full absolute inset-0 z-50 bg-gray-900 bg-opacity-60 rounded-full
                                        grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <CameraIcon className="w-7 h-7 stroke-slate-200 stroke-1"/>
                                        </div>
                                    </div> 
                        }
                    </div>
                    <h1 className='font-bold text-2xl mt-2'>{ user.fullName }</h1>
                    <div className='w-full flex flex-col gap-2 mt-5'>
                        <div className='flex justify-between items-center gap-x-4'>
                            <span>Email</span>
                            <span className='text-ellipsis overflow-hidden whitespace-nowrap'>
                                { user.email }
                            </span>
                        </div>
                        <div className={cn('text-gray-500 h-[30px] w-full flex items-center justify-between overflow-hidden text-ellipsis whitespace-normal', {
                            'hidden': editPhone
                        })}>
                            <span>{ user.phone ? user.phone : "Thêm số điện thoại" }</span>
                            {
                                user.phone
                                    ?   <Edit3Icon 
                                        className="hover:text-gray-800 cursor-pointer"
                                        onClick={() => setEditPhone(true)}
                                    />
                                    :   <PlusCircleIcon 
                                            className="hover:text-gray-800 cursor-pointer"
                                            onClick={() => setEditPhone(true)}
                                        />
                            }
                        </div>
                        { editPhone && 
                            <div 
                                className="relative h-[30px] rounded-md border-[1px] border-black"
                                onBlur={() => setEditPhone(false)} 
                            >
                                <input 
                                    type='text' 
                                    autoFocus
                                    className='w-full h-full pl-3 pr-6 py-2 outline-none border-none bg-transparent ' 
                                /> 
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
                                    <XIcon className="w-5 h-5"/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {/* End invidual Info */}

                {/* Extra Invidual Info */}
                <div className='flex flex-col p-5 justify-center items-start gap-y-5 rounded-md bg-white
                border-[1px] border-gray-300'>
                    <div className='w-full flex justify-between items-center'>
                        <h2 className='text-lg font-bold'>Thông tin bổ sung</h2>
                    </div>
                    <div className='w-full flex flex-col gap-y-2'>
                        <span className='font-bold'>Công việc mong muốn</span>
                        {/* <span className='inline-flex gap-x-2 my-1 text-gray-700 flex-wrap'>
                            <User2Icon /> Backend Dev
                        </span> */}
                        <div className='w-full flex justify-center gap-1 px-3 py-2 border-2 border-blue-600
                        text-blue-600 font-semibold bg-white cursor-pointer hover:bg-blue-100 hover:text-blue-700'>
                            <PlusIcon />
                            <span>Thêm công việc mong muốn</span>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-y-2'>
                        <span className='font-bold'>Liên hệ</span>
                        <div className='w-full flex justify-center gap-1 px-3 py-2 border-2 border-blue-600
                        text-blue-600 font-semibold bg-white cursor-pointer hover:bg-blue-100 hover:text-blue-700'>
                            <PlusIcon />
                            <span>Thêm liên hệ</span>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-y-2'>
                        <span className='font-bold'>Sơ yếu lý lịch</span>
                        <input type='file' id='upload' name='upload' accept='application/pdf' hidden/>
                        <label htmlFor='upload' className='flex justify-center gap-1 px-3 py-2 border-2 border-blue-600
                        text-blue-600 font-semibold bg-white cursor-pointer hover:bg-blue-100 hover:text-blue-700'>
                            <UploadIcon />
                            <span>Tải file lên</span>
                        </label>
                    </div>
                </div>
                {/* End Extra Invidual Info */}
            </div>
            {/* End Left Infomation */}

            {/* Right Information */}
            <div className='flex-1 flex flex-col gap-y-5'>
                {/* Navigation info bar */}
                <div className='w-full flex justify-between bg-black rounded-md text-white font-semibold'>
                    <ul className='flex'>
                        {
                            tabbar.learnerInfoTabbar.map((tab, index) => (
                                <span
                                    key={tab.path} 
                                    className={cn("px-8 py-3 rounded-bl-md rounded-tl-md hover:bg-gray-700",
                                    "border-r-[1px] border-gray-700 cursor-pointer", {
                                        "rounded-none": index > 0,
                                        "hover:bg-none bg-gray-700": active?.includes(tab.state)
                                    })}
                                    onClick={() => !active?.includes(tab.state) ? navigate(tab.path) : null}
                                >
                                    {tab.display}
                                </span>
                            ))
                        }
                    </ul>
                    <div className='relative w-fit h-fit self-center mr-5 cursor-pointer hover:bg-gray-600 rounded-full group'>
                        <SettingsIcon />
                        <ul className='absolute right-0 top-full w-max rounded-lg bg-white text-black border border-e-gray-200 opacity-0 group-hover:opacity-100'>
                            <li className='px-3 py-2 hover:bg-blue-100 rounded text-sm font-normal'
                            onClick={handleEnableNotification}>
                                {
                                    user.deviceTokens && !user.deviceTokens.id 
                                        ?   <div className='flex items-center gap-x-3'>
                                                <BellRingIcon />
                                                <span>Bật thông báo</span>
                                            </div>
                                        :   <div className='flex items-center gap-x-3'>
                                                <BellOffIcon />
                                                <span>Tắt thông báo</span>
                                            </div>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
                {/* End navigation info bar */}

                {/* Info content */}
                <div className=''>
                <Outlet />
                </div>
                {/* End info content */}
            </div>
            {/* End Right Infomation */}
        </div>
    </>
  )
}

export default LearnerProfile
