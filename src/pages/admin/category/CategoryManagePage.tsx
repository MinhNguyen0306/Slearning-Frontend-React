import { LayersIcon, LockIcon, UnlockIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import useQueryString from "../../../hooks/useQueryString";
import { cn } from "../../../util/utils";
import Skeleton from "../../../components/Skeleton";
import { useQuery } from "react-query";
import { PageRequest } from "../../../types/payload/PageRequest";
import categoryApi from "../../../api/modules/category.api";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { Button } from "../../../components/Button";
import CreateCategoryModal from "../../../components/modal/CreateCategoryModal";
import { setCreateCategoryModalOpen } from "../../../redux/features/appState/appState.slice";

const CategoryManagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarExpand = useSelector((state: RootState) => state.appState.sidebarExpand);

  const queryString: { pageCategory?: string, pageSubCategory?: string, pageTopic?: string } = useQueryString();
  const pageCategory = Number(queryString.pageCategory) || 0;
  const pageSubCategory = Number(queryString.pageSubCategory) || 0;
  const pageTopic = Number(queryString.pageTopic) || 0;

  const categoryQuery = useQuery({
    queryKey: ['categories', { pageCategory }],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: pageCategory, pageSize: 5 }
      const { response, error } = await categoryApi.getAll(pageRequest)
      if(response) return response.data;
      if(error) {
        toast.error(error.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const subCategoryQuery = useQuery({
    queryKey: ['subCategories', { pageSubCategory }],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: pageSubCategory, pageSize: 5 }
      const { response, error } = await categoryApi.getAllSubCategories(pageRequest)
      if(response) return response.data;
      if(error) {
        toast.error(error.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  const topicQuery = useQuery({
    queryKey: ['topics', { pageTopic }],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: pageTopic, pageSize: 5 }
      const { response, error } = await categoryApi.getAllTopics(pageRequest)
      if(response) return response.data;
      if(error) {
        toast.error(error.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  function handleCreateCategory() {
    dispatch(setCreateCategoryModalOpen(true))
  }

  return (
    <>
      <CreateCategoryModal />
      <div className="bg-white h-[2000px] p-5 flex flex-col gap-10 mb-32 mt-5">
        <span className="flex gap-5 font-bold text-xl">
          <LayersIcon />
          <span>Quản lý danh mục</span>
        </span>

        <div className="w-full flex justify-between items-center px-8 py-5 border-[1px] border-gray-300 bg-white rounded-md">
          <h1 className="text-2xl font-bold">Tạo thêm danh mục</h1>
          <Button variant='blueContainer' size='lengthen' rounded='md' onClick={handleCreateCategory}>
            Tạo danh mục
          </Button>
        </div>

        <div className={cn("w-full flex flex-col gap-y-20",{
            "max-w-[calc(100vw-340px)] transition-all duration-1000": sidebarExpand === true,
          })}>
            {/* Categories data */}
            <div className="flex flex-col gap-y-5 h-[500px]">
              <h2 className="font-bold text-2xl text-right text-blue-500">Danh mục</h2>
              {
                categoryQuery.isLoading 
                  ? <Skeleton />
                  :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                      <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100
                      [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                      [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                      [&>tbody>tr>td:nth-child(1)]:bg-inherit'>
                        <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                          <tr>
                              <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                Mã danh mục
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Tiêu đề
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Trạng thái
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Thao tác
                              </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            categoryQuery.data && categoryQuery.data.content && categoryQuery.data.content.map((category, _) => (
                              <tr key={category.id}>
                                <td className='py-3'>
                                  <div 
                                    className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                  >
                                    { category.id }
                                  </div>
                                </td>
                                <td className='py-3 break-all'>
                                  <div className="p-2">
                                    { category.title }
                                  </div>
                                </td>
                                <td className='py-3'>
                                  <span className="flex items-center justify-center gap-x-2">
                                    <i className={cn("w-2 h-2 rounded-full ", {
                                      "bg-red-600": category.lock,
                                      "bg-green-500": !category.lock,
                                    })}></i>
                                    { category.lock ? "Đang khóa" : "Active" }
                                  </span>
                                </td>
                                <td className='py-3'>
                                  <div className="flex justify-evenly items-center">
                                    <div className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                      hover:bg-gray-300">
                                      {
                                        !category.lock 
                                        ? <div data-tooltip-id="lock" data-tooltip-content="Khóa người dùng">
                                            <UnlockIcon />
                                            <Tooltip id="lock" className="z-50"/>
                                          </div> 
                                        : <div data-tooltip-id="unlock" data-tooltip-content="Mở khóa người dùng">
                                            <LockIcon />
                                            <Tooltip id="unlock" className="z-50"/>
                                          </div> 
                                      }
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </section>
              }
              {/* End categories table */}

              {/* Navigate Page Action */}
              <div className="flex justify-center mt-5">
                <Button 
                  variant='grey' 
                  disabled={pageCategory === 0}
                  onClick={() => navigate(`/admin/categories?pageCategory=${pageCategory - 1}`)}
                >
                  Prev
                </Button>
                <ul className="flex items-center">
                  {
                    categoryQuery.data && Array(categoryQuery.data.totalPages).fill(0).map((_, index) => {
                      const pageNumber = index;
                      const isActive = pageCategory === pageNumber;
                      return (
                        <li key={pageNumber}>
                          <Link 
                            to={`/admin/categories?pageCategory=${pageNumber}`}
                            className={cn("border border-gray-300 hover:border-gray-400 leading-tight hover:text-gray-500 py-2 px-3", {
                              "bg-gray-200 text-gray-700": isActive
                            })}
                          >
                            { pageNumber }
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
                <Button 
                  variant='grey' 
                  disabled={categoryQuery.data?.last}
                  onClick={() => navigate(`/admin/categories?pageCategory=${pageCategory + 1}`)}
                >
                  Next
                </Button>
              </div>
              {/* End navigate Page Action */}
            </div>
            {/* End categories data */}

            {/* SubCategories data */}
            <div className="flex flex-col gap-y-5 h-[500px]">
              <h2 className="font-bold text-2xl text-right text-blue-500">Danh mục con</h2>
              {
                subCategoryQuery.isLoading 
                  ? <Skeleton />
                  :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                      <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                      [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                      [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                      [&>tbody>tr>td:nth-child(1)]:bg-inherit'>
                        <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                          <tr>
                              <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                Mã danh mục con
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Tiêu đề
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Danh mục
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Trạng thái
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Thao tác
                              </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            subCategoryQuery.data && subCategoryQuery.data.content.map((subCategory, _) => (
                              <tr key={subCategory.id}>
                                <td className='py-3'>
                                  <span 
                                    className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                  >
                                    { subCategory.id }
                                  </span>
                                </td>
                                <td className='py-3'>
                                  { subCategory.title }
                                </td>
                                <td className='py-3'>
                                  <div>
                                    { subCategory.category.title }
                                  </div>
                                </td>
                                <td className='py-3'>
                                  <span className="flex items-center justify-center gap-x-2">
                                    <i className={cn("w-2 h-2 rounded-full ", {
                                      "bg-red-600": subCategory.lock,
                                      "bg-green-500": !subCategory.lock,
                                    })}></i>
                                    { subCategory.lock ? "Đang khóa" : "Active" }
                                  </span>
                                </td>
                                <td className='py-3'>
                                  <div className="flex justify-evenly items-center">
                                    <div className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                      hover:bg-gray-300">
                                      {
                                        !subCategory.lock 
                                        ? <div data-tooltip-id="lock" data-tooltip-content="Khóa người dùng">
                                            <UnlockIcon />
                                            <Tooltip id="lock" className="z-50"/>
                                          </div> 
                                        : <div data-tooltip-id="unlock" data-tooltip-content="Mở khóa người dùng">
                                            <LockIcon />
                                            <Tooltip id="unlock" className="z-50"/>
                                          </div> 
                                      }
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </section>
              }

              {/* Navigate Page Action */}
              <div className="flex justify-center mt-5">
                <Button 
                  variant='grey' 
                  disabled={pageSubCategory === 0}
                  onClick={() => navigate(`/admin/categories?pageSubCategory=${pageSubCategory - 1}`)}
                >
                  Prev
                </Button>
                <ul className="flex items-center">
                  {
                    subCategoryQuery.data && Array(subCategoryQuery.data.totalPages).fill(0).map((_, index) => {
                      const pageNumber = index;
                      const isActive = pageSubCategory === pageNumber;
                      return (
                        <li key={pageNumber}>
                          <Link 
                            to={`/admin/categories?pageSubCategory=${pageNumber}`}
                            className={cn("border border-gray-300 hover:border-gray-400 leading-tight hover:text-gray-500 py-2 px-3", {
                              "bg-gray-200 text-gray-700": isActive
                            })}
                          >
                            { pageNumber }
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
                <Button 
                  variant='grey' 
                  disabled={subCategoryQuery.data?.last}
                  onClick={() => navigate(`/admin/categories?pageSubCategory=${pageSubCategory + 1}`)}
                >
                  Next
                </Button>
              </div>
              {/* End navigate Page Action */}
            </div>
            {/* End subcategories data */}

            {/* Topics data */}
            <div className="flex flex-col gap-y-5 h-[500px]">
              <h2 className="font-bold text-2xl text-right text-blue-500">Chuyên đề</h2>
              {
                subCategoryQuery.isLoading 
                  ? <Skeleton />
                  :  <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
                      <table className='text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
                      [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
                      [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
                      [&>tbody>tr>td:nth-child(1)]:bg-inherit'>
                        <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-200 text-black w-full'>
                          <tr>
                              <th className='w-[15%] py-2 px-5 whitespace-nowrap border-r-2'>
                                Mã chuyên đề
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Tiêu đề
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Danh mục con
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Trạng thái
                              </th>
                              <th className='py-2 px-5 whitespace-nowrap border-r-2'>
                                Thao tác
                              </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            topicQuery.data && topicQuery.data.content.map((topic, _) => (
                              <tr key={topic.id}>
                                <td className='py-3'>
                                  <span 
                                    className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap inline-block"
                                  >
                                    { topic.id }
                                  </span>
                                </td>
                                <td className='py-3'>
                                  { topic.title }
                                </td>
                                <td className='py-3'>
                                  <div>
                                    { topic.subCategory.title }
                                  </div>
                                </td>
                                <td className='py-3'>
                                  <span className="flex items-center justify-center gap-x-2">
                                    <i className={cn("w-2 h-2 rounded-full ", {
                                      "bg-red-600": topic.lock,
                                      "bg-green-500": !topic.lock,
                                    })}></i>
                                    { topic.lock ? "Đang khóa" : "Active" }
                                  </span>
                                </td>
                                <td className='py-3'>
                                  <div className="flex justify-evenly items-center">
                                    <div className="w-8 h-8 grid place-items-center cursor-pointer rounded-full bg-transparent
                                      hover:bg-gray-300">
                                      {
                                        !topic.lock 
                                        ? <div data-tooltip-id="lock" data-tooltip-content="Khóa người dùng">
                                            <UnlockIcon />
                                            <Tooltip id="lock" className="z-50"/>
                                          </div> 
                                        : <div data-tooltip-id="unlock" data-tooltip-content="Mở khóa người dùng">
                                            <LockIcon />
                                            <Tooltip id="unlock" className="z-50"/>
                                          </div> 
                                      }
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </section>
              }

              {/* Navigate Page Action */}
              <div className="flex justify-center mt-5">
                <Button 
                  variant='grey' 
                  disabled={pageTopic === 0}
                  onClick={() => navigate(`/admin/categories?pageTopic=${pageTopic - 1}`)}
                >
                  Prev
                </Button>
                <ul className="flex items-center">
                  {
                    topicQuery.data && Array(topicQuery.data.totalPages).fill(0).map((_, index) => {
                      const pageNumber = index;
                      const isActive = pageTopic === pageNumber;
                      return (
                        <li key={pageNumber}>
                          <Link 
                            to={`/admin/categories?pageTopic=${pageNumber}`}
                            className={cn("border border-gray-300 hover:border-gray-400 leading-tight hover:text-gray-500 py-2 px-3", {
                              "bg-gray-200 text-gray-700": isActive
                            })}
                          >
                            { pageNumber }
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
                <Button 
                  variant='grey' 
                  disabled={topicQuery.data?.last}
                  onClick={() => navigate(`/admin/categories?pageTopic=${pageTopic + 1}`)}
                >
                  Next
                </Button>
              </div>
              {/* End navigate Page Action */}
            </div>
            {/* End topics data */}
          </div>
      </div>    
    </>
  )
}

export default CategoryManagePage
