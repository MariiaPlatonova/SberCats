const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const updBlock = document.querySelector(".upd");

let user = "MariiaPlatonova";
// if(!user){
//     user = prompt("Представьтесь, пожалуйста");
//     localStorage.setItem("catUser", user);
// }
popupBlock.querySelector(".popup__close").addEventListener("click", function() {
    popupBlock.classList.remove("active");
 })

 updBlock.querySelector(".upd__close").addEventListener("click", function() {
    updBlock.classList.remove("active");
 })

document.querySelector("#add").addEventListener("click", function(e){
    e.preventDefault();
    popupBlock.classList.add("active");
})

document.querySelector("#updatebtn").addEventListener("click", function(e){
    e.preventDefault();
    updBlock.classList.add("active");
})

const addform =document.forms.addform;
const updform =document.forms.updform;
//функция отрисовки карточки кота

const createCard = function(cat, parent){
const card = document.createElement("div");
card.className = "card";
const  img = document.createElement("div");
img.className = "card-pic";
if(cat.img_link){
img.style.backgroundImage = `url(${cat.img_link})`;
} else{
    img.style.backgroundImage = "url(img/default.png)";
    img.style.backgroundSize= "contain";
    img.style.backgroundColor ="transparent";
}


const name = document.createElement("h3");
name.innerText = cat.name;

// Информация о котике
const inf = document.createElement("button");
inf.innerText ="Узнать больше";
inf.className = "inf";
inf.id = cat.id;
inf.addEventListener("click", function(e){
    let id = e.target.id;
    infoCat(id);
})

// удаление котика
const del = document.createElement("button");
del.innerText ="Удалить";
del.className = "delete";
del.id = cat.id;
del.addEventListener("click", function(e){
    let id = e.target.id;
    deleteCat(id, card);
})


//сбор матрешки

card.append(img,name,inf,del);
parent.append(card);
}

// инфо карта о коте
const createInfoCard =  function(cat,parent){
const card = document.createElement("div");
card.className = "card";
const  img = document.createElement("div");
img.className = "card-pic";
if(cat.img_link){
img.style.backgroundImage = `url(${cat.img_link})`;
} else{
    img.style.backgroundImage = "url(img/default.png)";
    img.style.backgroundSize= "contain";
    img.style.backgroundColor ="transparent";
}
const nameInfo = document.createElement("h3");
nameInfo.innerText = cat.name;
const idInfo = document.createElement("h3")
idInfo.innerText = cat.id;
const textInfof = document.querySelector("#discription").value;
const textInfo = document.createElement("p");
textInfo.innerText = textInfof;

card.append(img,nameInfo,idInfo ,textInfo);
parent.append(card);
}

fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`)//запрос на сервер
.then(res =>res.json())// ответ, что такой запрос существует
.then(data=>{
    console.log(data);//получение результата
    if(data.message ==="ok"){
        data.data.forEach(function(el){
            createCard(el,container);
        });
    }
})

const addCat = function(cat){

    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`,{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(cat)
    })
    .then(res =>res.json())
    .then(data =>{
        console.log(data);
        if(data.message ==="ok"){
            createCard(cat, container);
            addform.reset();
        }
    })
}

const deleteCat = function(id, tag){
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`,{
        method: "DELETE"
    }).then(res =>res.json())
    .then(data =>{if (data.message === "ok")
    tag.remove();
 })
}

const infoCat = function(id){
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show/${id}`)
    .then(res =>res.json())// ответ, что такой запрос существует
    .then(data=>{
        console.log(data);
        if(data.message ==="ok"){
            for(let key in data){
                createInfoCard(data[key],container);
            }
        }
    })
}
   


// const updateCat = function(id){
//     fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`,{
//         method: "PUT",
//     })
//     .then(res =>res.json())
//     .then(data =>{
//         console.log(data);
//         if(data.message ==="ok"){
//             addCat(data);
//             updform.reset();
//         }
//     })
// }

addform.addEventListener("submit", function(e) {
    e.preventDefault();
    let body = {};/*Отправить форму в бд*/
    for(let i =0;i<addform.elements.length; i++){
        let el = addform.elements[i];
        console.log(el);
        if(el.name){
            body[el.name] = el.name==="favourite"?el.checked : el.value;
        }
    }
    console.log(body);
    addCat(body);
});

// updform.addEventListener("submit", function(e) {
//     e.preventDefault();
//     let body = {};/*Отправить форму в бд*/
//     for(let i =0;i<updform.elements.length; i++){
//         let el = updform.elements[i];
//         let idcat = updform.elements[0];
//         console.log(el);
//         if(el.id){
//             body[el.id] = el.id==="favourite"?el.checked : el.value;
//         }
//     }
//     console.log(body);
//     updateCat(idcat);
// });


