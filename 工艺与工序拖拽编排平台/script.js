// const { createElement } = require("react");

const create_btn=document.querySelector('.left_2 button');
const crafts=document.querySelector('.list_2');
let selectedLi=null;
const deleteBtn=document.querySelector('.delete');
const itemsList=document.querySelectorAll('.list_1 li');
const create=document.querySelector('.create');
const createList=document.querySelector('.create .create_list')



let craftList=JSON.parse(localStorage.getItem('data'))||[];

renderAllCraft();

const saveData=()=>{
    localStorage.setItem('data',JSON.stringify(craftList));
}
create_btn.onclick=()=>{
    const newCraft={
        id:`${Date.now()}`,
        name:`工艺${craftList.length+1}`,
        content:[]
    };
    craftList.push(newCraft);
    saveData();
    renderAllCraft();

}
function renderAllCraft(){
    crafts.innerHTML="";
    craftList.forEach((item,index)=>{
        const li =document.createElement('li');
        li.className='items';
        li.onclick=()=>{
            selected(li);
        }
        li.id=item.id;
        const span=document.createElement('span');
        span.textContent=item.name;

        const input=document.createElement('input');
        input.type='text';
        input.value=item.name;
        input.style.display='none';

        li.appendChild(span);
        li.appendChild(input);
        crafts.appendChild(li);
        //点击文本input展现，开始编辑
        span.onclick=(e)=>{
            e.stopPropagation();
            span.style.display='none';
            input.style.display='inline-block';
            input.focus();
        };

        const finishEdit=()=>{
            const val=input.value.trim()||'未命名工艺';
            craftList[index].name=val;
            saveData();
            renderAllCraft();
        };

        input.onblur=finishEdit;
        input.onkeydown=(e)=>{
            if(e.key==='Enter') finishEdit();
        };
    });
};
function selected(li){
    if(selectedLi===li){
        selectedLi.classList.remove('active');
        selectedLi=null;
        document.querySelector('.right .title h2').textContent='未定义';

        return;
    }
    if(selectedLi){
        selectedLi.classList.remove('active');
    }
    selectedLi=li;
    li.classList.add('active');
    document.querySelector('.right .title h2').textContent=li.querySelector('span').textContent;
    updateCreate();

}
//点击空白取消选中
document.addEventListener('click',(e)=>{
    if(e.target.closest('.del_btn')) return;
    if(e.target.closest('.create_list li')) return;
    if(!e.target.closest('.list_2 .items')){
        if(selectedLi){
            selectedLi.classList.remove('active');
            selectedLi=null;
        }
        updateCreate();
    }
})

deleteBtn.onclick=()=>{
    if(!selectedLi){
        alert('请选中工艺');
        return;
    }
    const index=craftList.findIndex((item)=>item.id===selectedLi.id);
    craftList.splice(index,1);
    selectedLi=null;
    saveData();
    renderAllCraft();
}

//拖拽功能
itemsList.forEach(item=>{
    item.setAttribute('draggable',true);
    item.addEventListener('dragstart',(e)=>{
        e.dataTransfer.setData('text/plain',item.textContent);
        item.style.opacity='0.6';
    });
    item.addEventListener('dragend',()=>{
        item.style.opacity='1';
    });
});
create.addEventListener('dragover',(e)=>{
    e.preventDefault();

});

function deleteItem(li){
    if(!selectedLi){
        alert('请选中工艺');
        return;
    }
    const index=craftList.findIndex((item)=>item.id===selectedLi.id);
    craftList[index].content=craftList[index].content.filter(item=>item!==li.firstChild.textContent);
    updateCreate();
    localStorage.setItem('data',JSON.stringify(craftList));

}


const updateCreate=()=>{
    if(!selectedLi){
        createList.innerHTML="";
        let h2 = document.querySelector('.right .title h2');
        h2.textContent = '未选择';
    
        return;
    }
    createList.innerHTML="";
    const index=craftList.findIndex((item)=>item.id===selectedLi.id);
    craftList[index].content.forEach((text)=>{
        const li=document.createElement('li');
        li.textContent=text;
        setupDrag(li);
        createList.appendChild(li);
        const div=document.createElement('div');
        div.classList.add('del_btn');
        div.textContent='删除';
        li.appendChild(div);
        div.onclick=()=>{
            deleteItem(li);
        }
    });
};
create.addEventListener('drop',(e)=>{
    e.preventDefault();
    let text=e.dataTransfer.getData('text/plain');
    if(!selectedLi){
        alert('还没选中工艺');
        return;
    }
    const index=craftList.findIndex((item)=>item.id===selectedLi.id);
    if(craftList[index].content.includes(text)){
        alert('不能重复添加该工艺');
        return;
    }
    craftList[index].content.unshift(text);
    updateCreate();
    localStorage.setItem('data',JSON.stringify(craftList));
});

//拖拽排序
let source=null;
function setupDrag(item){
    item.setAttribute('draggable',true);
    item.ondragstart=(e)=>{
        source=e.target;
        e.dataTransfer.effectAllowed='move';
        // item.classList.add('dragging');
        item.style.opacity=0.6;
        e.stopPropagation();

    }
    item.ondragover=(e)=>{
        e.preventDefault();
        e.stopPropagation();
    }
    item.ondragenter=(e)=>{
        e.preventDefault();
        if(source===e.target){
            return;
        }
        dragIndex=Array.from(item.parentElement.children).indexOf(source);
        dropIndex=Array.from(item.parentElement.children).indexOf(e.target);
        if(dragIndex>dropIndex){
            item.parentElement.insertBefore(source,e.target);
        }
        else{
            item.parentElement.insertBefore(e.target,source);
        }
        e.stopPropagation();

    }
    item.ondrop=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        source.style.opacity=1
    }
    
}

