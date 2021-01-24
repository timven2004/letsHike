console.log("connected js")

const el = document.querySelector('body');
const page = document.querySelector(".page");
const imgs = document.querySelectorAll(".img");
let position = 0;

window.onload = async () => {
    try {
        const result = await fetch(`/9hiketrails/api/index`,
            {
                method: "GET", // Specific your HTTP method
                headers: {
                    // Specify any HTTP Headers Here
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
        let urls = await result.json()
        
            console.log(urls)

        for (let index in imgs) {
            imgs[index].setAttribute("src", `assets/9WalkingTrails/${urls[index].image}`)
        }
    }
    catch (e) {
        console.log(e)
    }
}

el.addEventListener('wheel', function (event) {
    if (position >= -100 && event.deltaY < 0) {
        position = position + event.deltaY * 0.7;
        page.style.left = `${position}px`;
    }

    if (position > -2500 && position < -100) {
        position = position + event.deltaY * 0.7;
        page.style.left = `${position}px`;
    }

    if (position <= -2500 && event.deltaY > 0) {
        position = position + event.deltaY * 0.7;
        page.style.left = `${position}px`;
    }

});

