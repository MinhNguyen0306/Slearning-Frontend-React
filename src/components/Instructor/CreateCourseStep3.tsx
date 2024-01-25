import { HelpCircleIcon  } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { toast } from 'react-toastify';
import QuestionChapterItem from '../QuestionChapterItem';
import EditQuestionModal from '../modal/EditQuestionModal';
import ExplanationModal from '../modal/ExplanationModal';

const CreateCourseStep3 = () => {
    const params = useParams();
    const navigate = useNavigate();

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
            navigate("/", { replace: true })
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })

    return (
        <>
            <EditQuestionModal />
            <ExplanationModal />
            <div className='w-full min-h-[20vh] rounded-sm shadow-md shadow-gray-300 bg-white p-5 my-10
            flex flex-col'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center justify-start gap-3 text-secondColor font-semibold text-lg'>
                        <HelpCircleIcon className='w-8 h-8'/>
                        <span className='text-2xl'>Thêm câu hỏi ôn tập</span>
                    </div>
                    {/* <Button rounded='md'>
                        Thêm câu hỏi
                    </Button> */}
                </div>
                <ul className='flex flex-col gap-5 w-2/3 m-auto my-16'>
                    {
                        courseQuery.data?.data.chapters.sort((c1, c2) => c1.position - c2.position).map((chapter, _) => (
                            <QuestionChapterItem key={chapter.id} chapter={chapter} />
                        ))
                    }
                </ul>
            </div>
        </> 
    )
}

export default CreateCourseStep3
