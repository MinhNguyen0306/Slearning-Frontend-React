import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store';
import { XCircleIcon } from 'lucide-react';
import { setCreateChapterModalOpen } from '../../redux/features/appState/appState.slice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LectureSchema, lectureSchema } from '../../types/system/LectureSchema';
import chapterApi from '../../api/modules/chapter.api';
import initialState from '../../redux/features/appState/appState.selector';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { Button } from '../Button';

const CreateChapterModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { open, chapter, courseId } = useSelector((state: RootState) => state.appState.createChapterModalOpen);
    function handleClose() {
        dispatch(setCreateChapterModalOpen(initialState.createChapterModalOpen))
    }

    const { register, handleSubmit, formState: { isValid, isSubmitting, errors } } = useForm<LectureSchema>({
        resolver: zodResolver(lectureSchema)
    })

    const onSubmit: SubmitHandler<LectureSchema> = async(values) => {
        mutation.mutate(values)
    }

    const mutation = useMutation({
        mutationFn: ({title, description}: {title: string, description: string}) => chapterApi.create(courseId, title, description),
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("courseCreating")
                handleClose();
                toast.success("Đã thêm chương")
            } else {
                toast.error(data.error.message ?? "Thêm chương thất bại")
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    return (
        <>
            {
                open &&
                <div className='h-screen w-screen fixed z-[99999] inset-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/3 m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                    justify-center items-center gap-2'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <form 
                            onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col max-h-[500px] overflow-scroll gap-y-5 mb-8 w-full px-10
                            [&>div>label]:font-bold [&>div>label]:mb-2'
                        >
                            <input
                                {...register('title')}
                                data-tooltip-id='title'
                                data-tooltip-content={ errors.title?.message }
                                type='text'
                                placeholder='Nhập tiêu đề chuong'
                                disabled={isSubmitting}
                                className='w-full py-2 px-5 outline-none border-[1px] border-gray-500 rounded-md'
                            />
                            <Tooltip id='title'/>

                            <textarea 
                                {...register('description')}
                                data-tooltip-id="description"
                                data-tooltip-content={errors.description?.message}
                                id="about" 
                                placeholder="Nhập mô tả chương"
                                className="h-[200px] border-[1px] p-2 outline-none border-gray-500 rounded-md px-3 resize-none"
                            />
                            <Tooltip id="description" /> 

                            <Button type="submit" variant='blueContainer' rounded='md' disabled={!isValid || isSubmitting}>
                                Luu
                            </Button>
                        </form>
                    </div>
                </div> 
            }
        </>
    )
}

export default CreateChapterModal
