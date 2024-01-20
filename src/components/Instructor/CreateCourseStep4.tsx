import { BookOpenCheckIcon } from 'lucide-react'
import { useMutation, useQuery } from 'react-query'
import courseApi from '../../api/modules/course.api'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../popup/Loading'
import { Button } from '../Button'
import { CourseStatus } from '../../types/payload/enums/CourseStatus'

const CreateCourseStep4 = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['courseCreating', params.id],
        queryFn: async () => {
          if(params.id) {
            const {response, error} = await courseApi.getById(params.id)
            if(error) {
                toast.error(error.message)
                navigate("/")
                return Promise.reject(error)
            }
            if(response) return response
          } else {
            navigate("/")
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })

    console.log(data?.data)

    const mutation = useMutation({
        mutationFn: () => {
            if(!data?.data) {
                navigate("/")
                toast.error("Không thể lấy thông tin khóa học")
                return Promise.reject()
            } else {
                return courseApi.publishCourse(data.data.id)
            }
        },
        onSuccess(data) {
            if(data.error) {
                toast.error(data.error.message)
            } else {
                toast.success(data.response.data.message ?? "Đã gửi yêu cầu phê duyệt")
                navigate("/instructor/courses/uncompleted")
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    function checkBeforePublish() {
        if(data?.data) {
            const course = data.data
            if(!course.description || !course.requirement || !course.introduce || !course.price
                || !course.achievement || !course.topic || !course.image || !course.level
            ) {
                return false
            } else if(course.chapters.length === 0 || !course.chapters.every(c => c.lectures.length > 0 || c.lectures.every(l => l.videoStorage))) {
                return false;
            } else {
                if(data.data.status === CourseStatus.PUBLISHING) {
                    return false
                } else {
                    return true
                }
            }
        } else {
            return false;
        }
    }

    return (
        <>
            { mutation.isLoading && <Loading /> }
            <div className='w-full min-h-[20vh] rounded-sm shadow-md shadow-gray-300 bg-white p-5 my-10
            flex flex-col'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center justify-start gap-3 text-secondColor font-semibold text-lg'>
                        <BookOpenCheckIcon className='w-8 h-8'/>
                        <span className='text-2xl'>Xuất bản khóa học</span>
                    </div>
                </div>
                <div className='grid place-items-center text-xl w-1/3 bg-slate-100 border border-gray-200 rounded-md
                h-[200px] text-center p-8 mx-auto my-10'>
                    <span>
                        {
                            data?.data.status === CourseStatus.PUBLISHING 
                            ? "Bạn đã xuất bản khóa học này"
                            : "Kiểm tra lại thông tin trước khi xuất bản"
                        }
                    </span>
                </div>
                <Button 
                    variant='blueContainer' 
                    rounded='md' 
                    type='submit' 
                    disabled={!checkBeforePublish()} 
                    className='w-1/3 mx-auto mb-10'
                    onClick={() => mutation.mutate()}
                >
                    {
                        data?.data.status === CourseStatus.PUBLISHING 
                            ? "Bạn đã xuất bản khóa học này"
                            : "Gửi yêu cầu phê duyệt"
                    }
                </Button>
            </div>
        </> 
    )
}

export default CreateCourseStep4
