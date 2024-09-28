import { viralClipsApi } from "./baseApi"
import { SESSION_TOKEN } from "./login"

export const deleteVideoRequest = async ({videoId, onSuccess, onError}) => {
    var response = await viralClipsApi.delete(
        `/video/${videoId}`,
        {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem(SESSION_TOKEN)
            }
        }
    )
    if (response.status == 200) {
        console.log(response)
        onSuccess()
    } else {
       console.log(response)
       onError()
    }
}