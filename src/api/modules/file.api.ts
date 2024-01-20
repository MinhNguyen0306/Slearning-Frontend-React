import publicClient from "../config/public.client";

const fileEndpoints = {
    // getFileSource: (fileName: string) => `api/v1/files/download/${fileName}`
    getVideoSource: (videoUrl: string) => `files/show/video/${videoUrl}`
}

const fileApi = {
    getVideoSource: async (videoUrl: string) => {
        try {
            const response = await publicClient.get(
                fileEndpoints.getVideoSource(videoUrl),
            )
    
            return { response }
        } catch (error) {
            return { error }
        }
    }
}

export default fileApi;
