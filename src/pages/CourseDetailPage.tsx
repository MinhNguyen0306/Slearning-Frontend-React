import { useEffect, useRef, useState } from 'react'
import { 
  ChevronRightIcon, 
  PlayCircleIcon, 
  Clock10Icon, 
  Tv2Icon, 
  GraduationCapIcon,
  CircleDollarSignIcon
} from "lucide-react";
import Rating from '../components/Rating';
import { cn, getImage } from '../util/utils';
import { Button } from '../components/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import courseApi from '../api/modules/course.api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ChapterItem from '../components/common/ChapterItem';
import { PublishStatus } from '../types/payload/enums/PublishStatus';
import RatingItem from '../components/common/RatingItem';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [totalRating, setTotalRating] = useState<number>(0);
  const rightBoxRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user.user)

  const { data } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if(id) {
        const { response, error } = await courseApi.getById(id)
        if(error) {
          toast.error("Lay thong tin khoa hoc that bai")
          navigate("/", { replace: true })
        } else {
          return response.data
        }
      } else {
        navigate("/", { replace: true })
        return Promise.reject()
      }
    }
  })

  const getRatings = useQuery({
    queryKey: ['ratingsOfCourse', id],
    queryFn: async () => {
      if(id) {
        const { response, error } = await courseApi.getRatings(id);
        if(response) return response.data
        if(error) {
          toast.error(error.response?.data.errorMessage ?? "Lay danh gia that bai")
          return Promise.reject()
        }
      } else {
        return Promise.reject();
      }
    },
    onSuccess(data) {
      if(data) {
        const sum = data.reduce((i, r) => i + r.rating, 0) / data.length;
        setTotalRating(sum)
      }
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })
  
  const handlePayment = async () => {
    navigate(`/payment/checkout?courseId=${data?.id}`, { state: { from: pathname } })
  }

  function checkCourseHasPayment() {
    const payments = user.payments
    if(payments && payments.length > 0) {
      const check = payments.some((p, _) => p.course.id === data?.id)
      return check
    }
  }

  function checkYourCourse() {
    const courses = user.courses
    if(courses && courses.length > 0) {
      const check = courses.some((c, _) => c.id === data?.id)
      return check
    }
  }

  useEffect(() => {
    let fixedBox = () => {
      if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        rightBoxRef.current?.classList.add('sticky')
      } 
    }

    window.addEventListener('scroll', fixedBox);
    return () => {
      window.removeEventListener('scroll', fixedBox);
    }
  }, [])

  return (
    <div className='flex gap-14 justify-between items-start my-7'>
      {/* Left Content */}
      <div className='flex flex-col flex-1 gap-5 h-[2000px] '>
        <div className='flex flex-col gap-y-4'>
          <div className='flex justify-start items-center gap-5 text-sm font-semibold text-blue-500'>
            <span>{ data?.topic.subCategory.category.title }</span>
            <ChevronRightIcon />
            <span>{ data?.topic.subCategory.title }</span>
            <ChevronRightIcon />
            <span>{ data?.topic.title }</span>
          </div>

          <h1 className='font-bold text-3xl mt-5'>
            { data?.title }
          </h1>
          <p className='font-bold text-xl'>
            { data?.introduce }
          </p>
          <div className='flex gap-4 items-center justify-start'>
            <span className='px-2 py-1 bg-mainColor'>
              BestSeller
            </span>
            <div className='flex items-center gap-1'>
              <Rating size="small" rating={totalRating} readOnly variant='outline' />
              <span>({ getRatings.data ? getRatings.data.length : 0 } lượt đánh giá)</span>
            </div>
            <span>{ data?.enrolls ? data.enrolls.length : 0 } ghi danh</span>
          </div>
          <span>
            Tạo bởi <span className='underline underline-offset-2 text-blue-500 cursor-pointer hover:text-blue-600'>
              { data?.user ? data.user.fullName : "No Name" }
            </span>
          </span>
        </div>

        <div className='p-5 rounded-md border-[1px] border-gray-300 bg-white mt-5'>
          <h1 className='font-bold text-xl mb-3'>Bạn sẽ học những gì</h1>
          <div className='flex flex-wrap gap-3 text-justify'>
            <p>{ data?.achievement }</p>
          </div>
        </div>

        <div className='p-5 rounded-md border-[1px] border-gray-300 bg-white'>
          <h1 className='font-bold text-xl mb-5'>Chương trình học</h1>
          <div className='flex flex-col gap-y-3'>
            {
              data?.chapters.filter(c => c.publishStatus === PublishStatus.PUBLISHING)
              .sort((c1, c2) => c1.position - c2.position).map((chapter, _) => (
                <ChapterItem key={chapter.id} chapter={chapter} />
              ))
            }
          </div>
        </div>

        <div className='p-5 rounded-md border-[1px] border-gray-300 bg-white'>
          <h1 className='font-bold text-xl mb-3'>Mô tả khóa học</h1>
          <div className='flex flex-wrap gap-3 text-justify'>
            <p dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}/>
          </div>
        </div>

        <div className='p-5 rounded-md border-[1px] border-gray-300 bg-white'>
          <h1 className='font-bold text-xl mb-3'>Yêu cầu</h1>
          <div className='flex flex-wrap gap-3 text-justify'>
            <p dangerouslySetInnerHTML={{ __html: data?.requirement ?? "" }}/>
          </div>
        </div>

        <div className='p-5 rounded-md border-[1px] border-gray-300 bg-white'>
          <h1 className='font-bold text-xl mb-3'>Đánh giá khóa học</h1>
          <ul className='flex flex-col gap-3'>
              {
                getRatings.data && getRatings.data.map((rating, _) => (
                  <RatingItem key={rating.id.courseID} courseRating={rating} />
                ))
              }
          </ul>
        </div>
      </div>
      {/* End Left Content */}

      {/* Right Content */}
      <div ref={rightBoxRef} className={cn("w-[30%] max-w-[350px] bg-white border-[1px] border-gray-300 flex flex-col mt-10",
      "top-[100px] transition-all duration-500")}>
        <div className='relative w-full h-[200px] cursor-pointer'>
          <img src={data?.image?.url ? getImage(data.image.url) : ""} alt='Image Course' className='filter w-full h-full opacity-70'/>
          <div className='absolute w-full h-full inset-0 grid place-items-center text-white'>
            <PlayCircleIcon className='w-[30%] h-[30%] fill-[rgba(255,255,255,0.6)] stroke-gray-800'/>
          </div>
        </div>
        <div className='flex flex-col gap-2 px-5 py-7'>
          <Button 
            variant={checkCourseHasPayment() ? "default" : "blueContainer"} 
            rounded='lg' 
            font='bold' 
            disabled={checkYourCourse()}
            onClick={checkCourseHasPayment() ? () => navigate("/learner/my-learning") : () => handlePayment()}
          >
            {
              checkYourCourse() 
                ? "Đây là khóa học của bạn"
                : checkCourseHasPayment()
                  ? "Xem khóa học đã mua"
                  : "Mua khóa học"
            }
          </Button>
          <h2 className='font-bold mt-2'>Khóa học bao gồm</h2>
          <div className='flex justify-between'>
            <div className='flex gap-5'>
              <Clock10Icon />
              <span>Thời lượng:</span>
            </div>
            <span>17 Gio</span>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-5'>
              <Tv2Icon />
              <span>Số lượng bài giảng:</span>
            </div>
            <span>{ data?.chapters.reduce((i, c) => i + c.lectures.length, 0) }</span>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-5'>
              <GraduationCapIcon />
              <span>Số lượt ghi danh:</span>
            </div>
            <span>{ data?.enrolls?.length }</span>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-5'>
              <CircleDollarSignIcon />
              <span>Giá:</span>
            </div>
            <span className='text-mainColorBold font-bold text-lg'>{ data?.price ? data.price + "VND" : "Miễn phí" }</span>
          </div>
        </div>
      </div>
      {/* End Right Content */}
    </div>
  )
}

export default CourseDetailPage