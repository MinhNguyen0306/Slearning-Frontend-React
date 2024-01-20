import { EditIcon, TrashIcon } from 'lucide-react'
import { Question } from '../types/model/Question'
import { useDispatch } from 'react-redux'
import { setEditQuestionModal } from '../redux/features/appState/appState.slice';

const QuestionItem = ({ question }: { question: Question }) => {
    const dispatch = useDispatch();

    function handleOpenEditModal() {
        dispatch(setEditQuestionModal({ open: true, question: question }))
    }

    return (
        <div className='w-full flex justify-between items-center px-3 py-2 cursor-pointer bg-blue-50 rounded-md
        border-[1px] border-gray-300 hover:bg-blue-100 text-sm'
            onClick={handleOpenEditModal}
        >
            <div className='relative flex gap-5 justify-start items-center max-w-[60%]'>
                <span className='text-ellipsis whitespace-nowrap overflow-hidden'>
                    { question.question }
                </span>
            </div>
            <div className='flex justify-end items-center gap-3'>
                <EditIcon  className='w-5 h-5' />
                <TrashIcon className='w-5 h-5' />
            </div>
        </div>
    )
}

export default QuestionItem
