window.onload = () => {
    getUserDataIntoEditForm()
}

async function getUserDataIntoEditForm() {
    let data = await fetch("/api/v1/getUserData")
    let userData = await data.json()
    console.log(document.getElementById("name").innerHTML)
    document.getElementById("name").value = userData.user_name
    document.getElementById("email").value = userData.email
    document.getElementById("password").value = userData.password
    document.getElementById("gender").value = userData.gender
    document.getElementById("intro").value = userData.introduction
}

