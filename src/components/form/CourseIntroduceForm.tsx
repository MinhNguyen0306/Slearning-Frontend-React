import { useState } from 'react';
import {
    XIcon,
    EditIcon
} from "lucide-react"
import { Button } from '../Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { courseIntroduceSchema, CourseIntroduceSchema } from '../../types/system/CourseIntroduceSchema';
import { useMutation, useQueryClient } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { Tooltip } from 'react-tooltip';
import { requestToken } from '../../firebase';
import { Notice } from '../../types/model/Notice';
import notificationApi from '../../api/modules/notification.api';

const CourseIntroduceForm = ({ introduce, courseId }: { courseId: string , introduce: string }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CourseIntroduceSchema>({
        resolver: zodResolver(courseIntroduceSchema),
    })

    const mutation = useMutation({
        mutationFn: (introduceForm: string) => courseApi.updateIntro(courseId, introduceForm),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật giới thiệu")
                requestToken().then(token => {
                    console.log(token)
                    const notice: Notice = {
                        title: "Xuất bản khóa học",
                        topic: courseId,
                        content: "Dat dang ky",
                        imageUrl: "",
                        deviceTokens: [String(token?.trim())]
                    }
                    notificationApi.sendNotification(notice, "http://127.0.0.1:5173/learner/profile")
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(error => console.log(error))
                }).catch((error) => console.log(error))
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<CourseIntroduceSchema> = async(values) => {
        mutation.mutate(values.introduce);
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Giới thiệu khóa học</h3>
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
                            <>Sửa giới thiệu</>
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
                            {...register('introduce')} 
                            data-tooltip-id='introduceError'
                            data-tooltip-content={errors.introduce?.message}
                            type='text'
                            defaultValue={introduce}
                            disabled={isSubmitting}
                            placeholder='Nhập giới thiệu khóa học'
                            autoComplete='off'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full
                            mb-4"
                        />
                        <Tooltip id='introduceError' />
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                            Lưu
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { introduce }
                    </span>
                )
            }
        </div>
    )
}

export default CourseIntroduceForm
