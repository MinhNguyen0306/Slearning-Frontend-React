import { ActivityIcon, ChevronDownIcon, ChevronUpIcon, LockIcon } from "lucide-react"
import { Chapter } from "../../types/model/Chapter"
import LectureSidebarItem from "./LectureSidebarItem"
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../../util/utils";
import { useState } from "react";
import { Progress } from "../../types/model/Progress";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useQuery } from "react-query";
import progressApi from "../../api/modules/progress.api";

const ChapterSidebarItem = ({ chapter, progresses, currentProgress }: { chapter: Chapter, progresses: Progress[], userId: string, currentProgress: Progress }) => {
    const navigate = useNavigate();
    const { courseId, lectureId } = useParams();
    const [expand, setExpand] = useState<boolean>(true);
    const user = useSelector((state: RootState) => state.user.user)

    const checkOpenTestQuery = useQuery({
        queryKey: ['checkOpenTest', chapter.id, lectureId],
        queryFn: () => progressApi.checkOpenTest(user.id, chapter.id)
    })

    function checkLockedLecture(lectureId: string) {
        const check = progresses.map(p => p.lecture.id).includes(lectureId)
        const checkCurrentLecture = progresses.findIndex(p => p.completed === false && p.lecture.id === lectureId)
        if(check && checkCurrentLecture !== -1) {
            return 0;
        } else if(check) {
            return 1;
        } else {
            return -1;
        }
    }

    function checkCurrentChapter() {
        const check = chapter.lectures.some(lecture => lecture.id === currentProgress.lecture.id);
        if(check) return true
        else return false;
    }

    return (
        <div>
            <div className={cn('w-full px-4 py-3 boxTitle hover:bg-mainColorHover cursor-pointer', {
                'bg-mainColorHover': checkCurrentChapter(),
            })}>
                <div className='flex justify-between items-center' onClick={() => setExpand(prev => !prev)}>
                    <span>Chuong { chapter.position }. { chapter.title }</span>
                    {
                        expand
                            ?   <ChevronUpIcon />
                            :   <ChevronDownIcon />
                    }
                </div>
            </div>
            <ul className={cn('w-full pl-2', {
                'hidden': !expand
            })}>
                {
                    [...chapter.lectures].sort((l1, l2) => l1.position - l2.position).map((lecture, _) => (
                        <li 
                            key={lecture.id} 
                            onClick={() => checkLockedLecture(lecture.id) !== -1 
                                ? navigate(`/learning/${courseId}/lecture/${lecture.id}`) 
                                : null
                            }
                        >
                            <LectureSidebarItem lecture={lecture} locked={checkLockedLecture(lecture.id)}/>
                        </li>
                    ))
                }
            </ul>
            {
                chapter.questions.length > 0 &&
                <div 
                    className={cn("w-full p-4 bg-gray-900", {
                        "bg-green-800 cursor-pointer": checkOpenTestQuery.data?.response?.data
                    })} 
                    onClick={() => checkOpenTestQuery.data?.response?.data ? navigate(`/learning/${courseId}/test/chapter/${chapter.id}`) : null}
                >
                    <div className="flex justify-start items-center gap-x-3 text-white">
                        {
                            checkOpenTestQuery.data && checkOpenTestQuery.data.response?.data == true
                                ?   <ActivityIcon />
                                :   <LockIcon />
                        }
                        <span>Ôn tập cuối chương</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChapterSidebarItem
