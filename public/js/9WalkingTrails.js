console.log("connected js")

const el = document.querySelector('body');
const page = document.querySelector(".page")
let position = 0;

el.addEventListener('wheel', function(event){
    console.log(event.deltaY);
    position = position + event.deltaY*0.5;
    page.style.left =`${position}px`;
    console.log(viewer.style.left);
});
