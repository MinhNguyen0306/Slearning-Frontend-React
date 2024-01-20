import { useState } from 'react';
import {
    XIcon,
    EditIcon,
    Loader2Icon
} from "lucide-react"
import { Button } from '../Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { toast } from 'react-toastify';
import { LectureDescriptionSchema, lectureDescriptionSchema } from '../../types/system/LectureDescriptionSchema';
import { useMutation, useQueryClient } from 'react-query';
import { Lecture } from '../../types/model/Lecture';
import lectureApi from '../../api/modules/lecture.api';

interface Props {
    sectionId?: string
}

const LectureDescriptionForm = ({ lecture }: { lecture: Lecture }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<LectureDescriptionSchema>({
        resolver: zodResolver(lectureDescriptionSchema),
    })

    const mutation = useMutation({
        mutationFn: (description: string) => lectureApi.updateDescription(lecture.id, description),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật mo ta")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<LectureDescriptionSchema> = async(values) => {
        console.log(values)
        // mutation.mutate(values.title)
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Mô tả chương</h3>
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
                            Sửa mô tả
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
                            {...register('description')} 
                            type='text'
                            disabled={isSubmitting}
                            placeholder='Nhập mô tả bài giảng'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full
                            mb-4"
                        />
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid} className='float-right'>
                            {
                                mutation.isLoading ? <Loader2Icon className='animate-spin'/> : "Lưu"
                            }
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { lecture.description }
                    </span>
                )
            }
        </div>
    )
}

export default LectureDescriptionForm
