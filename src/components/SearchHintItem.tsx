import { useNavigate } from "react-router-dom";
import NoImg from "../assets/noimg.jpg";
import { Course } from "../types/model/Course";
import { cn, getImage } from '../util/utils';

const SearchHintItem = ({ course } : { course: Course }) => {
    const navigate = useNavigate();

  return (
    <div className="w-full flex gap-x-3 justify-start items-center hover:bg-blue-50 px-5 py-2"
    onClick={() => navigate(`/courses/${course.id}`)}>
        <img src={course.image ? getImage(course.image.url) : NoImg} className={cn("w-[35px] h-[35px] object-cover grid place-self-center rounded-full", {
            // "rounded-none": type === 'course'
        })}/>
        <div className="w-full flex flex-1 flex-col justify-center flex-wrap">
            <span className="max-w-[90%] font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
                { course.title }
            </span>
            <span className="text-gray-500 text-xs">
                {/* {
                    type === 'course' ? "Khóa học" : "Người hướng dẫn"
                } */}
                Khóa học
            </span>
        </div>
    </div>
  )
}

export default SearchHintItem
