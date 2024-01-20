import { cn } from '../../util/utils'
import { Lecture } from '../../types/model/Lecture'
import { CheckCircle2Icon, LockIcon, PlaySquareIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'


const LectureSidebarItem = ({ lecture, locked }: { lecture: Lecture, locked: number }) => {
    const { lectureId } = useParams();

    return (
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
    )
}

export default LectureSidebarItem
