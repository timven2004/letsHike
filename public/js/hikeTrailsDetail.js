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
    }

    catch (e) {
        console.log(e)
    }
}
