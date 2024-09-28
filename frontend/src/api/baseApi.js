import axios from "axios";

export const BACKEND_URL = "http://109.248.37.46:4000"

export const VIDEOS_UPLOAD_URL = '/video'
export const viralClipsApi = axios.create(
    {
        baseURL: BACKEND_URL,
    }
)