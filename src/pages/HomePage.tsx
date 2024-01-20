import CourseList from '../components/CourseList';
import B1 from "../assets/b1.jpg";
import B2 from "../assets/b2.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from "swiper/modules";

const HomePage = () => {
  return (
    <div className='py-5'>
      <div className='h-[calc(100vh-80px-2.5rem)] bg-gradient-to-b from-gray-200 px-10 grid grid-cols-2 items-center gap-2 mb-24'>
        <div className='flex flex-col gap-2 font-bold text-3xl'>
          <h1>Slearning</h1>
          <h1>Nen tang hoc truc tuyen</h1>
        </div>
        <div className='relative h-[70%] flex'>
          <img src={B1} alt='Image' className='w-[200px] h-[200px] object-cover rounded-full m-auto'/>
        </div>
      </div>

      <CourseList label='Khóa học dành cho bạn' />
      <CourseList label='Khóa học phổ biến nhất' />

      <Swiper
        grabCursor={true}
        autoplay={{ 
          delay: 2000,
          disableOnInteraction: false
         }}
        modules={[Autoplay, Pagination]}
      >
        <SwiperSlide>
          <div className='p-5'>
            <img src={B1} className='object-cover rounded-md h-[400px] w-full'/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='p-5'>
            <img src={B2} className='object-cover rounded-md h-[400px] w-full'/>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className='grid grid-cols-2 gap-40 my-36'>
        <div className='flex flex-col gap-5 animate-homeLeftToRight'>
          <h1 className='text-xl font-bold text-mainColor'>Course Library</h1>
          <h1 className='text-4xl font-bold'>Learn from top technologists around the world</h1>
          <p>Keep your skills up-to-date with access to hundreds of labs and thousands
            of courses authored by our community of industry experts and partners.</p>
          <h1 className='text-lg font-bold text-mainColorBold'>Course Library</h1>
        </div>
        <div className=''>
          <img src={B1} className='w-full rounded-md' />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-40 my-36 items-center'>
        <div className=''>
          <img src={B1} className='w-full rounded-md' />
        </div>
        <div className='flex flex-col gap-5 animate-homeLeftToRight'>
          <h1 className='text-xl font-bold text-mainColor'>Course Library</h1>
          <h1 className='text-4xl font-bold '>Learn from top technologists around the world</h1>
          <p>Keep your skills up-to-date with access to hundreds of labs and thousands
            of courses authored by our community of industry experts and partners.</p>
          <h1 className='text-lg font-bold text-mainColorBold'>Course Library</h1>
        </div>
      </div>
    </div>
  )
}

export default HomePage
