var c="function"==typeof Object.defineProperties?Object.defineProperty:function(a,d,b){a!=Array.prototype&&a!=Object.prototype&&(a[d]=b.value)},k="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function l(a,d){if(d){var b=k;a=a.split(".");for(var e=0;e<a.length-1;e++){var f=a[e];f in b||(b[f]={});b=b[f]}a=a[a.length-1];e=b[a];d=d(e);d!=e&&null!=d&&c(b,a,{configurable:!0,writable:!0,value:d})}}
l("Object.is",function(a){return a?a:function(a,b){return a===b?0!==a||1/a===1/b:a!==a&&b!==b}});l("Array.prototype.includes",function(a){return a?a:function(a,b){var d=this;d instanceof String&&(d=String(d));var f=d.length;b=b||0;for(0>b&&(b=Math.max(b+f,0));b<f;b++){var g=d[b];if(g===a||Object.is(g,a))return!0}return!1}});
l("String.prototype.includes",function(a){return a?a:function(a,b){if(null==this)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(a instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return-1!==this.indexOf(a,b||0)}});
var m=document.getElementById("regexStr"),n=document.getElementById("text-body"),p=document.getElementById("format-text"),q=document.getElementById("output"),r=document.getElementById("regexStrHist"),t=document.getElementById("findBtn"),v=document.getElementById("formatBtn"),w=document.getElementById("removeDuplicatesBtn"),x=new Audio("../public/app_alert-complete.mp3"),y=new Audio("../public/app_alert-error.mp3"),z={regexStr:"",regexStrHist:[],textBody:"",formatResults:"{result0}\n",results:[],soundFxOn:!0};
window.onload=function(){A();B();document.getElementById("regexStr").onkeypress=function(){var a=window.event;13===(a.charCode||a.keyCode)&&C()};r.onchange=function(){m.value=r.value};document.getElementById("clearBtn").onclick=function(){z.regexStrHist&&(z.regexStrHist=[],r.innerHTML="",D(),B())};t.onclick=function(){C()};v.onclick=function(){var a=p.value;if(z.results&&a){for(var d=z.results.length,b="",e=0;e<d;e++){for(var f=z.results[e].length,g=a+"",h=0;h<f;h++)g=g.replace(new RegExp("{result"+
(h?h:"")+"}","g"),z.results[e][h]);b+=g}q.innerHTML="<strong>Formatted Results ("+d+'):</strong> <textarea rows="10" class="full-width">'+b+"</textarea>"}D()};w.onclick=function(){var a=[],d=[];if(z.results){for(var b=z.results.length,e=0;e<b;e++){var f=z.results[e][0];a.includes(f)||(a.push(f),d.push(z.results[e]))}z.results=d.sort();D();B()}}};
function C(){if(q&&m&&n){var a=m.value,d=null;try{d=new RegExp(a,"i")}catch(u){console.log(u);q.innerHTML=(u+u.stack).replace(/\n/g,"<br/>");E(y);return}if(z.regexStrHist.includes(a))for(var b=0;b<z.regexStrHist.length;b++)z.regexStrHist[b]===a&&z.regexStrHist.splice(b,1);z.regexStrHist.unshift(a);z.textBody=n.value;b=z.textBody.length;for(var e=[],f,g=0,h=!1;!h;)g>=b?h=!0:(f=z.textBody.substr(g),(f=f.match(d))?(e.push(f),g=f.index+g+f[0].length):h=!0);0<e.length?(z.regexStr=a,z.results=e,E(x),D(),
B()):(E(y),q.innerHTML="Nothing found")}}function A(){var a=window.localStorage.getItem("regex-text-finder");a&&(a=JSON.parse(a))&&(z=a)}
function B(){if(z){var a=z.regexStrHist?z.regexStrHist.length:0;if(0<a){var d=z.regexStrHist[0];m.value=d;r.value=d;r.innerHTML="";for(d=0;d<a;d++){var b=z.regexStrHist[d];r.innerHTML+='<option value="'+b.replace(/"/g,"&quot;")+'">'+F(b)+"</option>"}}n.value=z.textBody;p.value=z.formatResults;if(z.results){a=z.results.length;d="<strong>Results ("+a+"):</strong> <ul>";for(b=0;b<a;b++){d+="<li>"+F(z.results[b][0])+"</li>";d+="<ul>";for(var e=z.results[b].length,f=1;f<e;f++)d+="<li>"+F(z.results[b][f])+
"</li>";d+="</ul>"}q.innerHTML=d+"</ul>"}}}function E(a){z.soundFxOn&&(a.pause(),a.currentTime=0,a.play())}function D(){z.formatResults=p.value;window.localStorage.setItem("regex-text-finder",JSON.stringify(z))}function F(a){return a.replace(/[\u00A0-\u9999<>&]/gim,function(a){return"&#"+a.charCodeAt(0)+";"})};
