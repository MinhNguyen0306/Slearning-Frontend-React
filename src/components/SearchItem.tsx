import { useNavigate } from "react-router-dom";
import NoImg from "../assets/noimg.jpg";
import { Course } from '../types/model/Course';
import { getImage } from '../util/utils';

const SearchItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  return (
    <li 
      className='w-full bg-white border-[1px] border-gray-300 rounded-lg p-3 flex gap-3 cursor-pointer
      hover:scale-[101%] duration-500 group'
      onClick={() => navigate(`/courses/${course.id}`)}
    >
        <img src={course.image ? getImage(course.image.url): NoImg} alt='Image Course' className='max-w-[200px] h-[150px] rounded-sm'/>
        <div className='w-full flex flex-col flex-wrap gap-y-2 flex-4'>
            <span className='font-bold'>{ course.title }</span>
            <p>
              { course.introduce }
            </p>
            <span className='text-xs text-gray-500'>Được tạo bởi { course.user?.fullName }</span>
            {
              course.ratings && course.ratings.length > 0
                ? (
                  <div className="flex flex-col gap-2 px-1 py-2">

                  </div>
                )
                : (
                  <span className="text-xs text-gray-500">(Chưa có đánh giá)</span>
                )
            }
            <div className='flex justify-start gap-x-2 items-center text-xs text-gray-500'>
              <span>42 giờ học</span>
              <i className="w-1 h-1 rounded-full bg-green-500"></i>
              <span>{ course.chapters.reduce((i, c) => i + c.lectures.length, 0) } bài giảng</span>
              <i className="w-1 h-1 rounded-full bg-green-500"></i>
              <span>
                { course.level.title }
              </span>
            </div>
        </div>
        <div className='flex flex-1 flex-col justify-between'>
            <span className="whitespace-nowrap">{ course.price } VND</span>
            {/* <span className='py-1 px-2 rounded-md bg-mainColor font-semibold'>Bestseller</span> */}
        </div>
    </li>
  )
}

export default SearchItem
