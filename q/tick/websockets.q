/ no dayend except 0#, can connect to tick.q or chainedtick.q tickerplant
/ q chainedr.q :5110 -p 5111 </dev/null >foo 2>&1 & 

/ q tick/chainedr.q [host]:port[:usr:pwd] [-p 5111] 
\l ../logging.q

if[not "w"=first string .z.o;system "sleep 1"]

if[not system"p";system"p 5222"]

.ws.handle:-1i;

.u.x:.z.x,(count .z.x)_enlist":5000"
tph:hopen`$":",.u.x 0

upd:{0N!(x;y);if[.ws.handle>0i;neg[.ws.handle].j.j `blue`red`green!(first 1?2i;first 1?2i;first 1?2i)]}

.u.x:.z.x,(count .z.x)_enlist":5000"

.u.end:{0N!"EOD Invoked CEP"};

/ connect to tickerplant or chained ticker plant for (schema;(logcount;log))
(hopen `$":",.u.x 0)".u.sub[`trade;`];.u.add[`quote;`]";

.z.wo:{`.ws.handle set x};
.z.wc:{`.ws.handle set -1i};
.z.ws:{[x] 0N!x};