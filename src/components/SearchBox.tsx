import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import SearchHintItem from "./SearchHintItem";
import { cn } from "../util/utils";
import { useQuery } from "react-query";
import courseApi from "../api/modules/course.api";
import { PageRequest } from "../types/payload/PageRequest";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchBox = () => {
  const navigate = useNavigate();
  const searchHintRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("")

  const searchQuery = useQuery({
    queryKey: ['searchBoxQuery', searchKey],
    queryFn: async () => {
      const pageRequest: PageRequest = { pageNumber: 0, pageSize: 10 }
      const { response, error } = await courseApi.search(searchKey, pageRequest)
      if(error) {
        return Promise.reject()
      } else {
        return response.data
      }
    },
    enabled: searchKey !== ""
  })


  useEffect(() => {
      const box = document.getElementById('searchBox');
      function handleClickBox(e: MouseEvent) {
          if(box && e.target) {
              const element = e.target as HTMLElement
              if((box.contains(element) || visible)) {
                  setVisible(prev => !prev)
              }
          }
      }

      document.addEventListener('click', handleClickBox)
      return () => {
          document.removeEventListener('click', handleClickBox)
      }
  }, [visible])

  // useEffect(() => {
  //   function search(event: Event) {
  //     const e = event as KeyboardEvent
  //     if(e.key === 'Enter') {
  //       navigate(`/search?q=${searchKey}`)
  //     }
  //   }

  //   document.addEventListener('keyup', search)
  //   return () => {
  //     document.removeEventListener('keyup', search)
  //   }
  // }, [searchKey])

  return (
    <div id="searchBox" ref={searchHintRef} className='relative flex-1 h-[45px] flex items-center border-[1px] border-black rounded-3xl text-sm'>
        <form
          action="/search"
          className="w-full h-full outline-none border-none bg-white rounded-[inherit]"
        >
          <input 
            type="text"
            name="q"
            id="q"
            placeholder='Nhap gi do di...' 
            className='w-full h-full outline-none border-none placeholder-slate-400
            bg-white rounded-[inherit] pr-[55px] pl-5 py-1' 
            autoComplete="off"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </form>
        <div className='absolute w-[45px] h-full right-0 top-1/2 -translate-y-1/2 flex items-center justify-center 
        text-gray-500 rounded-r-3xl before:h-1/2 before:w-[1px] before:bg-gray-500 before:absolute before:right-[45px]
        hover:bg-gray-100 hover:text-gray-400 cursor-pointer'>
            <SearchIcon />
        </div>
        <div className={cn("w-full max-h-[447px] absolute top-full mt-1 bg-white z-[9999] py-4 rounded-md", 
        "border-[1px] border-gray-300 overflow-y-auto scrollbar-hide", {
          "hidden" : visible === false || !searchQuery.data || searchQuery.data.content.length === 0,
          "block": visible === true && searchQuery.data && searchQuery.data.content.length > 0
        })}>
          <ul className="flex flex-col gap-y-1 cursor-pointer">
            {
              searchQuery.data && [...searchQuery.data.content].splice(0, 5).map((course, _) => (
                  <li 
                    key={course.id} 
                    className="w-full flex gap-x-3 justify-start items-center hover:bg-blue-50 px-5 py-3"
                    onClick={() => navigate(`/search?q=${course.title}`)}
                  >
                    <div className="flex justify-start gap-x-5">
                      <SearchIcon />
                      <span>{ course.title }</span>
                    </div>
                  </li>
                ))
            }
            {
              searchQuery.data && [...searchQuery.data.content].splice(0, 4).map((course, _) => (
                <SearchHintItem key={course.id} course={course} />
              ))
            }
          </ul>
        </div>
    </div>
  )
}

export default SearchBox
