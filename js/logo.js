
(DOM.listToArray(DOM.getByClassName("QQ")).concat(DOM.listToArray(DOM.getByClassName("QQCode")))).forEach(function(val){
    on(val,"mouseenter",function(){DOM.setCss(DOM.getByClassName("qqLogoRight")[0],"opacity",0.5);DOM.getByClassName("coursePhone")[0].style.display="block";});
    on(val,"mouseenter",function(){DOM.getByClassName("coursePhone")[0].style.display="block";animate(DOM.getByClassName("coursePhone")[0],{opacity:1},1000)});
    on(val,"mouseleave",function(){DOM.setCss(DOM.getByClassName("qqLogoRight")[0],"opacity",1);});
    on(val,"mouseleave",function(){animate(DOM.getByClassName("coursePhone")[0],{opacity:0},1000,1,function(){DOM.getByClassName("coursePhone")[0].style.display="none";});});
});
/*input验证*/
   on(DOM.getByClassName("account")[0],"focus",function(){if(this.value==this.defaultValue)this.style.color="#DDDDDD"});

   on(DOM.getByClassName("account")[0],"keydown",function(){if(this.value==this.defaultValue)this.value="";this.style.color="#333333";this.style.fontSize="18px";DOM.getByClassName("accountDel")[0].style.display="block"});

    on(DOM.getByClassName("account")[0],"blur",function(){var reg=/^(\d{5,11})|(\d{11})|((\w|[\u4e00-\u9fa5]){1,25}@[a-zA-z0-9]+$\.([a-zA-Z0-9])+)/;if(!reg.test(this.value)){DOM.getByClassName("errorMessage")[0].style.display="block"}else{DOM.getByClassName("errorMessage")[0].style.display="none"}if(this.value==this.defaultValue)this.style.fontSize="12px"});

on(DOM.getByClassName("accountDel")[0],"click",function(){DOM.getByClassName("account")[0].value=DOM.getByClassName("account")[0].getAttribute("defaultValues");DOM.getByClassName("account")[0].style.color="#DDDDDD";if(DOM.getByClassName("account")[0].value==DOM.getByClassName("account")[0].defaultValue)DOM.getByClassName("account")[0].style.fontSize="12px";});

on(DOM.getByClassName("password")[0],"focus",function(){if(this.value==this.defaultValue)this.style.color="#DDDDDD";});

on(DOM.getByClassName("password")[0],"keydown",function(){this.type="password";if(this.value==this.defaultValue)this.value="";this.style.color="#333333";this.style.fontSize="30px";});
on(DOM.getByClassName("password")[0],"blur",function(){if(this.value==""){this.value=this.defaultValue;this.type="text";this.style.color="#DDDDDD";this.style.fontSize="12px"}});


/*tab切换*/
on(document.getElementById("tabOne"),"click",function(){DOM.getByClassName("qqLogo")[0].style.display="block";DOM.getByClassName("wxLogo")[0].style.display="none";this.style.borderBottom="2px solid #31A4F6";document.getElementById("tabTwo").style.borderBottom="0 solid #31A4F6";});
on(document.getElementById("tabTwo"),"click",function(){DOM.getByClassName("qqLogo")[0].style.display="none";DOM.getByClassName("wxLogo")[0].style.display="block";this.style.borderBottom="2px solid #4AB218";document.getElementById("tabOne").style.borderBottom="0 solid #31A4F6";});
var QQCodeHide=document.getElementById("QQCodeHideId");
window.setInterval(function () {
    QQCodeHide.style.display="block";
},300000);
var codeNum=2;
QQCodeHide.onclick=function () {
  DOM.getByClassName("QQCode")[0].src="images/logoImg/qqCode"+codeNum+".png";
    codeNum=codeNum==1?2:1;
  this.style.display="none";
};