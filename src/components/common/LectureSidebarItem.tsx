import { cn } from '../../util/utils'
import { Lecture } from '../../types/model/Lecture'
import { CheckCircle2Icon, Code2Icon, LockIcon, PlaySquareIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import codingApi from '../../api/modules/coding.api'


const LectureSidebarItem = ({ lecture, locked }: { lecture: Lecture, locked: number }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { lectureId } = useParams();

    const exQuery = useQuery({
        queryKey: ['exQuery', lecture.id],
        queryFn: async () => {
            const { response, error } = await codingApi.getByLecture(lecture.id);
            if(response) return response.data
            if(error) return Promise.reject()
        }
    })

    function handleToCoding(e: React.MouseEvent<HTMLDivElement>, exId: number) {
        e.stopPropagation()
        navigate(`/learning/courses/${courseId}/coding-exercise/${exId}`)
    }

    return (
        <>
            <div className={cn('py-2 flex items-center justify-start hover:bg-sky-50',
            'cursor-pointer border-l-8 border-transparent', {
                'cursor-default hover:bg-transparent': locked === -1,
                'border-mainColor': lectureId === lecture.id
            })}>
                {
                    locked === -1 && <LockIcon className='w-6 h-6 mx-5 text-gray-400' />
                }
                {
                    locked === 0 && <PlaySquareIcon className='w-6 h-6 mx-5' />
                }
                {
                    locked === 1 && <CheckCircle2Icon className='w-6 h-6 mx-5 stroke-white fill-green-500' />
                }
                <div className={cn('w-full flex flex-col gap-1', {
                    'text-gray-400': locked === -1
                })}>
                    <span>
                        Bài { lecture.position }. { lecture.title }
                    </span>
                    <span className='text-xs'>
                        01:48
                    </span>
                </div>
            </div>
            {
                exQuery.data && exQuery.data.map(ex => (
                    <div key={ex.id} className={cn('flex items-center justify-start gap-x-2 px-7 py-4 cursor-pointer', {
                        'text-gray-400': locked === -1
                    })} onClick={(e) => handleToCoding(e, ex.id)}>
                        <Code2Icon className='w-5 h-5 mr-3'/>
                        <span>Bài tập coding: </span>
                        <span>{ex.title}</span>
                    </div>
                ))
            }
        </>
    )
}

export default LectureSidebarItem
