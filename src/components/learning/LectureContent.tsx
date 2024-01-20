import React, { useState } from 'react'
import DescriptionComponent from './DescriptionComponent';
import CommentComponent from './CommentComponent';
import NoteComponent from './NoteComponent';
import { tabbar } from '../../constants/tabbar.constant';
import { cn } from '../../util/utils';
import { LectureContentType } from '../../types/ui/Tabbar';
import { Lecture } from '../../types/model/Lecture';

const LectureContent = ({ lecture }: { lecture: Lecture }) => {
    const [type, setType] = useState<LectureContentType>('description');

    const onChangeTypeContent = (e: React.MouseEvent<HTMLLIElement>, type: LectureContentType) => {
        console.log(e.target)
        console.log(type)
        setType(type)
    }

    return (
        <div className='flex flex-col gap-5'>
            {/* Tabbar */}
            <ul className='flex gap-2 items-center justify-start font-semibold border-b-[1px] border-b-gray-950'>
                {
                    tabbar.lectureContentTabs.map((tab, index) => (
                        <li 
                            key={index}
                            className={cn('px-5 py-3 border-b-8 border-b-transparent hover:bg-blue-50 hover:text-blue-500',
                            'cursor-pointer', {
                                "border-b-8 border-b-secondColor text-blue-500 bg-blue-50": tab.type === type
                            })}
                            onClick={(e) => onChangeTypeContent(e, tab.type)}
                        >
                            {tab.display}
                        </li>
                    ))
                }
            </ul>
            {/* End Tabbar */}
            <div className='w-full bg-red-100 p-5'>
                { type ===  'description' && <DescriptionComponent description={lecture.description} />}
                { type === 'comment' && <CommentComponent /> }
                { type === 'note' && <NoteComponent /> }
            </div>
        </div>
    )
}

export default LectureContent
