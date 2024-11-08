export const SerializeForm = (form) => {
    const formData = new FormData(form)

    const newObj = {}

    for (let [name, value] of formData) {
        newObj[name] = value
    }

    return newObj
}