import { useState } from 'react';
import {
    XIcon,
    EditIcon,
    Loader2Icon
} from "lucide-react"
import { Button } from '../Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { LectureTitleSchema, lectureTitleSchema } from '../../types/system/LectureTitleSchema';
import lectureApi from '../../api/modules/lecture.api';
import { Lecture } from '../../types/model/Lecture';
import { Tooltip } from 'react-tooltip';

const LectureTitleForm = ({ lecture }: { lecture: Lecture }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<LectureTitleSchema>({
        resolver: zodResolver(lectureTitleSchema),
    })

    const mutation = useMutation({
        mutationFn: (title: string) => lectureApi.updateTitle(lecture.id, title),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật tiêu đề")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<LectureTitleSchema> = async(values) => {
        console.log(values)
        // mutation.mutate(values.title)
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Tiêu đề chương</h3>
                {
                    isEditting ? (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsEditting(false)}
                        >
                            <XIcon />
                            <span>Hủy</span>
                        </span>
                    ) : (
                        <span 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsEditting(true)}
                        >
                            <EditIcon className="w-5 h-5"/>
                            <>Sửa tiêu đề</>
                        </span>
                    )
                }
            </div>
            {
                isEditting ? (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <input
                            {...register('title')} 
                            data-tooltip-id='title'
                            data-tooltip-content={errors.title?.message}
                            type='text'
                            disabled={isSubmitting}
                            placeholder='Nhập tiêu đề bài giảng'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full
                            mb-4"
                        />
                        <Tooltip id='title' />
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid} className='float-right'>
                            {
                                mutation.isLoading ? <Loader2Icon className='animate-spin'/> : "Lưu"
                            }
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { lecture.title }
                    </span>
                )
            }
        </div>
    )
}

export default LectureTitleForm
