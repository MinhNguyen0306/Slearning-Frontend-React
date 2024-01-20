import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MailIcon, PhoneIcon, XCircleIcon, ZoomInIcon } from 'lucide-react';
import { setUserDetailModalOpen } from '../../redux/features/appState/appState.slice';
import { Button } from '../Button';
import initialState from '../../redux/features/appState/appState.selector';
import { getImage } from '../../util/utils';
import { useMutation, useQueryClient } from 'react-query';
import userApi from '../../api/modules/user.api';
import { ResolveStatus } from '../../types/payload/enums/ResolveStatus';
import { toast } from 'react-toastify';
import { Notice } from '../../types/model/Notice';
import { requestToken } from '../../firebase';
import notificationApi from '../../api/modules/notification.api';

const UserDetailModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { open, user } = useSelector((state: RootState) => state.appState.userDetailModalOpen);

    const handleClose = () => {
        dispatch(setUserDetailModalOpen({open:false, user: initialState.userDetailModalOpen.user}))
    }

    const mutation = useMutation({
        mutationFn: (resolveStatus: ResolveStatus) => userApi.resolveRegisterInstructor(user.id, resolveStatus),
        onSuccess: (data) => {
            if(data.response) {
                const response = data.response.data;
                if(response.status === 'accepted' || response.status === 'rejected') {
                    queryClient.invalidateQueries('users');
                    handleClose();
                    toast.success(response.message)
                    requestToken().then(token => {
                        const notice: Notice = {
                            title: "Đăng ký người dạy",
                            topic: user.id,
                            content: response.status === 'accepted' ? "Hệ thống đã duyệt đăng ký người dạy"
                            :   "Hệ thống từ chối đăng ký người dạy",
                            imageUrl: user.avatar ? getImage(user.avatar.url) : "",
                            deviceTokens: [String(token?.trim())]
                        }
                        notificationApi.sendNotification(notice, "http://127.0.0.1:5173/learner/profile")
                        .then((response) => {
                            console.log(response)
                        })
                        .catch(error => console.log(error))
                    }).catch((error) => console.log(error))
                }
            } else {
                toast.error(data.error.response?.data.message + "status: " + data.error.response?.data.status)
            }
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[9999] top-0 left-0 bg-gray-800 bg-opacity-50
                grid place-items-center overflow-hidden'>

                    {/* Modal */}
                    <div className='w-[60%] h-[90%] flex flex-col justify-start items-start shadow-md shadow-gray-300 rounded-md bg-white
                    overflow-y-scroll overflow-x-hidden scrollbar-hide'>
                        <div className="w-full sticky top-0 left-0 py-1 border-b-[1px] border-gray-300 bg-inherit">
                            <XCircleIcon 
                                className="w-8 h-8 fill-red-500 stroke-white float-right cursor-pointer
                                hover:fill-red-600"
                                onClick={handleClose}
                            />
                        </div>

                        {/* Content */}
                        <div className='w-full min-h-[90%] flex p-5'>
                            {/* Left Content */}
                            <div className='w-[35%] flex flex-col items-center gap-y-3 h-full'>
                                <div 
                                    className='w-[200px] h-[200px] rounded-full border-[1px] border-gray-300 p-1 
                                    group cursor-pointer'
                                >
                                    {
                                        user.avatar 
                                            ?   <img 
                                                    src={getImage(user.avatar.url)} 
                                                    className='w-full h-full rounded-full object-contain'
                                                />
                                            :   <div className="relative w-full h-full rounded-full bg-green-600 grid place-items-center">
                                                    <span className="text-white font-extrabold text-5xl">
                                                        { user.fullName?.charAt(0) }
                                                    </span>
                                                    <div className="w-full h-full absolute inset-0 z-50 bg-gray-900 bg-opacity-60 rounded-full
                                                    grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <ZoomInIcon className="w-7 h-7 stroke-slate-200 stroke-1"/>
                                                    </div>
                                                </div> 
                                    }
                                </div>
                            </div>
                            {/* End Left Content */}

                            {/* Right Content */}
                            <div className='w-[65%]'>
                                <div className='flex flex-col justify-start gap-y-5'>
                                    <div className='flex flex-col'>
                                        <h3 className='text-gray-500 font-semibold text-lg'>
                                            { user.instructor ? "Nguoi day" : "Nguoi dung" }
                                        </h3>
                                        <span className='font-bold text-3xl tracking-wide'>{ user.fullName }</span>
                                    </div>
                                    <div className='flex items-center justify-start gap-x-3'>
                                        <MailIcon />
                                        <span>{ user.email }</span>
                                    </div>
                                    {
                                        user.phone && <div className='flex items-center justify-start'>
                                            <PhoneIcon />
                                            <span>{ user.phone }</span>
                                        </div>
                                    }
                                    {
                                        user.workExperiences.length > 0 &&
                                        <div className='flex flex-col gap-1'>
                                            <h2 className='font-semibold text-lg'>Kinh nghiệm làm việc</h2>
                                            <ul className='flex flex-col justify-start items-start text-sm'>
                                                {
                                                    user.workExperiences.map((item) => (
                                                        <li key={item.id} className='flex items-center gap-x-5'>
                                                            <i className='rounded-full bg-green-600 w-3 h-3'></i>
                                                            <div className='flex justify-between items-start'>
                                                                <div className=''>
                                                                    <h3 className='font-semibold'>{item.position} tại {item.company} - <span className='font-normal'>từ {item.startDate.toString()} đến {item.endDate.toString()}</span></h3>
                                                                    <span>{item.description}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        
                                        </div>
                                    }

                                    <div className='flex flex-col gap-y-3 mt-5'>
                                        <h3 className='font-semibold'>Giới thiệu bản thân</h3>
                                        <span className='break-words'>{ user.about }</span>
                                    </div>
                                </div>
                            </div>
                            {/* End Right Content */}
                        </div>
                        {/* End Content */}

                        {/* Action Box */}
                        {
                            !user.instructor && user.userStatus === 'PENDING' &&
                            <div className='w-full px-5 py-4 sticky bottom-0 left-0 border-t-[1px] border-gray-300 bg-white'>
                                <Button 
                                    variant='danger' rounded='md' 
                                    className='float-right w-[15%] ml-5' 
                                    onClick={() => mutation.mutate(ResolveStatus.REJECT)}
                                >
                                    Từ chối
                                </Button>
                                <Button 
                                    variant='blueContainer' 
                                    rounded='md' 
                                    className='float-right w-[15%]'
                                    onClick={() => mutation.mutate(ResolveStatus.ACCEPT)}
                                >
                                    Phê duyệt
                                </Button>
                            </div>
                        }
                        {/* End Action Box */}
                    </div>
                    {/* End Modal */}
              </div>
            }
        </>
    )
}

export default UserDetailModal
