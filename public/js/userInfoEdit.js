window.onload = () => {
    getUserDataIntoEditForm()
    userDataEditFormSubmit()
}

async function getUserDataIntoEditForm() {
    const data = await fetch("/api/v1/getUserData")
    const userData = await data.json()
    console.log(userData.user_icon)
    document.getElementById("name").value = userData.user_name
    document.getElementById("email").value = userData.email
    document.getElementById("password").value = userData.password
    document.getElementById("gender").value = userData.gender
    document.getElementById("intro").value = userData.introduction
}

function userDataEditFormSubmit() {
    const form = document.getElementById("edit-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formObject = {}
        formObject["name"] = form.name.value
        formObject["email"] = form.email.value
        formObject["password"] = form.password.value
        formObject["gender"] = form.gender.value
        formObject["intro"] = form.intro.value
        const res = await fetch("/api/v1/editUserData", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        })
        let result = await res.json()
        console.log(result)
    })
}