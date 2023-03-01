var ws,out=document.getElementById("out");
function connect()
{if ("WebSocket" in window)
    {var l = window.location;ws = new WebSocket("ws://" + (l.hostname ? l.hostname : "localhost") + ":" + (l.port ? l.port : "5222") + "/"); 
    out.value="connecting..." ;
    ws.onopen=function(e){out.value="connected";} 
    ws.onclose=function(e){out.value="disconnected";}
    ws.onmessage=function(e){out.value=e.data;}
    ws.onerror=function(e){out.value=e.data;}
    }else alert("WebSockets not supported on your browser.");
}