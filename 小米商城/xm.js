let bannar=document.querySelector('#bannar');
let items=bannar.children
let index=0;
// 自动轮播
setInterval(function(){
    items[index].className='';
    index++;
    if(index===items.length){
        index=0;
    }
    items[index].className='active';
},6000);