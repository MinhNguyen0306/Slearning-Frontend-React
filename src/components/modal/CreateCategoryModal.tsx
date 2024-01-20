import { Loader2Icon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setCreateCategoryModalOpen } from '../../redux/features/appState/appState.slice';
import { Button } from '../Button';
import { Tooltip } from 'react-tooltip';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CategorySchema, categorySchema } from '../../types/zod/CategorySchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import categoryApi from '../../api/modules/category.api';
import { toast } from 'react-toastify'; 
import { zodResolver } from '@hookform/resolvers/zod';
import DropdownMenu from '../DropdownMenu';

type Mode = 'category' | 'subCategory' | 'topic'

const CreateCategoryModal = () => {
    const dispatch = useDispatch();
    const createCategoryModalOpen = useSelector((state: RootState) => state.appState.createCategoryModalOpen);
    const [currentMode, setCurrentMode] = useState<Mode>('category');
    const [chosenCategory, setChosenCategory] = useState<string>('');
    const [chosenSub, setChosenSub] = useState<string>('');

    console.log(chosenCategory)
    console.log(chosenSub)

    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: {isSubmitting, isValid, errors} } = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema),
    })

    const categoryQuery= useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
          const { response, error } = await categoryApi.getAll()
          if(response) return response.data;
          if(error) {
            toast.error(error.message)
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })

    const subCategoryQuery = useQuery({
        queryKey: ['subCategories'],
        queryFn: async () => {
          const { response, error } = await categoryApi.getAllSubCategories()
          if(response) return response.data;
          if(error) {
            toast.error(error.message)
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })

    const mutation = useMutation({
        mutationFn: (title: string) => {
            if(currentMode === 'category') {
                return categoryApi.create(title)
            } else if(currentMode === 'subCategory') {
                return categoryApi.createSubCategory(title, chosenCategory)
            } else {
                return categoryApi.createTopic(title, chosenSub)
            }
        },
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries("categories")
                queryClient.invalidateQueries("subCategories")
                queryClient.invalidateQueries("topics")
                dispatch(setCreateCategoryModalOpen(false))
                toast.success("Đã cập nhật Danh muc")
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    const onSubmit: SubmitHandler<CategorySchema> = async(values) => {
        if(currentMode === 'subCategory' && chosenCategory === '') {
            toast.error('Ban chua chon danh muc')
            return;
        } else if (currentMode === 'topic' && chosenSub === '') {
            toast.error('Ban chua chon danh muc con')
            return;
        }
            
        mutation.mutate(values.category);
    }

    const handleClose = () => dispatch(setCreateCategoryModalOpen(false))

    function handleChangeMode() {
        switch (currentMode) {
            case 'category':
                setCurrentMode('subCategory');
                break;
            case 'subCategory':
                setCurrentMode('topic');
                break;
            case 'topic':
                setCurrentMode('category');
                break;
        }
    }

    return (
        <>
            {
                createCategoryModalOpen &&
                <div className='h-screen w-screen fixed z-[99999] top-0 left-0 bg-gray-800 bg-opacity-50
                    grid place-items-center overflow-hidden'>
                    <div className='w-1/4 max-h-[60%] m-auto bg-white rounded-md border-[1px] border-gray-300 flex flex-col
                     overflow-y-auto scrollbar-hide'>
                        <div className="self-end pt-2 pr-2 cursor-pointer">
                            <XCircleIcon className="hover:stroke-red-600" onClick={handleClose}/>
                        </div>

                        <div className='w-full h-[300px] flex flex-col justify-center gap-y-5 p-5'>
                            <Button 
                                variant='light' 
                                rounded='lg'
                                size='lg'
                                data-tooltip-id='state'
                                data-tooltip-content={
                                    currentMode === 'category' 
                                    ? 'click để tạo danh mục con' 
                                    : currentMode === 'subCategory' 
                                        ? 'click để tạo chủ đề' 
                                        : 'click để tạo danh mục'
                                }

                                onClick={handleChangeMode}
                            >
                                {
                                    currentMode === 'category'
                                        ? <span>Tạo danh mục</span>
                                        : currentMode === 'subCategory'
                                            ? <span>Tạo danh mục con</span>
                                            : <span>Tạo chủ đề</span>
                                }
                            </Button>
                            <Tooltip id='state' />

                            {
                                currentMode === 'subCategory' && categoryQuery.data
                                    ?   <div>
                                            <DropdownMenu 
                                                name='category'
                                                label='Chọn danh mục'
                                                dataset={categoryQuery.data?.content}
                                                valueKey='id'
                                                displayKey='title'
                                                onChange={(item) => setChosenCategory(item)}
                                            />
                                        </div>
                                    : null
                            }

                            {
                                currentMode === 'topic' && subCategoryQuery.data
                                    ?   <DropdownMenu
                                            name='subCategory'
                                            label='Chọn danh mục con'
                                            dataset={subCategoryQuery.data.content}
                                            valueKey='id'
                                            displayKey='title'
                                            onChange={(item) => setChosenSub(item)}
                                        />
                                    : null
                            }

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <input
                                    {...register('category')} 
                                    data-tooltip-id='category'
                                    data-tooltip-content={errors.category?.message}
                                    type='text'
                                    disabled={isSubmitting}
                                    placeholder='Nhập tiêu đề'
                                    className="outline-none px-2 py-2 rounded-md border-[1px] border-gray-300 w-full
                                    mb-4"
                                />
                                <Tooltip id='category' />
                                
                                <Button 
                                    type="submit" 
                                    rounded='md' 
                                    disabled={
                                        isSubmitting || !isValid || (currentMode === 'subCategory' && categoryQuery.data && !categoryQuery.data.content) || (currentMode === 'topic' && subCategoryQuery.data && !subCategoryQuery.data.content)
                                    } 
                                    className='float-right'
                                >
                                    { isSubmitting || mutation.isLoading ? <Loader2Icon className='animate-spin' /> : "Lưu" }
                                </Button>
                            </form>
                        </div>
                    </div>
                </div> 
            }
        </>
    )
}

export default CreateCategoryModal
