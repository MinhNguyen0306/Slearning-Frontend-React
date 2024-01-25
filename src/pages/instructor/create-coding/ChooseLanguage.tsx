import React, { useEffect, useRef, useState } from 'react'
import DropdownMenu from '../../../components/DropdownMenu'
import { languageOptions } from '../../../constants/languageOptions'
import { Button } from '../../../components/Button'
import { useMutation, useQuery } from 'react-query'
import codingApi from '../../../api/modules/coding.api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import courseApi from '../../../api/modules/course.api'

const ChooseLanguage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = useRef<string>(state.from)
  const { id, quizId } = useParams()
  const [chosenLanguage, setChosenLanguage] = useState()

  const courseQuery = useQuery({
    queryKey: ['course', id],
    queryFn: async() => {
      if(id) {
        const { response, error } = await courseApi.getById(id)
        if(response) {
          return response.data
        }
        if(error) {
          navigate(from.current, { replace: true })
          toast.error(error.response?.data.errorMessage ?? "Khong tim thay ID khoas hoc")
          return Promise.reject()
        }
      } else {
        navigate(from.current, { replace: true })
        return Promise.reject()
      }
    },
    onError(error: Error) {
      toast.error(error.message)
      navigate(from.current, { replace: true })
    }
  })

  const codingExQuery = useQuery({
    queryFn: async () => {
      if(quizId) {
        const { response, error } = await codingApi.getById(Number(quizId))
        if(response) return response.data
        if(error) {
          toast.error(error.response?.data.errorMessage ?? "Khong tim Thay ID Bai tap")
          navigate(from.current, {replace: true })
        }
      }
    },
    onError(error: Error) {
      navigate(from.current, { replace: true })
      toast.error(error.message)
    }
  })

  const addLanguage = useMutation({
    mutationKey: ['addLanguage'],
    mutationFn: () => {
      if(quizId && chosenLanguage) {
        return codingApi.addLanguage(Number(quizId), chosenLanguage)
      } else {
        toast.error("Chua du thong tin")
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Da cap nhat ngon ngu")
        navigate(`/instructor/courses/${id}/coding-exercise/${quizId}/author-solution`, {
          state: { from: from.current }
        })
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cap nhat that bai")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  function handleAddLanguage() {
    addLanguage.mutate()
  }

  return (
    <div className='h-[calc(100vh-100px)] grid place-items-center'>
      <div className='shadow-md shadow-gray-300 rounded-md p-5 flex flex-col gap-y-8 w-1/3 bg-white
      items-center justify-center'>
        <h1 className='text-lg font-semibold'>Chọn ngôn ngữ</h1>
        <DropdownMenu 
          label={
            codingExQuery.data && codingExQuery.data.languageId  
              ? languageOptions.find(language => language.id === codingExQuery.data?.languageId)?.label
              : 'Chọn ngôn ngữ'
          }
          name='chooseLanguage'
          valueKey='id'
          displayKey='label'
          dataset={languageOptions}
          onChange={(language) => setChosenLanguage(language)}
        />
        <Button 
          disabled={!chosenLanguage}
          rounded={'md'} 
          className='w-full' 
          onClick={handleAddLanguage}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  )
}

export default ChooseLanguage
