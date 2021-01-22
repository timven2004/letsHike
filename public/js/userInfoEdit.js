window.onload = () => {
    getUserDataIntoEditForm()
    userDataEditFormSubmit()
}

async function getUserDataIntoEditForm() {
    const data = await fetch("/api/v1/getUserData")
    const userData = await data.json()
    document.getElementById("name").value = userData.user_name
    document.getElementById("email").value = userData.email
    document.getElementById("password").value = userData.password
    document.getElementById("gender").value = userData.gender
    document.getElementById("intro").value = userData.introduction
    document.getElementById("user_icon").src = userData.user_icon
}

function userDataEditFormSubmit() {
    const form = document.getElementById("edit-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formData = new FormData(); 
        formData.append("name", form.name.value)
        formData.append("email", form.email.value)
        formData.append("password", form.password.value)
        formData.append("gender", form.gender.value)
        formData.append("intro", form.intro.value)
        formData.append("image", form.image.files[0])
        const res = await fetch("/api/v1/editUserData", {
            method: "PUT",
            body: formData
        })
        let result = await res.json()
        console.log(result)
    })
}