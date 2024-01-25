import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from './Button'
import { ChevronDownIcon, LayoutGridIcon, Loader2Icon } from 'lucide-react'
import { cn } from '../util/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import LectureItem from './LectureItem';
import { Chapter } from '../types/model/Chapter';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import lectureApi from '../api/modules/lecture.api';
import { LectureSchema, lectureSchema } from '../types/system/LectureSchema';
import { Tooltip } from 'react-tooltip';

const ChapterItem = ({ chapter }: { chapter: Chapter }) => {
    const queryClient = useQueryClient();
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [isAddingLecture, setIsAddingLecture] = useState<boolean>(false);

    const { register, handleSubmit, formState: { isValid, isSubmitting, errors } } = useForm<LectureSchema>({
        resolver: zodResolver(lectureSchema)
    })

    function handleAddingLecture(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        setIsExpand(prev => !prev)
        setIsAddingLecture(prev => !prev)
    }

    function handleExpand() {
        setIsExpand(prev => !prev)
        setIsAddingLecture(false)
    }

    const mutation = useMutation({
        mutationFn: ({title, description}: {title: string, description?: string}) => lectureApi.create(chapter.id, title, description),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("courseCreating")
                setIsExpand(false)
                setIsAddingLecture(false)
                toast.success("Đã thêm bài giảng")
            } else {
                toast.error(data.error.message ?? "Thêm bài giảng thất bại")
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmitLecture: SubmitHandler<LectureSchema> = async(values) => {
        mutation.mutate(values)
    }

    return (
        <div className='relative bg-white border-[1px] border-gray-300 rounded-md text-sm'>
            <div 
                className={cn('flex justify-between items-center py-2 px-5 border-b-[1px] border-gray-300 bg-gray-200',
                'cursor-pointer gap-x-3', {
                    "border-none": isExpand === false
                })}
                onClick={handleExpand}
            >
                <div className='h-full flex items-center justify-start gap-3 flex-1'>
                    <LayoutGridIcon 
                        className='cursor-grab'
                    />
                    <div className='flex-1 flex items-center justify-start gap-x-3 break-all'>
                        <span className='min-w-[13%] max-w-[15%]'>Chương { chapter.position }.</span>
                        <span className='flex-1'>{ chapter.title }</span>
                    </div>
                </div>
                <div className='flex items-center justify-end gap-5'>
                    <Button variant='blueOutline' rounded='lg' onClick={(event) => handleAddingLecture(event)}>
                        Thêm bài giảng
                    </Button>
                    <ChevronDownIcon className={cn('transition-transform duration-500',{
                        "rotate-180": isExpand
                        })}
                        onClick={handleExpand}
                    />
                </div>
            </div>
            <form 
                onSubmit={handleSubmit(onSubmitLecture)} 
                className={cn('flex flex-col px-5 my-5 gap-3', {
                    "hidden": !isAddingLecture 
                })}
            >
                <input
                    {...register('title')}
                    data-tooltip-id='title'
                    data-tooltip-content={ errors.title?.message }
                    type='text'
                    placeholder='Nhập tiêu đề bài giảng'
                    disabled={isSubmitting}
                    autoComplete='off'
                    className='w-full py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                />
                <Tooltip id='title'/>

                <input
                    {...register('description')}
                    data-tooltip-id='descError'
                    data-tooltip-content={ errors.description?.message }
                    type='text'
                    placeholder='Nhập mo ta bài giảng'
                    disabled={isSubmitting}
                    autoComplete='off'
                    className='w-full py-2 px-5 outline-none border-[1px] border-gray-300 rounded-md'
                />
                <Tooltip id='descError'/>

                <Button disabled={isSubmitting || !isValid} type='submit' rounded='md' className='self-end'>
                    { mutation.isLoading ? <Loader2Icon className='animate-spin' />: <span>Lưu</span> }
                </Button>
            </form>
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
