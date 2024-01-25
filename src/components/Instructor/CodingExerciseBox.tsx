import { AlertTriangleIcon, Code2Icon, CodeIcon, EditIcon, Trash2Icon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"
import { CodingExercise } from "../../types/model/CodingExercise"
import { PublishStatus } from "../../types/payload/enums/PublishStatus"

type Props = {
    courseId?: string,
    codingExercise: CodingExercise
}

const CodingExerciseBox = ({ courseId, codingExercise }: Props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function onEditExercise(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        navigate(`/instructor/courses/${courseId}/coding-exercise/${codingExercise.id}/choose-language`, {
            state: { from: pathname }
        })
    }

    return (
        <div className="text-sm w-full border border-gray-300 rounded-md bg-green-200 px-3 py-2 flex justify-between items-center">
            <div className="flex items-center justify-start gap-x-2">
                {
                    codingExercise.publishStatus === PublishStatus.UN_PUBLISHING
                    && <>
                        <AlertTriangleIcon className="stroke-white w-5 h-5 fill-yellow-500"/>
                        <span>Chưa xuất bản:</span>
                    </>
                }
                <Code2Icon className="w-4 h-4 stroke-[1.5px] stroke-gray-800"/>
                <span>{ codingExercise.title }</span>
            </div>
            <div className="flex justify-end items-end gap-x-2">
                <div
                    data-tooltip-id='editCoding' 
                    data-tooltip-content={'Sửa'}
                    className='rounded-full hover:bg-gray-100 p-1 cursor-pointer'
                    onClick={onEditExercise}
                >
                    <EditIcon className='w-4 h-4 stroke-gray-800 stroke-[1.5px]'/>
                    <Tooltip id='editCoding'/>
                </div>
                <div
                    data-tooltip-id='deleteCoding' 
                    data-tooltip-content={'Xóa'}
                    className='rounded-full hover:bg-gray-100 p-1 cursor-pointer'
                >
                    <Trash2Icon className='w-4 h-4 stroke-gray-800 stroke-[1.5px]'/>
                    <Tooltip id='deleteCoding'/>
                </div>
            </div>
        </div>
    )
}

export default CodingExerciseBox
