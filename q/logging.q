// Logging Script

/ i) details of connections opened
/ ii) details of connections closed
/ iii) all logging statements should include username of calling process where applicable 
/ and memory usage details from .Q.w[]
/ iv) functions should be available so that can write internal logging statements to write to 
/ standard out and error

// i)
.z.po:{
    0N!"Opened connection on handle ", string[.z.w], ". User: ", string[.z.u], ". Memory usage:", string[.Q.w[]`used]
    };
// ii)
.z.pc:{
    0N!"Closed connection with handle ", string[.z.w], ". User: ", string[.z.u], ". Memory usage:", string[.Q.w[]`used]
    };

.log.out:{@[-1;string[.z.p]," - User: ", string[.z.u], " - Memory usage: ",string[.Q.w[]`used]," - INFO : .log.out : ",$[10h ~ type x;x;string[x]]]}

.log.err:{@[-2;string[.z.p]," - User: ", string[.z.u], " - Memory usage: ",string[.Q.w[]`used]," - ERROR : .log.err : ",$[10h ~ type x;x;string[x]]]}