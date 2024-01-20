import { useNavigate } from 'react-router-dom'
import { Course } from '../types/model/Course'
import { getImage, numberWithCommas } from '../util/utils'
import Rating from './Rating'
import { useState } from 'react'
import courseApi from '../api/modules/course.api'
import { toast } from 'react-toastify'
import { useQuery } from 'react-query'

const CourseBox = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0)

  const getRatings = useQuery({
    queryKey: ['ratingsOfCourse', course.id],
    queryFn: async () => {
      if(course.id) {
        const { response, error } = await courseApi.getRatings(course.id);
        if(response) return response.data
        if(error) {
          return Promise.reject()
        }
      } else {
        return Promise.reject();
      }
    },
    onSuccess(data) {
      if(data) {
        const sum = data.reduce((i, r) => i + r.rating, 0) / data.length;
        setRating(sum)
      }
    },
    onError(error: Error) {
      console.log(error.message)
    }
  })

  return (
    <div 
      className='border-[1px] h-[300px] border-gray-200 cursor-pointer p-2 rounded-lg bg-white
      flex flex-col justify-start items-start hover:border-mainColor'
      onClick={() => navigate(`courses/${course.id}`)}
    >
      <img 
        src={course.image ? getImage(course.image.url) : ""} 
        alt='Image Course' 
        className='w-full h-[45%] object-cover rounded-sm'
      />
      <div className='flex flex-col gap-y-1 px-2 py-1'>
          <div className='break-words break-all mt-2'>
            <h2 className='boxTitle font-semibold'>
              { course.title }
            </h2>
          </div>
          {
            rating
              ? <div className='flex items-center justify-start gap-x-2'>
                <span className='font-bold'>{ rating }</span>
                  <Rating 
                    rating={rating} 
                    readOnly 
                    size='xsmall' 
                    variant='outline'
                  />
                  <span className='text-xs text-gray-400'>({ getRatings.data?.length })</span>
                </div>
              : <span className='text-xs text-gray-400 font-extralight'>Chưa có đánh giá</span>
          }
          <span>{ course.user?.fullName }</span>
          <div className='flex items-center justify-start font-semibold'>
            <span className='underline'>đ</span>
            <span>{ numberWithCommas(course.price) }</span>
          </div>
      </div>
    </div>
  )
}

export default CourseBox
