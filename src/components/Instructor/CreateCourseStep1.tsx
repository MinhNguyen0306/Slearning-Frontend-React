import { useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import DropdownMenu from '../../components/DropdownMenu';
import CourseTitleForm from '../form/CourseTitleForm';
import CourseIntroduceForm from '../form/CourseIntroduceForm';
import CourseDescriptionForm from '../form/CourseDescriptionForm';
import CourseAchivementForm from '../form/CourseAchivementForm';
import CoursePrerequisiteForm from '../form/CoursePrerequisiteForm';
import CourseImageForm from '../form/CourseImageForm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import courseApi from '../../api/modules/course.api';
import { toast } from "react-toastify";
import { getImage } from '../../util/utils';
import { PageRequest } from '../../types/payload/PageRequest';
import categoryApi from '../../api/modules/category.api';
import CoursePriceForm from '../form/CoursePriceForm';

const CreateCourseStep1 = () => {
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [chosenCategory, setChosenCategory] = useState<string>()
    const [chosenSubCategory, setChosenSubCategory] = useState<string>()

    const { data } = useQuery({
        queryKey: ['courseCreating', params.id],
        queryFn: async () => {
          if(params.id) {
            const {response, error} = await courseApi.getById(params.id)
            if(error) {
                toast.error(error.message)
                navigate("/")
                return Promise.reject(error)
            }
            if(response) return response
          } else {
            navigate("/")
          }
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })

    const categoryQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
          const pageRequest: PageRequest = { pageSize: 999 }
          const { response, error } = await categoryApi.getAll(pageRequest)
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
        queryKey: ['subCategories', chosenCategory ],
        queryFn: async () => {
            const pageRequest: PageRequest = { pageSize: 9999 }
            if(chosenCategory) {
                const { response, error } = await categoryApi.getAllSubCategoriesOfCategory(chosenCategory, pageRequest)
                if(response) return response.data;
                if(error) {
                toast.error(error.message)
                }
            } else {
                return Promise.reject();
            }
        },
        enabled: chosenCategory !== undefined,
        onError: (error: Error) => {
          toast.error(error.message)
        }
    })
    
    const topicQuery = useQuery({
        queryKey: ['topics', chosenSubCategory],
        queryFn: async () => {
            const pageRequest: PageRequest = { pageSize: 999 }
            if(chosenSubCategory) {
                const { response, error } = await categoryApi.getAllTopicsOfSubCategory(chosenSubCategory, pageRequest)
                if(response) return response.data;
                if(error) {
                    toast.error(error.message)
                }
            } else {
                return Promise.reject();
            }
        },
        enabled: chosenSubCategory !== undefined,
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    const levelQuery = useQuery({
        queryKey: ['levels'],
        queryFn: async () => {
            const { response, error } = await categoryApi.getAllLevels()
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
        mutationFn: (topicId: string) => {
            if(data) {
                return courseApi.updateTopic(data.data.id, topicId)
            } else {
                toast.error("Không thể lấy dữ liệu")
                return Promise.reject(data)
            }
        }, 
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries('courseCreating');
                toast.success(data.response.data.message)
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message);
        }
    })

    const mutationLevel = useMutation({
        mutationFn: (levelId: number) => {
            if(data) {
                return courseApi.updateLevel(data.data.id, levelId)
            } else {
                toast.error("Không thể lấy dữ liệu")
                return Promise.reject(data)
            }
        }, 
        onSuccess(data) {
            if(data.response) {
                queryClient.invalidateQueries('courseCreating');
                toast.success(data.response.data.message)
            } else {
                toast.error(data.error.message)
            }
        },
        onError(error: Error) {
            toast.error(error.message);
        }
    }) 
    
    function handleChangeChosenCategory(item: string) {
        setChosenCategory(item)
    }

    function handleChangeChosenSubCategory(item: string) {
        setChosenSubCategory(item)
    }

    function handleChangeTopic(topicId: string) {
        if(topicId && topicId !== '') {
            mutation.mutate(topicId);
        }
    }

    function handleChangeLevel(levelId: number) {
        if(levelId) {
            mutationLevel.mutate(levelId)
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <h1 className='font-bold text-xl mt-10 mb-2'>Thông tin khóa học</h1>
            <div className='p-5 bg-white rounded-md shadow-md shadow-gray-300 flex flex-col items-start'>
                <div className='w-full grid grid-cols-2 gap-10 items-start'>
                    <div className='w-full flex flex-col gap-5 items-start justify-center'>
                        { data && <CourseTitleForm courseId={data.data.id} title={data.data.title} /> }
                        { data && <CoursePriceForm courseId={data.data.id} price={data.data.price} /> }
                        { data && <CourseIntroduceForm courseId={data.data.id} introduce={data.data.introduce} /> }
                        { data && <CourseDescriptionForm courseId={data.data.id} description={data.data.description} /> }
                        { data && <CourseAchivementForm courseId={data.data.id} achievement={data.data.achievement} /> }
                        { data && <CoursePrerequisiteForm courseId={data.data.id} requirement={data.data.requirement} /> }
                    </div>

                    <div className='w-full flex flex-col gap-5 items-end justify-center'>
                        <div className='w-full flex flex-col'>
                            <h2 className='block self-end font-medium mb-1'>Trình độ</h2>
                            <DropdownMenu 
                                label={data?.data.level ? data.data.level.title : 'Chọn trình độ'}
                                dataset={levelQuery.data || []} 
                                name='"level'
                                valueKey='id' 
                                displayKey='title' 
                                onChange={(i) => handleChangeLevel(i)}
                            />
                        </div>
                        <div className='w-full flex flex-col'>
                            <h2 className='block self-end font-medium mb-1'>Danh mục</h2>
                            <DropdownMenu 
                                label={data?.data.topic ? data.data.topic.subCategory.category.title : 'Chọn danh mục'}
                                dataset={categoryQuery.data?.content || []}
                                name='category'
                                valueKey='id' 
                                displayKey='title' 
                                onChange={(i) => handleChangeChosenCategory(i)}
                            />
                        </div>
                        <div className='w-full flex flex-col'>
                            <label htmlFor='description' className='block self-end font-medium mb-1'>Danh mục con</label>
                            <DropdownMenu 
                                name='sub'
                                label={data?.data.topic ? data.data.topic.subCategory.title : 'Chọn danh mục con'}
                                dataset={subCategoryQuery.data?.content || []} 
                                valueKey='id' 
                                displayKey='title' 
                                onChange={(i) => handleChangeChosenSubCategory(i)}
                            />
                        </div>
                        <div className='w-full flex flex-col'>
                            <label htmlFor='description' className='block self-end font-medium mb-1'>Chủ đề</label>
                            <DropdownMenu
                                label={data?.data.topic ? data.data.topic.title : 'Chọn chuyên đề'}
                                dataset={topicQuery.data?.content ?? []}
                                name='topic'
                                valueKey='id'
                                displayKey='title'
                                onChange={(i) => handleChangeTopic(i)}
                            />
                        </div>

                        { data 
                            ?   data.data.image 
                                    ?   <CourseImageForm courseId={data.data.id} imageUrl={getImage(data.data.image.url)} /> 
                                    :   <CourseImageForm courseId={data.data.id} /> 
                            :   null
                        }
                    </div>
                </div>
            </div>
      </div>
    )
}

export default CreateCourseStep1
