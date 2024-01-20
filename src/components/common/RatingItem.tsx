import { CourseRating } from '../../types/model/CourseRating'
import { useQuery } from 'react-query'
import userApi from '../../api/modules/user.api'
import { getImage } from '../../util/utils'
import Rating from '../Rating'

const RatingItem = ({ courseRating }: { courseRating: CourseRating }) => {
    const userOfRating = useQuery({
        queryKey: ['userOfRating', courseRating.id.userID],
        queryFn: async () => {
            const { response, error } = await userApi.getById(courseRating.id.userID);
            if(response) return response.data
            if(error) return Promise.reject()
        }
    }) 
    
    return (
        <div className='w-full p-5 flex items-center justify-between gap-x-3'>
            {
                userOfRating.data && userOfRating.data.avatar?.url
                    ?   <img 
                            src={getImage(userOfRating.data.avatar.url)} 
                            alt="" 
                            className='rounded-full w-[50px] h-[50px] object-contain self-start border border-gray-200'
                        />
                    :   <div className='w-[50px] h-[50px] rounded-full bg-black text-white font-bold grid place-items-center'>
                            <span>{ userOfRating.data?.fullName?.charAt(0) }</span>
                        </div>
            }
            <div className='flex-1 flex flex-col gap-y-3 rounded-md bg-gray-50 p-3'>
                <div className='flex flex-col'>
                    <span className='font-semibold'>{ userOfRating.data?.fullName }</span>
                    <Rating readOnly rating={courseRating.rating} variant='outline' size='xsmall'/>
                </div>
                <p>{ courseRating.comment }</p>
            </div>
        </div>
    )
}

export default RatingItem
