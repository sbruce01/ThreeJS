/ no dayend except 0#, can connect to tick.q or chainedtick.q tickerplant
/ q chainedr.q :5110 -p 5111 </dev/null >foo 2>&1 & 

/ q tick/chainedr.q [host]:port[:usr:pwd] [-p 5111] 
\l ../logging.q

if[not "w"=first string .z.o;system "sleep 1"]

if[not system"p";system"p 5112"]

.u.x:.z.x,(count .z.x)_enlist":5000"
tph:hopen`$":",.u.x 0
.u.pub:{[t;x] neg[tph](`.u.upd;t;value flip x)}

upd:{.debug.xy:(x;y);x insert y; 
    // Once we receive data for both tables start aggregating and publishing
    if[all `trade`quote in key `.;
        a:select maxTradePrice:max price, minTradePrice:min price, tradedVol:sum size by sym from trade;
        b:select highestBid:max bid, lowestAsk:min ask by sym from quote;
        .u.pub[`aggregation;0!a lj b];
    ];

    }

.u.x:.z.x,(count .z.x)_enlist":5000"

.u.end:{0N!"EOD Invoked CEP"};


/ connect to tickerplant or chained ticker plant for (schema;(logcount;log))
(hopen `$":",.u.x 0)".u.sub[`trade;`];.u.add[`quote;`]";