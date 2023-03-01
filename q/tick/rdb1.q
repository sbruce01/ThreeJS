/q tick/r.q [host]:port[:usr:pwd] [host]:port[:usr:pwd]
/2008.09.09 .k ->.q

if[not "w"=first string .z.o;system "sleep 1"];

\l ../logging.q

upd:insert;

/ get the ticker plant port, default 5000
.u.x:.z.x,(count .z.x)_enlist":5000"

/ end of day: save, clear, hdb reload
.u.end:{0N!"EOD Invoked RDB1"};

/ connect to ticker plant for (schema;(logcount;log))
(hopen `$":",.u.x 0)".u.sub[`trade;`];.u.add[`quote;`]";