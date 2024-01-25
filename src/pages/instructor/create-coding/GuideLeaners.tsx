import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../../util/utils'
import ReactQuill from 'react-quill'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import codingApi from '../../../api/modules/coding.api'
import { toast } from 'react-toastify'
import { Button } from '../../../components/Button'
import InstructionBox from '../../../components/Instructor/create-coding/InstructionBox'
import RelatedLectureBox from '../../../components/Instructor/create-coding/RelatedLectureBox'
import HintBox from '../../../components/Instructor/create-coding/HintBox'
import SolutionExplanationBox from '../../../components/Instructor/create-coding/SolutionExplanationBox'
import { Loader2Icon, RotateCcwIcon } from 'lucide-react'
import CodeEditorWindow from '../../../components/common/CodeEditorWindow'
import { LanguageOption, languageOptions } from '../../../constants/languageOptions'

type TabState = 'instruction' | 'related_lecture' | 'hint' | 'solution_explanation'

interface Tab {
  tabState: TabState,
  display: string
}

const tabs: Tab[] = [
  {
    display: "Chỉ dẫn",
    tabState: 'instruction'
  },
  {
    display: "Bài giảng liên quan",
    tabState: 'related_lecture'
  },
  {
    display: "Gợi ý",
    tabState: 'hint'
  }, 
  {
    display: "Giải thích giải pháp",
    tabState: 'solution_explanation'
  }
]

