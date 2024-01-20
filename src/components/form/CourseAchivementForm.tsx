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
import { courseAchievementSchema, CourseAchievementSchema } from '../../types/system/CourseAchievementSchema';
import { useMutation, useQueryClient } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { Tooltip } from 'react-tooltip';

const CourseAchivementForm = ({ achievement, courseId }: { courseId: string , achievement: string }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CourseAchievementSchema>({
        resolver: zodResolver(courseAchievementSchema),
    })

    const mutation = useMutation({
        mutationFn: (achievementForm: string) => courseApi.updateAchievement(courseId, achievementForm),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật achievement")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<CourseAchievementSchema> = async(values) => {
        mutation.mutate(values.achievement);
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Những gì đạt được sau khóa học</h3>
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
                            <>Sửa đạt được</>
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
                            {...register('achievement')} 
                            data-tooltip-id='achievementError'
                            data-tooltip-content={errors.achievement?.message}
                            defaultValue={achievement}
                            type='text'
                            disabled={isSubmitting}
                            placeholder='Nhập những gì đạt được'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full
                            mb-4"
                        />
                        <Tooltip id='achievementError'/>
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                            { isSubmitting || mutation.isLoading ? <Loader2Icon className='animate-spin' /> : "Lưu" }
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { achievement }
                    </span>
                )
            }
        </div>
    )
}

export default CourseAchivementForm
