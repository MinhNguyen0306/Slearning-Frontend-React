import { BookCopyIcon } from "lucide-react"
import { Button } from "../../components/Button"
import { tabbar } from "../../constants/tabbar.constant"
import { cn } from "../../util/utils"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { Outlet, useNavigate } from "react-router-dom"
import SearchBox from "../../components/SearchBox"

const CoursePage = () => {
  const navigate = useNavigate();
  const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);
  const active = useSelector((state: RootState) => state.appState.activeState);

  return (
    <div className="bg-white h-[2000px] p-5 flex flex-col gap-10 mb-32 mt-5">
      <span className="flex gap-5 font-bold text-xl">
        <BookCopyIcon />
        <span>Khóa học</span>
      </span>

      <div className="w-full flex justify-between items-center px-8 py-5 border-[1px] border-gray-300 bg-white rounded-md">
        <h1 className="text-2xl font-bold">Tạo khóa học của bạn</h1>
        <Button variant='blueContainer' size='lengthen' rounded='md' onClick={() => navigate("/instructor/courses/create/draft")}>
          Tạo khóa học
        </Button>
      </div>

      <div className="block w-full border-[1px] border-gray-300 rounded-md">
        <ul className="flex cursor-pointer">
          {
            tabbar.mentorManageCoursesTabbar.map((tab, index) => (
              <li 
                key={index} 
                className="flex-1"
                onClick={() => navigate(tab.path)}
              >
                <div className={cn("py-4 px-3 text-center transition-all duration-500", {
                  "bg-secondColor text-white font-semibold": active && tab.state.includes(active),
                  "hover:bg-blue-50": active !== tab.state,
                  "rounded-tl-md rounded-bl-md": index === 0,
                  "rounded-tr-md rounded-br-md": index === tabbar.mentorManageCoursesTabbar.length - 1
                })}>
                  <span>{tab.display}</span>
                </div>
              </li>
            ))
          }
        </ul>
      </div>

      <div className="w-[45%] mx-auto">
        <SearchBox />
      </div>

      <div className={cn("max-w-full",{
        "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
      })}>
        <Outlet />
      </div>
    </div>
  )
}

export default CoursePage
