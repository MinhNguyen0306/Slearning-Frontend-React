import { useState } from 'react';
import { XIcon, EditIcon, Loader2Icon } from "lucide-react";
import { Button } from '../Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { Tooltip } from 'react-tooltip';
import { PriceSchema, priceSchema } from '../../types/zod/PriceSchema';
 
const CoursePriceForm = ({ price, courseId }: { courseId: string , price: number }) => {
    const queryClient = useQueryClient();
    const [isEditting, setIsEditting] = useState<boolean>(false);

    const { register, handleSubmit, formState: { isSubmitting, isValid, errors } } = useForm<PriceSchema>({
        resolver: zodResolver(priceSchema),
    })

    const mutation = useMutation({
        mutationFn: (priceForm: number) => courseApi.updatePrice(courseId, priceForm),
        onSuccess(data) {
            if(data.response) {
                setIsEditting(false);
                queryClient.invalidateQueries("courseCreating")
                toast.success("Đã cập nhật giá")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<PriceSchema> = async(values) => {
        mutation.mutate(values.price);
    }

    return (
        <div className="flex flex-col w-full p-5 border-[1px] gap-3
        border-gray-300 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center font-semibold">
                <h3>Giá khóa học</h3>
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
                            <>Sửa giá</>
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
                            {...register('price')} 
                            data-tooltip-id='price'
                            data-tooltip-content={errors.price?.message}
                            defaultValue={price}
                            type='number'
                            disabled={isSubmitting}
                            placeholder='Nhập giá khóa học'
                            min={0}
                            autoComplete='off'
                            className="outline-none px-2 py-1 rounded-md border-[1px] border-gray-300 w-full appearance-none
                            mb-4"
                        />
                        <Tooltip id='price' />
                        
                        <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                            { isSubmitting || mutation.isLoading ? <Loader2Icon className='animate-spin' /> : "Lưu" }
                        </Button>
                    </form>
                ) : (
                    <span className="text-sm break-all">
                        { price } VND
                    </span>
                )
            }
        </div>
    )
}

export default CoursePriceForm
