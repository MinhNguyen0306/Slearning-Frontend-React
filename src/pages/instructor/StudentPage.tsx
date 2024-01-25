import { useQuery } from "react-query";
import useQueryString from "../../hooks/useQueryString"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import userApi from "../../api/modules/user.api";
import { PageRequest } from "../../types/payload/PageRequest";
import { MailIcon, UsersIcon } from "lucide-react";

const StudentPage = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const queryString: { page?: string } = useQueryString();

  const students = useQuery({
    queryKey: ['studentOfMentor', user.id],
    queryFn: async () => {
      const page = queryString.page ? Number(queryString.page) : 0;
      const pageRequest: PageRequest = { pageNumber: page, pageSize: 10 }
      const { response, error } = await userApi.getStudentsOfMentor(user.id, pageRequest)
      if(response) {
        return response.data
      }
      if(error) {
        return Promise.reject()
      }
    }
  })

  return (
    <div className='h-[1000px] bg-white shadow-md shadow-gray-300 mt-5 flex flex-col p-5'>
      <div className="grid grid-cols-4 gap-x-5">
        <div className="col-span-1 p-5 rounded-md bg-white shadow-md shadow-gray-300 flex flex-col
        text-center gap-y-3 font-semibold text-lg text-blue-600">
          <h2>Tổng số học viên</h2>
          <span>10</span>
        </div>
        <div className="col-span-1 p-5 rounded-md bg-white shadow-md shadow-gray-300 flex flex-col
        text-center gap-y-3 font-semibold text-lg text-red-400">
          <h2>Học viên mới tháng này</h2>
          <span>10</span>
        </div>
        <div className="col-span-1 p-5 rounded-md bg-white shadow-md shadow-gray-300 flex flex-col
        text-center gap-y-3 font-semibold text-lg text-yellow-500">
          <h2>Học viên trên 2 khóa học</h2>
          <span>10</span>
        </div>
        <div className="col-span-1 p-5 rounded-md bg-white shadow-md shadow-gray-300 flex flex-col
        text-center gap-y-3 font-semibold text-lg text-green-500">
          <h2>Học viên mua nhiều nhất</h2>
          <span>Minh nguyễn</span>
        </div>
      </div>

      <table className="mt-5 border border-gray-300">
        <colgroup>
          <col width={100} />
          <col width={200} />
          <col width={100} />
          <col width={200} />
          <col width={100} />
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="py-5">
              <span>Số thứ tự</span>
            </th>
            <th className="py-5">
              <span>Tên học viên</span>
            </th>
            <th className="py-5">
              <span>Số khóa học</span>
            </th>
            <th className="py-5">
              <span>Bao gồm</span>
            </th>
            <th className="py-5">
              <span>Thao tác</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            students.data && students.data.content.length > 0
              && students.data.content.map((student, index) => (
                <tr key={index}>
                  <td className="py-4">
                    <div className="grid place-items-center">
                      <span>{index}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="grid place-items-center">
                      <span>{student.user.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="grid place-items-center">
                      <span>{student.coursesName.length}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <ul className="flex flex-col justify-center items-start text-sm  gap-y-1 list-decimal
                    text-left">
                      {
                        student.coursesName.map((courseName, index) => (
                          <li key={index}>
                            <span>{courseName}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-x-3">
                      <MailIcon className="stroke-gray-800 stroke-[1.5px]"/>
                    </div>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
      {
        students.data === undefined || (students.data && students.data.content.length === 0) &&
        <div className="w-full border border-gray-300 rounded-md flex flex-col items-center justify-center gap-y-3 h-[200px]
        mt-3">
          <UsersIcon className="w-16 h-16 stroke-gray-400 stroke-[1.25px]" />
          <span>Bạn chưa có học viên nào</span>
        </div>
      }
    </div>
  )
}

export default StudentPage
