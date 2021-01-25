window.onload = () => {
    getTrailData()
}

async function getTrailData(){
    const paramString = window.location.search
    const searchParam = new URLSearchParams(paramString)
    const trailID = searchParam.get("id")
    const res = await fetch(`/getTrailData/${trailID}`)
    const data = await res.json()
    console.log(data)
    document.querySelector(".photo.b").style.backgroundImage = `url("${data.image}")`
    document.querySelector(".nameOfTrail > p").innerHTML = data.name
    document.querySelector(".intro").innerHTML = data.introduction
}