import { BookOpenIcon} from 'lucide-react'
import { Button } from '../Button'
import ChapterItem from '../ChapterItem'
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { toast } from 'react-toastify';
import CreateLectureModal from '../modal/CreateLectureModal';
import { useDispatch } from 'react-redux';
import { setCreateChapterModalOpen } from '../../redux/features/appState/appState.slice';
import CreateChapterModal from '../modal/CreateChapterModal';

const CreateCourseStep2 = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courseQuery = useQuery({
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

    return (
        <>
            <CreateLectureModal />
            <CreateChapterModal />
            <div className='bg-white mt-16 p-5 rounded-sm shadow-md shadow-gray-300'>
                <div className='flex flex-col items-center justify-start'>
                    <div className='w-full flex justify-between items-center text-blue-500'>
                        <div className='flex gap-3 items-center justify-start font-semibold text-lg'>
                            <span className='p-2 rounded-full'>
                                <BookOpenIcon className='w-10 h-10'/>
                            </span>
                            <span>Chương trình giảng dạy</span>
                        </div>
                        <Button 
                            size='lengthen' 
                            className='float-right' 
                            rounded='md' 
                            onClick={() => courseQuery.data?.data ? dispatch(setCreateChapterModalOpen({ open: true, courseId: courseQuery.data.data.id  })) : null}
                        >
                            Thêm chương
                        </Button>
                    </div>

                    <ul className='list-none w-2/3 m-auto flex flex-col gap-y-5 my-16'>
                        {
                            courseQuery.data?.data.chapters.sort((c1, c2) => c1.position - c2.position).map((chapter, _) => (
                                <ChapterItem key={chapter.id} chapter={chapter} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default CreateCourseStep2
