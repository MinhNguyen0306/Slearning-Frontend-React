import { CodepenIcon, EditIcon, TrashIcon } from 'lucide-react'
import { Question } from '../types/model/Question'
import { useDispatch } from 'react-redux'
import { setEditQuestionModal, setExplanationModalState } from '../redux/features/appState/appState.slice';
import { Tooltip } from 'react-tooltip';

const QuestionItem = ({ question }: { question: Question }) => {
    const dispatch = useDispatch();

    function handleOpenEditModal() {
        dispatch(setEditQuestionModal({ open: true, question: question }))
    }

    function handleOpenExplanationModal(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        dispatch(setExplanationModalState({open: true, questionId: question.id, explanation: question.explanation ? question.explanation : ""}))
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
                <div
                    data-tooltip-id='explanation' 
                    data-tooltip-content={'Thêm giải thích'}
                    className='rounded-full hover:bg-gray-300 p-1'
                    onClick={(e) => handleOpenExplanationModal(e)}
                >
                    <CodepenIcon className='w-4 h-4 stroke-gray-800 stroke-[1.5px]'/>
                    <Tooltip id='explanation'/>
                </div>

                <EditIcon  className='w-4 h-4 stroke-gray-800 stroke-[1.5px]' />

                <div
                    data-tooltip-id='delete' 
                    data-tooltip-content={'Xóa câu hỏi'}
                    className='rounded-full hover:bg-gray-300 p-1'
                >
                    <TrashIcon className='w-4 h-4 stroke-gray-800 stroke-[1.5px]' />
                    <Tooltip id='delete'/>
                </div>
            </div>
        </div>
    )
}

export default QuestionItem
