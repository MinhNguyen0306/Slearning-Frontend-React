import { Lecture } from "../../types/model/Lecture"
import { PublishStatus } from "../../types/payload/enums/PublishStatus"

const LectureItem = ({ lecture }: { lecture: Lecture }) => {
    return (
        <div className='w-full flex justify-between items-center px-3 py-2 cursor-pointer bg-blue-50 rounded-md
        border-[1px] border-gray-300 hover:bg-blue-100 text-sm gap-x-3'
        >
            <div className='flex gap-2 justify-start items-center flex-grow'>
                
                <div className='flex-1 flex items-center justify-start gap-x-3 break-all'>
                    <span className='min-w-fit max-w-[15%]'>{ lecture.position }.</span>
                    <span className='flex-1'>{ lecture.title }</span>
                </div>
            </div>
            <div className='flex justify-end items-center gap-3'>
                {
                    lecture.previewed && <span className='px-5 py-1 text-white bg-cyan-900 rounded-3xl
                    text-xs font-semibold'>
                        Preview
                    </span>
                }
                {
                    lecture.publishStatus === PublishStatus.PUBLISHING && <span className='px-5 py-1 text-secondColor border-[1px] border-secondColor rounded-3xl
                    text-xs font-semibold'>
                        Publishing
                    </span>
                }
            </div>
        </div>
    )
}

export default LectureItem
