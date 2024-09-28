import { viralClipsApi } from "./baseApi"
import { SESSION_TOKEN } from "./login"

export const getVideoByIdRequest = async ({videoId, onSuccess, onError}) => {
    var response = await viralClipsApi.get(
        `/video?id=${videoId}`,
        {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem(SESSION_TOKEN)
            }
        }
    )
    if (response.status == 200) {
        console.log(response)
        onSuccess(response.data)
    } else {
       console.log(response)
       onError()
    }
}