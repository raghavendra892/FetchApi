let cl = console.log;

let baseUrl =  `http://localhost:3000/posts`;  
const postcontainer = document.getElementById("postcontainer");        
const postform = document.getElementById("postform");                   
const contentControl = document.getElementById("content");               
const titleControl = document.getElementById("title");                      
const subBtn = document.getElementById("subBtn");                           
const UpdateBtn = document.getElementById("UpdateBtn");                     

const templating = (arr) =>{                    
    let result = ``;
    arr.map(post => {
      result += `
                    <div class="card mb-4" id="${post.id}">
                        <div class="card-header">
                            <h3>
                                ${post.title}
                            </h3>
                        </div>
                        <div class="card-body">
                            <p>
                                ${post.body}
                            </p>
                        </div>
                        <div class="card-footer text-right">
                            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                        </div>
                    </div>
   
      `  
    });
    postcontainer.innerHTML = result; 
}

// onclick="onEdit(this)"                                                  
//onclick="onDelete(this)"                                                      
const makeApicall = (apiUrl, methodName, msgBody) =>{                                    
    return fetch(apiUrl, {
        method : methodName,         
        body : msgBody,
        headers : {
                "content-type" : "application/json; charset=UTF-8",
                "authorization" : "Take JWT token from LocalStorage"
            }
        })      
             .then(res => res.json()) // here json method returns promise
}

async function init() {
    try{
        let res = await makeApicall(baseUrl, "GET", null);
        templating(res)
    }catch(err){
        //alert(err);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err
          })
    }
}
init();

// makeApicall(baseUrl, "GET", null)                                                       
//     .then(data => templating(data))
//     .catch(err => cl(err))




const onpostSubmit = (eve) =>{      //14
     //eve.ngOnInit();  
     let obj = {
        title : contentControl.value.trim(),
        body : titleControl.value.trim(),
        userId : Math.ceil(Math.random() * 10)

     }
     makeApicall(baseUrl, "POST", JSON.stringify(obj))      
        //.then(res => cl(res))                               
        .then(res =>{
            Swal.fire('Post is Submitted Successfully!!!!')
        })
}

const onEdit = (ele) =>{                                   
   // cl(ele)
    let getEditId = ele.closest(".card").id                     
   // cl(getEditId)
   localStorage.setItem("upadteId", getEditId);           
   let getEditUrl = `${baseUrl}/${getEditId}`;
   makeApicall(getEditUrl, "GET")
        .then(res =>{
           // cl(res) 
           titleControl.value = res.title;
           contentControl.value = res.body;
           subBtn.classList.add("d-none");
           UpdateBtn.classList.remove("d-none");
          // Swal.fire('Post is Edit Successfully!!!!')
        })
}

// const onpostUpdate = () =>{             //23
//     let upadteId1 = localStorage.getItem("upadteId")
//     let updateUrl = `${baseUrl}/${upadteId1}`;
//     let obj = {
//         title : titleControl.value,
//         body : contentControl.value
//     }
//     makeApicall(updateUrl, "PATCH", JSON.stringify(obj)) 
//         .then(res =>{
//             Swal.fire('Post is Upadted Successfully!!!!')
//         })
//         .catch(cl)
// }

const onpostUpdate = async() =>{             //23
    let upadteId1 = localStorage.getItem("upadteId")
    let updateUrl = `${baseUrl}/${upadteId1}`;
    let obj = {
        title : titleControl.value,
        body : contentControl.value
    }
    try{
        let res = await makeApicall(updateUrl, "PATCH", JSON.stringify(obj)) 
        // Swal.fire({
        //     position: 'top-end',
        //     icon: 'success',
        //     title: 'Post is upadted Successfully!!!!',
        //     showConfirmButton: false,
        //     timer: 5000
        // })
       Swal.fire('Post is upadted Successfully!!!!')
    }catch(err){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err
        })
    }
       
}

// .then(res =>{
//     Swal.fire('Post is Upadted Successfully!!!!')
// })
// .catch(cl)


const onDelete = (ele) =>{        
    //cl(ele)
    let deleteId = ele.closest(".card").id;
    //cl(deleteId);
    let deleteUrl = `${baseUrl}/${deleteId}`;
    makeApicall(deleteUrl, "DELETE")
        .then(res =>{
            Swal.fire('Post is Deleted Successfully!!!!')
        })
        .catch(cl)

}

postform.addEventListener("submit", onpostSubmit);      
UpdateBtn.addEventListener("click", onpostUpdate);        


