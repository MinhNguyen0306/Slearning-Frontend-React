import { useState } from 'react';
import { XIcon, EditIcon } from "lucide-react";
import { Button } from '../Button';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { courseDescriptionSchema, CourseDescriptionSchema } from '../../types/system/CourseDescriptionSchema';
import ReactQuill from 'react-quill';
import courseApi from '../../api/modules/course.api';
import { useMutation, useQueryClient } from 'react-query';
import { Tooltip } from 'react-tooltip';

const CourseDescriptionForm = ({ description, courseId }: { courseId: string , description: string }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { control, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CourseDescriptionSchema>({
        resolver: zodResolver(courseDescriptionSchema),
    })

    const mutation = useMutation({
        mutationFn: (descriptionForm: string) => courseApi.updateDescription(courseId, descriptionForm),
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

    const onSubmit: SubmitHandler<CourseDescriptionSchema> = async(values) => {
        mutation.mutate(values.description);
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Mô tả khóa học</h3>
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
                            <>Sửa mô tả</>
                        </span>
                    )
                }
            </div>
            {
                isEditting ? (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <ReactQuill 
                                    {...field}
                                    data-tooltip-id='description'
                                    data-tooltip-content={errors.description?.message}
                                    defaultValue={description}
                                    theme='snow' 
                                    readOnly={isSubmitting}
                                    placeholder='Nhập mô tả khóa học'
                                    className='mb-4'
                                />
                            )}
                        />
                        <Tooltip id='description' />
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                            Lưu
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all" dangerouslySetInnerHTML={{ __html: description }} />
                )
            }
        </div>
    )
}

export default CourseDescriptionForm
