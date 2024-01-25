import { SignalIcon } from "lucide-react";
import Top5Topic from "../../components/Instructor/statistic/Top5Topic";
import TurnOver from "../../components/Instructor/statistic/TurnOver";
import Top5Course from "../../components/Instructor/statistic/Top5Course";
import Top5Rate from "../../components/Instructor/statistic/Top5Rate";

const StatisticPage = () => {  
  return (
    <div className="flex flex-col gap-y-10 bg-white p-5 h-[1000px] mt-5">
      <div className="grid grid-cols-4 gap-5">
        <div className="shadow shadow-gray-300 bg-white p-5 rounded-md flex flex-col gap-y-5 font-semibold">
          <h2>Học viên</h2>
          <div className="flex items-center justify-between text-green-500">
            <SignalIcon className="w-8 h-8"/>
            <span>5</span>
          </div>
        </div>
        <div className="shadow shadow-gray-300 bg-white p-5 rounded-md flex flex-col gap-y-5 font-semibold">
          <h2>Khóa học đang xuất bản</h2>
          <div className="flex items-center justify-between text-blue-500">
            <SignalIcon className="w-8 h-8"/>
            <span>5</span>
          </div>
        </div>
        <div className="shadow shadow-gray-300 bg-white p-5 rounded-md flex flex-col gap-y-5 font-semibold">
          <h2>Tổng doanh thu</h2>
          <div className="flex items-center justify-between text-indigo-500">
            <SignalIcon className="w-8 h-8"/>
            <span>5</span>
          </div>
        </div>
        <div className="shadow shadow-gray-300 bg-white p-5 rounded-md flex flex-col gap-y-5 font-semibold">
          <h2>Bán chạy nhất</h2>
          <div className="flex items-center justify-between text-yellow-500">
            <SignalIcon className="w-8 h-8"/>
            <span>ReactJS</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center gap-5">
        <Top5Topic />
        <Top5Rate />
        <TurnOver />
        <Top5Course />
      </div>
    </div>
  )
}

export default StatisticPage
