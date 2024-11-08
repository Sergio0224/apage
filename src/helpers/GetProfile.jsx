import { Global } from "./Global"

export const GetProfile = async (userId, setState) => {
    const req = await fetch(Global.url + "user/profile/" + userId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        }
    })

    const res = await req.json()

    if (res.status == "success") {
        setState(res.user)
    }
}