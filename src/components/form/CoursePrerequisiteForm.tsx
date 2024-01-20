import { useState } from 'react';
import { XIcon, EditIcon, Loader2Icon } from "lucide-react"
import { Button } from '../Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { courseRequirementSchema, CourseRequirementSchema } from '../../types/system/CourseRequirementSchema';
import courseApi from '../../api/modules/course.api';
import { useMutation, useQueryClient } from 'react-query';
import { Tooltip } from 'react-tooltip';

const CoursePrerequisiteForm = ({ requirement, courseId }: { courseId: string , requirement: string } ) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CourseRequirementSchema>({
        resolver: zodResolver(courseRequirementSchema),
    })

    const mutation = useMutation({
        mutationFn: (requirementForm: string) => courseApi.updateRequirement(courseId, requirementForm),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật requirement")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<CourseRequirementSchema> = async(values) => {
        mutation.mutate(values.requirement);
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Yêu cầu đối với khóa học</h3>
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
                            <>Sửa yêu cầu</>
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
                            {...register('requirement')}
                            data-tooltip-id='requirementError'
                            data-tooltip-content={errors.requirement?.message} 
                            defaultValue={requirement}
                            type='text'
                            disabled={isSubmitting}
                            placeholder='Nhập yêu cầu khóa học'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full
                            mb-4"
                        />
                        <Tooltip id='requirementError'/>
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                            { isSubmitting || mutation.isLoading ? <Loader2Icon className='animate-spin' /> : "Lưu" }
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { requirement }
                    </span>
                )
            }
        </div>
    )
}

export default CoursePrerequisiteForm
