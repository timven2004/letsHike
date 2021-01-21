window.onload = () => {
    userRegisterFormSubmit()
}

function userRegisterFormSubmit() {
    const form = document.getElementById("register-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        
        if(form.password.value !== form.password1.value){
            document.getElementById("message").innerHTML = "Confirmed Password not same"
            return
        }
        const formObject = {}
        formObject["name"] = form.name.value
        formObject["email"] = form.email.value
        formObject["password"] = form.password.value
        const res = await fetch("/api/v1/usersRegister", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        })
        const result = await res.json()
        console.log(result)
    })
}
