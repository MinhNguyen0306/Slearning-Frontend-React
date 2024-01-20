import { Courses } from '../types/model/Course';
import CourseBox from './CourseBox';
import B1 from "../assets/b1.jpg";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation'
import React from 'react';
import { cn } from '../util/utils';
import { useQuery } from 'react-query';
import courseApi from '../api/modules/course.api';
import { toast } from 'react-toastify';
import { CourseStatus } from '../types/payload/enums/CourseStatus';

type Props = {
    label?: string;
    type?: string
}

const CourseList = ({ label }: Props) => {
  const swiperRef = React.useRef<SwiperClass>()
  const [activeIndex, setActiveIndex] = React.useState<number>(0)

  // Phai query theo status... Gio test truoc
  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { error, response } = await courseApi.getByStatus(CourseStatus.PUBLISHING, { pageNumber: 0, pageSize: 999 })
      if(error) {
        toast.error("Fetch data that bai")
        return Promise.reject()
      } else {
        return response.data
      }
    }
  })

  return (
    <div className='w-full flex flex-col gap-5 mb-12'>
        {
          label && <h1 className='text-2xl font-bold'>{label}</h1>
        }
        <div>
            <Swiper
                className='relative group'
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                onActiveIndexChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={5}
                navigation={{ 
                    nextEl: ".button-next-slide",
                    prevEl: ".button-prev-slide",
                 }}
                modules={[Navigation]}
            >
                {
                    coursesQuery.data?.content.map((course) => (
                        <SwiperSlide key={course.id}>
                            <CourseBox course={course} />
                        </SwiperSlide>
                    ))
                }
                <div className={cn(`button-prev-slide absolute cursor-pointer top-1/2 -left-[23rem] duration-500
                    w-[40px] h-[40px] bg-black rounded-full text-white -translate-y-1/2 z-50 grid 
                    place-items-center`, {
                    "group-hover:left-0": activeIndex > 0
                })}>
                    <ChevronLeftIcon />
                </div>
                <div className={cn(`button-next-slide absolute cursor-pointer top-1/2 -right-[23rem] duration-500 w-[40px] h-[40px] bg-black rounded-full text-white
                -translate-y-1/2 z-50 grid place-items-center`, {
                    "group-hover:right-0": activeIndex < Math.ceil(coursesQuery.data ? coursesQuery.data.content.length / 2 : 0)
                })}>
                    <ChevronRightIcon />
                </div>
           </Swiper>
        </div>
    </div>
  )
}

export default CourseList
