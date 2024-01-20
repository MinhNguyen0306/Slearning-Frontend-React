import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListFilterIcon, ChevronsUpDownIcon, ArrowUpDownIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '../util/utils';
import Rating from '../components/Rating';
import SearchItem from '../components/SearchItem';
import useQueryString from '../hooks/useQueryString';
import { useQuery } from 'react-query';
import courseApi from '../api/modules/course.api';
import { PageRequest } from '../types/payload/PageRequest';
import { Button } from '../components/Button';

const SearchPage = () => {
  const navigate = useNavigate();
  const queryString: {page?: string, q?: string} = useQueryString();
  const [sortBy, setSortBy] = useState<string>("")
  const [filterRating, setFilterRating] = useState<boolean>(false);
  const [filterPrice, setFilterPrice] = useState<boolean>(false);
  const [fromPrice, setFromPrice] = useState<number>();
  const [toPrice, setToPrice] = useState<number>();

  const page = queryString.page ? Number(queryString.page) : 0
  const q = queryString.q
  const pageRequest: PageRequest = { pageNumber: page, pageSize: 5 }

  const searchQuery = useQuery({
    queryKey: ['seachPageQuery', page, q],
    queryFn: async () => {
      if(q) {
        const { response, error } = await courseApi.search(q, pageRequest)
        if(response) {
          return response.data
        }
        if(error) {
          return Promise.reject()
        }
      } else {
        return Promise.reject()
      }
    }
  })

  const filterPriceQuery = useQuery({
    queryKey: ['filterPrice', fromPrice, toPrice],
    queryFn: async() => {
      if(fromPrice && toPrice) {
        const { response, error } = await courseApi.getByPrice(fromPrice, toPrice, pageRequest)
        if(response) return response.data
        if(error) return Promise.reject()
      } else {
        return Promise.reject()
      }
    }, 
    enabled: toPrice !== undefined && fromPrice !== undefined,
  })

  function handleFilterPrice(fromPrice: number, toPrice: number) {
    setFromPrice(fromPrice)
    setToPrice(toPrice)
  }

  return (
    <div className='p-5 flex flex-col'>
      <h1 className='text-3xl font-bold mt-5'>{searchQuery.data?.content.length} Ket qua cho "{q}"</h1>
      <div className='flex justify-start gap-5 my-5'>
        <div className='flex gap-1 font-semibold border-[1px] border-gray-400 rounded-md hover:bg-gray-50 cursor-pointer
        p-2'>
          <ListFilterIcon />
          <span>Lọc</span>
        </div>
        <div className='flex gap-1 border-[1px] p-2 border-gray-400 rounded-md hover:bg-gray-50 cursor-pointer'>
          <ArrowUpDownIcon />
          <span>Sắp xếp theo</span>
          <ChevronsUpDownIcon />
        </div>
      </div>

      {/* Search content */}
      <div className='flex mt-5 gap-x-10'>
        {/* Filter bar */}
        <ul className={cn('w-[25%] flex flex-col border-t-[1px] border-gray-200', {
          
        })}>
          <li className='border-b-[1px] border-gray-200 py-3 cursor-pointer' onClick={() => setFilterRating(prev => !prev)}>
            <span>Đánh giá</span> 
            <ChevronDownIcon className='float-right'/>
            <ul className={cn('flex flex-col gap-2 px-1 py-2', {
              'hidden': !filterRating
            })}>
              <li className='flex gap-2'>
                <Rating readOnly rating={5} variant='outline'/>
              </li>
              <li className='flex gap-2'>
                <Rating readOnly rating={4} variant='outline'/>
              </li>
              <li className='flex gap-2'>
                <Rating readOnly rating={3} variant='outline'/>
              </li>
              <li className='flex gap-2'>
                <Rating readOnly rating={2} variant='outline'/>
              </li>
            </ul>
          </li>
          <li className='border-b-[1px] border-gray-200 py-3 cursor-pointer' onClick={() => setFilterPrice(prev => !prev)}>
            <span>Giá</span> 
            <ChevronDownIcon className='float-right'/>
            <ul className={cn('flex flex-col px-1 py-2', {
              'hidden': !filterPrice
            })}>
              <div className='flex justify-between items-center'>
                <input type="radio" id='oneToTwo' name='price' />
                <label htmlFor="oneToTwo" className='px-1 py-2 w-full h-full' onClick={() => handleFilterPrice(100000, 500000)}>
                  100000 VND - 500000 VND
                </label>
              </div>
              <div className='flex justify-between items-center'>
                <input type="radio" id='fiveToTen' name='price' />
                <label htmlFor="fiveToTen" className='px-1 py-2 w-full h-full' onClick={() => handleFilterPrice(500000, 1000000)}>
                  500000 VND - 1000000 VND
                </label>
              </div>
              <div className='flex justify-between items-center'>
                <input type="radio" id='tenToFif' name='price' />
                <label htmlFor="tenToFif" className='px-1 py-2 w-full h-full' onClick={() => handleFilterPrice(1000000, 1500000)}>
                  1000000 VND - 1500000 VND
                </label>
              </div>
            </ul>
          </li>
        </ul>
        {/* End filter bar */}

        {/* Result content */}
        <div className='flex-1 flex flex-col'>
          <ul className='flex flex-col gap-y-5'>
            {
              searchQuery.data?.content.map((course, _) => (
                <SearchItem course={course} key={course.id} />
              ))
            }
          </ul>
          {/* Navigate Page Action */}
          <div className="flex justify-center mt-5">
            <Button 
              variant='grey' 
              disabled={page === 0}
              onClick={() => navigate(`?q=${q}&page=${page - 1}`)}
            >
              Prev
            </Button>
            <ul className="flex items-center">
              {
                searchQuery.data && Array(searchQuery.data.totalPages).fill(0).map((_, index) => {
                  const pageNumber = index;
                  const isActive = page === pageNumber;
                  return (
                    <li key={pageNumber}>
                      <Link 
                        to={`?q=${q}&page=${pageNumber}`}
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
              disabled={searchQuery.data?.last}
              onClick={() => navigate(`?q=${q}&page=${page + 1}`)}
            >
              Next
            </Button>
          </div>
          {/* End navigate Page Action */}
        </div>
        {/* End result content */}
      </div>
      {/* End search content */}
    </div>
  )
}

export default SearchPage