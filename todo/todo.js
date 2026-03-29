
let currentTask={};
let taskData=JSON.parse(localStorage.getItem('data'))||[];
let trashData=JSON.parse(localStorage.getItem('d_data'))||[];

let btn_sub=document.querySelector('.submit_btn');
const inputContent=document.querySelector('.input input')
const todoList=document.querySelector('.todo_list')
const del_btn=document.querySelector('.btn_delete')
const fin_btn=document.querySelector('.btn_finish');
const unfin_btn=document.querySelector('.btn_unfinish')
const itemCountContent=document.querySelector('.bar_message.bottom')
const all=document.querySelector('.all');
const unfinished=document.querySelector('.unfinished');
const finished=document.querySelector('.finished');
const completeAll=document.querySelector('.complete_all');
const clearAll=document.querySelector('.clear_all');
const clearCompleted=document.querySelector('.clear_completed')
const deletedBox=document.querySelector('.deleted');
const exportData=document.querySelector('.export_data');
const importData=document.querySelector('.import_data');





const reset=()=>{
    currentTask={};
    inputContent.value="";
    
}
const renderTask=(Tasks)=>{
    todoList.innerHTML="";
    Tasks.forEach(({id,content,static})=>{
        todoList.innerHTML+=`
        <li id="${id}">
            <div class="content ${static===1?'completed':""}">${content}</div>
            <div class="todo_btn ${static===1?'btn_finish':'btn_unfinish'}"
            onclick=toggle(this)
            ></div>
            <div class="todo_btn btn_delete" 
            onclick=_delete(this)
            ></div>
        </li>
        `
    })
}

btn_sub.onclick=function(){
    //试保存
    const taskObj={
        id:`${Date.now()}`,
        content:inputContent.value,
        static:0
    };
    const dataArrIndex=taskData.findIndex((item)=>item.id===currentTask.id);
    if(dataArrIndex===-1){
        taskData.unshift(taskObj)
    }
    else{
        taskData[dataArrIndex]=taskObj;
    }
    localStorage.setItem('data',JSON.stringify(taskData));
    updateTodoList();
    reset();
}
const updateTodoList=()=>{
    let itemCount=0;
    todoList.innerHTML="";
    taskData.forEach(({id,content,static})=>{
        todoList.innerHTML+=`
        <li id="${id}">
            <div class="content ${static===1?'completed':""}">${content}</div>
            <div class="todo_btn ${static===1?'btn_finish':'btn_unfinish'}"
            onclick=toggle(this)
            ></div>
            <div class="todo_btn btn_delete" 
            onclick=_delete(this)
            ></div>
        </li>
        `
        if(static===0){
            itemCount++;
        }
    })
    itemCountContent.textContent=`还有${itemCount}项未完成`
}

const updateDeletedBox=()=>{
    todoList.innerHTML="";
    trashData.forEach(({id,content,static})=>{
        todoList.innerHTML+=`
        <li id="${id}">
            <div class="content ${static===1?'completed':""}">${content}</div>
            <div class="todo_btn ${static===1?'btn_finish':'btn_unfinish'}"
            onclick=toggle(this)
            ></div>
            <div class="todo_btn btn_delete" 
            onclick=_delete(this)
            ></div>
            <div class="todo_btn btn_restore"  onclick=restore(this)>恢复</div>
        </li>
        `
    });
}


const toggle=function(btn){
    const index=taskData.findIndex((item)=>item.id===btn.parentElement.id);
    if(taskData[index].static===1){
        taskData[index].static=0;
        btn.classList.add('btn_unfinish');
        btn.classList.remove('btn_finish');
    }
    else{
        taskData[index].static=1;
        btn.classList.add('btn_finish');
        btn.classList.remove('btn_unfinish');
    }
    localStorage.setItem('data',JSON.stringify(taskData));
    updateTodoList();
}
const _delete=function(btn){
    const index=taskData.findIndex((item)=>item.id===btn.parentElement.id);
    btn.parentElement.remove();
    trashData.unshift(taskData[index]);
    taskData.splice(index,1);
    localStorage.setItem('data',JSON.stringify(taskData));
    localStorage.setItem('d_data',JSON.stringify(trashData));
}

all.onclick=()=>{
    updateTodoList();
}

unfinished.onclick=()=>{
    const activeTask=taskData.filter(task=>task.static===0);
    renderTask(activeTask);
}

finished.onclick=()=>{
    const completedTask=taskData.filter(task=>task.static===1);
    renderTask(completedTask);
}

completeAll.onclick=()=>{
    taskData.forEach((task)=>{
        task.static=1;
    });
    updateTodoList();
    localStorage.setItem('data',JSON.stringify(taskData));
}
clearAll.onclick=()=>{
    taskData.forEach((task)=>{
        trashData.unshift(task);
    });
    taskData=[];
    updateTodoList();
    localStorage.setItem('data',JSON.stringify(taskData));
    localStorage.setItem('d_data',JSON.stringify(trashData));

}

deletedBox.onclick=()=>{
    updateDeletedBox();
}

const restore=(btn)=>{
    const index=trashData.findIndex((item)=>item.id===btn.parentElement.id);
    taskData.unshift(trashData[index]);
    trashData.splice(index,1);
    updateDeletedBox();
    localStorage.setItem('data',JSON.stringify(taskData));
    localStorage.setItem('d_data',JSON.stringify(trashData));
}
clearCompleted.onclick=()=>{
    const activeTask=taskData.filter(task=>task.static===0);
    const completedTask=taskData.filter(task=>task.static===1);
    completedTask.forEach(item=>{
        trashData.unshift(item);
    })
    taskData=activeTask;
    updateTodoList();
    localStorage.setItem('data',JSON.stringify(taskData));
    localStorage.setItem('d_data',JSON.stringify(trashData));


}
exportData.onclick=()=>{
    const dataStr=JSON.stringify(taskData);
    const blob=new Blob([dataStr],{type:"application/json"});
    
    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");
    a.href=url;
    a.download="我的任务.json";
    a.click();
    URL.revokeObjectURL(url);
}

const _import=(file)=>{
    const reader=new FileReader();

    reader.onload=(event)=>{
        const fileContent=event.target.result;
        const importedData=JSON.parse(fileContent);
        taskData=importedData;
        updateTodoList();
        localStorage.setItem('data',JSON.stringify(taskData));
        alert('导入成功');
    };
    reader.readAsText(file);
}

importData.onclick=()=>{
    document.getElementById('importFile').click();

}
document.getElementById('importFile').onchange=(event)=>{
    const file=event.target.files[0];
    if(file){
        _import(file);
    }
}




updateTodoList();