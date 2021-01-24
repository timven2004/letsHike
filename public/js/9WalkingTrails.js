console.log("connected js")

const el = document.querySelector('body');
const page = document.querySelector(".page");
const img = document.querySelectorAll(".img");
let position = 0;

el.addEventListener('wheel', function(event){
    if (position>=-100 && event.deltaY<0){ 
        console.log(event.deltaY);
        position = position + event.deltaY*0.7;
        page.style.left =`${position}px`;
        console.log(page.style.left);
    }

    if (position>-3500 && position<-100){ 
        console.log(event.deltaY);
        position = position + event.deltaY*0.7;
        page.style.left =`${position}px`;
        console.log(page.style.left);
    }

    if (position<=-3500 && event.deltaY>0){ 
        console.log(event.deltaY);
        position = position + event.deltaY*0.7;
        page.style.left =`${position}px`;
        console.log(page.style.left);
    }

});

