import { viralClipsApi } from "./baseApi"
import { SESSION_TOKEN } from "./login"

export const registerReguset = async ({username, password, onSuccess, onError}) => {
    var response = await viralClipsApi.post(
        "/register",
        {
            username: username,
            password: password,
        }
    )
    if (response.status == 201) {
        //AsyncStorage.setItem(SESSION_TOKEN, response.data.token)
        sessionStorage.setItem(SESSION_TOKEN, response.data.token)
        console.log(response)
        onSuccess()
    } else {
        console.log(response)
        onError()
    }
}