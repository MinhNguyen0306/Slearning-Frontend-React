import { ArrowBigUpDashIcon } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className=''>
      <div className="relative flex justify-start items-center h-[300px] bg-gray-950 text-white p-5">
        <div className="h-[80px] mr-40">
          <Logo />
        </div>
        <div className="flex gap-52">
          <div className='flex flex-col justify-center gap-2'>
              <h2>Kinh doanh trên Slearning</h2>
              <span>Dạy trên Slearning</span>
              <span>Liên hệ với chúng tôi</span>
              <span>Về chúng tôi</span>
              <span>Tải ứng dụng</span>
          </div>
          <div className='flex flex-col justify-center gap-2'>
              <h2>Nghề nghiệp</h2>
              <span>Blog</span>
              <span>Giúp đỡ và hỗ trợ</span>
              <span>Liên kết</span>
              <span>Nhà đầu tư</span>
          </div>
          <div className='flex flex-col justify-center gap-2'>
              <h2>Điều kiện</h2>
              <span>Điều khoản dịch vụ</span>
              <span>Chính sách bảo mật</span>
              <span>Cài đặt cookie</span>
              <span>Khiếu nại và phản hồi</span>
          </div>
        </div>
        <div 
          className='absolute bottom-1/2 right-6 w-[50px] h-[50px] flex items-center justify-center cursor-pointer bg-white rounded-sm
          border-2 border-gray-300 text-secondColor animate-bounce'
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <ArrowBigUpDashIcon />
        </div>
      </div>
    </div>
  )
}

export default Footer
