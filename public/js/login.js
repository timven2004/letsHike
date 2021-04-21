window.onload = () => {
    loginFormSubmit()
}

function loginFormSubmit() {
    const form = document.getElementById("login-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formObject = {}
        formObject["name"] = form.name.value
        formObject["password"] = form.password.value
        const res = await fetch("/api/v1/userLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(formObject)
        })
        const result = await res.json()
        document.getElementById("message").innerHTML = result.message
        if(res.status===200){
            window.location.assign("/events.html")
        }
    })
}