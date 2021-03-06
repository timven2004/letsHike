let params = new URLSearchParams(document.location.search.substring(1));
let trailId = params.get("trailId"); 
trailName = document.querySelector("#trailName")
trailImg1 = document.querySelector("#trailImg1")
hardness = document.querySelector("#hardness")
trailDescriptionLonger = document.querySelector(".trailDescriptionLonger")

window.onload = async () => {
    try {
        const result = await fetch(`/9hiketrails/intro/${trailId}`,
            {
                method: "GET", // Specific your HTTP method
                headers: {
                    // Specify any HTTP Headers Here
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
        let details = await result.json()
        
            console.log(details)
        trailName.innerHTML = details[0].name;
        trailImg1.setAttribute("src",`/assets/9WalkingTrails/${details[0].image}`)
        hardness.innerHTML = details[0].hardness;
        trailDescriptionLonger.innerHTML = details[0].introduction;

        showProfileNavbar()
        logOut()
    }

    catch (e) {
        console.log(e)
    }

}



//NavBar
async function showProfileNavbar() {
    const res = await fetch("/api/v1/userLoggedIn")
    const data = await res.json()

    if (data !== 'noLogin') {
        document.getElementById('hidden-propfile').innerHTML = `<a href="/userProfileSelf.html">My profile</a>`;
        document.getElementById('logout').innerHTML = '<a href="">Logout</a>'
    } else {
        document.getElementById('login').innerHTML = '<a href="/login.html">Login</a>'
    }
}

function logOut() {
    const logOut = document.getElementById('logout')
    logOut.addEventListener("click", async (e) => {
        e.preventDefault()
        const res = await fetch("/api/v1/logout")
        if (res.status === 200) {
            window.location = '/events.html'
        }
    })
}
