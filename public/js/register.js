window.onload = () => {
    userRegisterFormSubmit()
}

function userRegisterFormSubmit() {
    const form = document.getElementById("register-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()

        if(form.password.value !== form.password1.value){
            document.getElementById("message").innerHTML = "Confirmed Password don't same"
            return
        }
        const formData = new FormData(); 
        formData.append("name", form.name.value)
        formData.append("email", form.email.value)
        formData.append("password", form.password.value)
        formData.append("gender", form.gender.value)
        formData.append("intro", form.intro.value)
        formData.append("image", form.image.files[0])
        const res = await fetch("/api/v1/usersRegister", {
            method: "POST",
            body: formData
        })
        const result = await res.json()
        if(res.status === 200){
            document.getElementById("message").innerHTML = result.message
            return
        }
    })
}
