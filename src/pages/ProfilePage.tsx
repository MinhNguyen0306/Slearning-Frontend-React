import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../components/Button'
import { RootState } from '../redux/store'
import { setAboutModalOpen, setWorkExperienceModalOpen } from '../redux/features/appState/appState.slice';
import WorkExperienceModal from '../components/modal/WorkExperienceModal';
import AboutModal from '../components/modal/AboutModal';
import { EditIcon } from 'lucide-react';
import { useMutation } from 'react-query';
import userApi from '../api/modules/user.api';
import { ApiResponse } from '../types/payload/response/ApiResponse';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { UserStatus } from '../types/model/User';
import { cn } from '../util/utils';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user)
  const [userStatus, setUserStatus] = useState<UserStatus>(user.userStatus);
  
  const mutation = useMutation({
    mutationFn: () => userApi.registerInstructor(user.id),
    onSuccess: (data) => {
      if(data.error) {
        toast.error(data.error.response?.data.message)
      } else {
        if(data.response.data.status === 'failed') {
          toast.error("Gui yeu cau that bai")
        } else {
          setUserStatus('PENDING');
          toast.success("Da gui yeu cau")
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  return (
    <>
      <WorkExperienceModal />
      <AboutModal user={user}/>
      <div className='flex flex-col gap-5 items-start justify-start'>
        {/* Account Status */}
        <div className='w-full rounded-md p-5 flex flex-col gap-y-3 bg-white border-[1px] border-gray-300'>
          <div className='flex justify-between items-center'>
            <h2 className={cn('font-semibold', {
              "mb-2": !user.instructor,
            })}>Trạng thái tài khoản</h2>
            { 
              userStatus === 'PENDING' && <div className='flex items-center justify-end gap-x-2'>
                <i className='w-3 h-3 rounded-full bg-yellow-400'></i>
                <span className='font-semibold'>Đang chờ phản hồi</span>
              </div> 
            }
            { 
              userStatus === 'ACTIVE' && <div className='flex items-center justify-end gap-x-2'>
                <i className='w-3 h-3 rounded-full bg-green-500'></i>
                {
                  user.instructor 
                    ? <span className='font-semibold'>Tài khoản người dạy</span>
                    : <span className='font-semibold'>Đang hoạt động</span>
                }
              </div> 
            }
            { 
              userStatus === 'LOCK' && <div className='flex items-center justify-end gap-x-2'>
                <i className='w-3 h-3 rounded-full bg-red-500'></i>
                <span className='font-semibold'>Bị khóa</span>
              </div> 
            }
          </div>

          {
            !user.instructor &&
            <div className='flex items-center justify-between bg-gray-100 rounded-md p-5 text-gray-600 '>
                <p className='flex-1'>Tài khoản của bạn chưa là mentor. Cập nhật các thông tin bắt buộc "Về bản thân", "Lĩnh vực giảng dạy",
                  "Kinh nghiệm làm việc" và chọn đăng ký mentor để trở thành mentor và xuất bản các khóa học trên Slearning.
                </p>
                <Button 
                  variant='blueContainer' 
                  disabled={ !user.about || !user.avatar || user.workExperiences.length === 0 || userStatus === 'PENDING'  }  
                  className='w-[25%]'
                  onClick={() => mutation.mutate()}
                >
                    { userStatus === 'PENDING' ? <span>Đã yêu cầu</span> : <span>Đăng ký mentor</span> }
                </Button>
            </div>
          }
        </div>
        {/* End Account status */}

        {/* Work History */}
        <div className='w-full rounded-md p-5 flex flex-col gap-y-3 bg-white border-[1px] border-gray-300'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold mb-2 tracking-wide'>Kinh nghiệm làm việc</h2>
            {
              user.workExperiences && user.workExperiences.length > 0 && 
                <Button variant='blueOutline' rounded='md' className='w-[10%]' onClick={() => dispatch(setWorkExperienceModalOpen(true))}>
                  Thêm
                </Button>
            }
          </div>
          {
            user.workExperiences?.length === 0 ? (
              <div className='flex items-center justify-between bg-gray-100 rounded-md p-5 text-gray-600 '>
                  <p className='flex-1'>Add your past work experience here. If you’re just starting out, you can add 
                    internships or volunteer experience instead.
                  </p>
                  <Button variant='blueOutline' className='w-[25%]' onClick={() => dispatch(setWorkExperienceModalOpen(true))}>
                      Thêm kinh nghiệm
                  </Button>
              </div>
            ) : (
              <ul className='flex flex-col gap-y-5 mt-4 text-sm'>
                {
                  user.workExperiences?.map(item => (
                    <li key={item.id}>
                      <div className='flex justify-between items-start'>
                        <div className=''>
                          <h3 className='font-semibold'>{item.position} at {item.position} <span className='font-normal'>{item.startDate} den {item.endDate}</span></h3>
                          <span>{item.description}</span>
                        </div>
                        <EditIcon className='hover:text-gray-700 cursor-pointer text-blue-700' />
                      </div>
                    </li>
                  ))
                }
              </ul>
            ) 
          }
        </div>
        {/* End Work History */}

        {/* About */}
        <div className='w-full rounded-md p-5 flex flex-col gap-y-3 bg-white border-[1px] border-gray-300'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold mb-2'>Giới thiệu bản thân</h2>
            { 
              user.about && <EditIcon 
                className='hover:text-gray-700 cursor-pointer text-blue-700' 
                onClick={() => dispatch(setAboutModalOpen({ open: true, prevAbout: user.about || "" }))}
              /> 
            }
          </div>
          {
            !user.about ? (
              <div className='flex items-center justify-between bg-gray-100 rounded-md p-5 text-gray-600'>
                <p className='flex-1'>
                  Them doi loi gioi thieu ve banr than cua ban
                </p>
                <Button 
                  variant='blueOutline' 
                  className='w-[25%]' 
                  onClick={() => dispatch(setAboutModalOpen({ open: true, prevAbout: user.about || "" }))}
                >
                  Thêm giới thiệu
                </Button>
              </div>
            ) : (
              <p className='break-all'>
                { user.about }
              </p>
            )
          }
        </div>
        {/* End About */}

        {/* Specialty */}
        <div className='w-full rounded-md p-5 flex flex-col gap-y-3 bg-white border-[1px] border-gray-300'>
          <h2 className='font-semibold mb-2'>Lĩnh vực giảng dạy</h2>
          <div className='flex items-center justify-between bg-gray-100 rounded-md p-5 text-gray-600'>
            <p className='flex-1'>
              Thêm lĩnh vu
            </p>
            <Button variant='blueOutline' className='w-[25%]'>
              Thêm lĩnh vực
            </Button>
          </div>
        </div>
        {/* End Specialty */}
      </div>
    </>
  )
}

export default ProfilePage
