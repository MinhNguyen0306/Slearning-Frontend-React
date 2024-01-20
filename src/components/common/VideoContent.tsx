import { useQuery } from 'react-query';
import VideoContainer from '../VideoContainer'
import LectureContent from '../learning/LectureContent'
import lectureApi from '../../api/modules/lecture.api';
import { PublishStatus } from '../../types/payload/enums/PublishStatus';
import { useNavigate, useParams } from 'react-router-dom';

const VideoContent = () => {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  const learningLectureQuery = useQuery({
      queryKey: ['learningLecture', lectureId],
      queryFn: async () => {
        if(lectureId) {
          const { response, error } = await lectureApi.getById(lectureId, PublishStatus.PUBLISHING);
          if(!response?.data || error) navigate("/learner/my-learning")
          if(response) {
            return response.data
          }
        } else {
          return Promise.reject()
        }
      }
    })

    return (
        <>
            {/* Video Lecture Container */}
            {
                learningLectureQuery.data?.videoStorage 
                    ? <VideoContainer videoUrl={learningLectureQuery.data.videoStorage.url} />
                    : <div className='animate-pulse w-full h-screen bg-gray-500'></div>
            }
            {/* End Video Lecture Container */}

            {/* Content */}
            { 
                learningLectureQuery.data 
                    ? <LectureContent lecture={learningLectureQuery.data} /> 
                    : <div className='animate-pulse w-full h-full bg-gray-500'></div>
            }
            {/* End Content */}
        </>
    )
}

export default VideoContent