const GuideLeaners = () => {
  const { id, quizId } = useParams()
  let courseId = useRef<string>();
  let exId = useRef<number>();

  //Code state
  const [codeStarter, setCodeStarter] = useState<string>("")
  const [language, setLanguage] = useState<LanguageOption>(languageOptions[0])
  const [theme, setTheme] = useState<string>('vs-dark')  
  const [lineCount, setLineCount] = useState<number>(0)

  const [tabState, setTabState] = useState<TabState>('instruction');
  const [instruction, setInstruction] = useState<string>("");
  const [relatedLecure, setRelatedLecture] = useState<string>("");
  const [hint, setHint] = useState<string>("")
  const [solutionExplanation, setSolutionExplanation] = useState<string>("")

  const onChange = (action: string, data: string) => {
    switch (action) {
      case "code": {
        setCodeStarter(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
};

  const exQuery = useQuery({
    queryKey: ['exQuery', exId.current],
    queryFn: async () => {
      if(exId.current) {
        const { response, error } = await codingApi.getById(exId.current)
        if(response) {
          return response.data
        }
        if(error) {
          return Promise.reject();
        }
      } else {
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data) {
        setInstruction(data.instruction)

      }
    }
  })

  const addInstruction = useMutation({
    mutationKey: ['addInstruction'],
    mutationFn: async () => {
      if(exId.current) {
        return codingApi.addInstruction(exId.current, instruction)
      } else {
        toast.error("Không tìm thấy ID bài tập!")
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Da cap nhat chi dan")
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cap nhat that bai!")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const addHint = useMutation({
    mutationKey: ['addHint'],
    mutationFn: async () => {
      if(exId.current) {
        return codingApi.addHint(exId.current, hint)
      } else {
        toast.error("Không tìm thấy ID bài tập!")
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Đã cập nhật gợi ý")
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cập nhật thất bại!")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const addSolutionExplanation = useMutation({
    mutationKey: ['addSolutionExplanation'],
    mutationFn: async () => {
      if(exId.current) {
        return codingApi.addSolutionExplanation(exId.current, solutionExplanation)
      } else {
        toast.error("Không tìm thấy ID bài tập!")
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Đã cập nhật giải thích")
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cập nhật thất bại!")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const addRelatedLecture = useMutation({
    mutationKey: ['addRelatedLecture'],
    mutationFn: async () => {
      if(exId.current) {
        return codingApi.addRelatedLecture(exId.current, relatedLecure)
      } else {
        toast.error("Không tìm thấy ID bài tập!")
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Đã cập nhật bài giảng liên quan")
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cập nhật thất bại!")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  const addCodeStarter = useMutation({
    mutationKey: ['addCodeStarter'],
    mutationFn: async () => {
      if(exId.current) {
        return codingApi.addCodeStarter(exId.current, codeStarter)
      } else {
        return Promise.reject()
      }
    },
    onSuccess(data) {
      if(data.response) {
        toast.success("Đã cập nhật code mở đầu")
      }
      if(data.error) toast.error(data.error.response?.data.errorMessage ?? "Cập nhật thất bại!")
    },
    onError(error: Error) {
      toast.error(error.message)
    }
  })

  function handleSave() {
    if(instruction !== "") {
      addInstruction.mutate()
    } 
    if(hint !== "") {
      addHint.mutate()
    }
    if(relatedLecure !== "") {
      addRelatedLecture.mutate()
    }
    if(solutionExplanation !== "") {
      addSolutionExplanation.mutate()
    }
    if(codeStarter !== "") {
      addCodeStarter.mutate()
    }
  }

  useEffect(() => {
    courseId.current = id,
    exId.current = Number(quizId)
  }, [id, quizId])

  return (
    <div className='h-[calc(100vh-100px)] grid grid-cols-2'>
      {/* Left Content */}
      <div className='bg-white border-r border-r-gray-300 flex flex-col'>
        <div className='w-full px-3 flex items-center justify-between border-b border-b-gray-300 text-sm'>
          <div className='flex items-center justify-start gap-x-2'>
            {
              tabs.map(tab => (
                <div key={tab.tabState} className={cn('text-gray-500 font-semibold px-2 py-3 text-sm cursor-pointer', {
                  'shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.75)] text-gray-950': tabState === tab.tabState
                })} onClick={() => setTabState(tab.tabState)}>
                  <span>{ tab.display }</span>
                </div>
              ))
            }
          </div>
          <Button 
            variant={'light'} 
            size={'sm'} 
            rounded={'sm'} 
            disabled={addHint.isLoading || addInstruction.isLoading || addRelatedLecture.isLoading || addSolutionExplanation.isLoading}
            onClick={handleSave}
          >
            {
              addHint.isLoading || addInstruction.isLoading || addRelatedLecture.isLoading || addSolutionExplanation.isLoading
                ? <div className='flex items-center justify-center gap-x-1 text-xs'>
                    <Loader2Icon className='w-5 h-5 animate-spin'/>
                    <span>Đang lưu</span>
                  </div>
                : <span>Lưu lại</span>
            }
          </Button>
        </div>
        <div className='px-3 py-5 flex flex-col gap-y-5 text-sm'>
          {
            tabState === 'instruction'
              ? <InstructionBox 
                  onChange={(v) => setInstruction(v)} 
                  instruction={instruction} 
                />
              : tabState === 'related_lecture'
                ? <RelatedLectureBox onChange={(id) => setRelatedLecture(id.trim())} />
                  : tabState === 'hint'
                    ? <HintBox 
                        onChange={(h) => setHint(h)} 
                        hint={hint} 
                      />
                    : <SolutionExplanationBox 
                        onChange={(solutionEx) => setSolutionExplanation(solutionEx)} 
                        solutionExplanation={solutionExplanation} 
                      />
          }
        </div>
      </div>
      {/* End Left Content */}

      {/* Right Content */}
      <div className='col-span-1 flex flex-col text-sm bg-[#1e1e1e]'>
          <div className='flex justify-between items-center px-3 py-2 text-white bg-stone-800'>
            <span>File bat dau</span>
            <RotateCcwIcon />
          </div>
          <div className='px-3 py-2 text-white bg-stone-800'>
            <span>command.java</span>
          </div>
          <CodeEditorWindow 
            code={codeStarter}
            theme={theme}
            setLineCount={setLineCount}
            language={language.value}
            onChange={onChange}
            defaultValue={exQuery.data?.codeStarter}
          />
      </div>
      {/* End Right Content */}
    </div>
  )
}

export default GuideLeaners
