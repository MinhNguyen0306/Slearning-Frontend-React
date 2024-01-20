import React from 'react'
import { Button } from '../Button'
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
import {
    XIcon,
    EditIcon
} from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseTitleSchema, CourseTitleSchema } from "../../types/system/CourseTitleSchema";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import courseApi from '../../api/modules/course.api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';


const CreateCourseDraft = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CourseTitleSchema>({
        resolver: zodResolver(courseTitleSchema),
    })

    const mutation = useMutation({
        mutationFn: (title: string) => courseApi.createDraft(user.id, title),
        onSuccess(data) {
            if(data.response) {
                navigate(`/instructor/courses/${data.response.data.id}/create/step/1`)
                toast.success("Da tao ban nhap")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<CourseTitleSchema> = async(values) => {
        mutation.mutate(values.title)
    }


    return (
        <div className="bg-white h-[calc(100vh-8rem)] p-5 flex flex-col items-center justify-center gap-5 mb-32 mt-5">
            <h1 className='font-bold text-4xl'>Dat tieu de cho khoa hoc cua ban</h1>
            <span>Khoa hoc se duoc tao ban nhap va tieu de co the chinh sua sau nay</span>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-1/4 flex flex-col justify-center gap-3'
            >
                <input
                    {...register('title')} 
                    data-tooltip-id='title'
                    data-tooltip-content={errors.title?.message}
                    type='text'
                    disabled={isSubmitting}
                    placeholder='Nhập tiêu đề khóa học'
                    className="outline-none px-3 py-2 rounded-md border-[1px] border-gray-300 w-full
                    mb-4"
                />
                <Tooltip id='title' />
                
                <Button type="submit" rounded='md' disabled={isSubmitting || !isValid}>
                    Tiếp theo
                </Button>
            </form>
        </div>
    )
}

export default CreateCourseDraft
