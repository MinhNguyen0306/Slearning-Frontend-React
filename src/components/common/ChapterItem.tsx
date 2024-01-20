import { useState } from 'react'
import { cn } from '../../util/utils';
import { Chapter } from '../../types/model/Chapter';
import { ChevronDownIcon } from 'lucide-react';
import LectureItem from './LectureItem';

const ChapterItem = ({ chapter }: { chapter: Chapter }) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);

    function handleExpand() {
        setIsExpand(prev => !prev)
    }

    return (
        <div className='relative bg-white border-[1px] border-gray-300 rounded-md'>
            <div 
                className={cn('flex justify-between items-center py-2 px-5 border-b-[1px] border-gray-300 bg-gray-200',
                'cursor-pointer gap-x-3', {
                    "border-none": isExpand === false
                })}
                onClick={handleExpand}
            >
                <div className='h-full flex items-center justify-start gap-3 flex-1'>
                    <span className='font-semibold'>
                        Chương { chapter.position }.
                    </span>
                    <span className='flex-1'>
                        { chapter.title }
                    </span>
                </div>
                <div className='flex items-center justify-end gap-5'>
                    <ChevronDownIcon className={cn('transition-transform duration-500',{
                        "rotate-180": isExpand
                        })}
                        onClick={handleExpand}
                    />
                </div>
            </div>
            <ul className={cn('w-full flex flex-col gap-2 items-center justify-start list-none p-5 transition-all duration-500', {
                "hidden": isExpand === false
            })}>
                {
                    chapter.lectures.sort((l1, l2) => l1.position - l2.position).map((lecture, _) => (
                        <li key={lecture.id} className='w-full'>
                            <LectureItem lecture={lecture}/>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ChapterItem
