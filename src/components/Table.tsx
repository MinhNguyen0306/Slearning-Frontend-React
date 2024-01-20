import React from 'react'

type TableProps = {
  headData: string[],
  data: any[]
}

function Table({ headData, data }: TableProps) {

  return (
    <section className='bg-white border-[1px] border-gray-300 overflow-auto max-h-[500px] rounded-md'>
      <table className='table-fixed text-center [&>tbody>*:nth-child(odd)]:bg-gray-100 w-full
      [&>thead>tr>th:nth-child(1)]:sticky [&>thead>tr>th:nth-child(1)]:left-0 [&>thead>tr>th:nth-child(1)]:z-50 
      [&>thead>tr>th:nth-child(1)]:px-16 [&>tbody>tr>td:nth-child(1)]:sticky [&>tbody>tr>td:nth-child(1)]:left-0
      [&>tbody>tr>td:nth-child(1)]:bg-orange-300 
      [&>thead>tr>th:nth-child(2)]:sticky [&>thead>tr>th:nth-child(2)]:left-[151.93px] [&>thead>tr>th:nth-child(2)]:z-50 
      [&>thead>tr>th:nth-child(2)]:px-28 [&>tbody>tr>td:nth-child(2)]:sticky [&>tbody>tr>td:nth-child(2)]:left-[151.93px]
      [&>tbody>tr>td:nth-child(2)]:bg-orange-300'>
        <thead className='[&>tr>*]:sticky [&>tr>*]:top-0 [&>tr>*]:z-10 [&>tr>*]:bg-gray-900 text-white w-full'>
          <tr>
            {
              headData.map((item, i) => (
                <th key={i} className='py-2 px-5 whitespace-nowrap'>
                  {item}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            data.map((item, _) => (
              <tr>
                <td className='py-5'>
                  Ma khoa
                </td>
                <td className='py-5'>
                  Ten khoa hoc
                </td>
                <td className='py-5'>
                  Ngay cap nhat
                </td>
                <td className='py-5'>
                  Gia goc
                </td>
                <td className='py-5'>
                  Gia ban
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
  )
}

export default Table
