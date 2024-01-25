import { EditIcon, LayoutGridIcon, PlaySquare, PlaySquareIcon, TrashIcon } from 'lucide-react'
import { Lecture } from '../types/model/Lecture'
import { useDispatch } from 'react-redux'
import { setCreateLectureModalOpen } from '../redux/features/appState/appState.slice';
import React, { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { PublishStatus } from '../types/payload/enums/PublishStatus';

const LectureItem = ({ lecture }: { lecture: Lecture }) => {
    const dispatch = useDispatch();

    function handleDeleteLecture(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <div className='w-full flex justify-between items-center px-3 py-2 cursor-pointer bg-blue-50 rounded-md
        border-[1px] border-gray-300 hover:bg-blue-100 text-sm gap-x-3 text-sm'
        onClick={() => dispatch(setCreateLectureModalOpen({ open: true, lecture: lecture }))}>
            <div className='flex gap-2 justify-start items-center flex-grow'>
                <div className='cursor-grab rounded-lg p-2 bg-none hover:bg-blue-300'>
                    <LayoutGridIcon />
                </div>
                <div className='flex-1 flex items-center justify-start gap-x-3 break-all'>
                    <span className='min-w-fit max-w-[15%]'>{ lecture.position }.</span>
                    <span className='flex-1'>{ lecture.title }</span>
                </div>
            </div>
            <div className='flex justify-end items-center gap-3 text-gray-800'>
                {
                    lecture.videoStorage?.url && <PlaySquareIcon />
                }
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
                {/* <EditIcon  className='w-5 h-5'/> */}
                <div 
                    data-tooltip-id='delete'
                    data-tooltip-content="Xóa bài giảng"
                    className='rounded-full w-8 h-8 grid place-items-center hover:bg-slate-300'
                    onClick={(e) => handleDeleteLecture(e)}
                >
                    <TrashIcon className='w-5 h-5'/>
                </div>
                <Tooltip  id='delete' />
            </div>
        </div>
    )
}

export default LectureItem
