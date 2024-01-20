import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useQuery } from "react-query"
import progressApi from "../api/modules/progress.api"
import MyLearningBox from "../components/common/MyLearningBox"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"
import { ArrowRightIcon } from "lucide-react"

const MyLearningPage = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user.user)

  const enrollQuery = useQuery({
    queryKey: ['enrollQuery'],
    queryFn: async () => {
      const { response, error } = await progressApi.getMyLearning(user.id)
      if(response) return response.data
      if(error) return Promise.reject()
    }, 
    enabled: user.id !== undefined && user.id !== ""
  })

  return (
    <div className="w-full p-5 rounded-md bg-white">
      {
        enrollQuery.data && enrollQuery.data.content.length > 0
          ? <ul className="grid grid-cols-4 gap-3">
              {
                enrollQuery.data.content.map((course, _) => (
                  <li key={course.id}>
                    <MyLearningBox course={course} />
                  </li>
                ))
              }
            </ul>
          : <div className="flex flex-col gap-y-5 w-full items-center my-5">
              <span className="text-lg">Bạn chưa mua khóa học nào</span>
              <Button rounded='md' variant='light' onClick={() => navigate("/")}>
                <div className="flex items-center gap-x-3">
                  <span>Mua khóa học ngay</span>
                  <ArrowRightIcon />
                </div>
              </Button>
            </div>
      }
    </div>
  )
}

export default MyLearningPage
