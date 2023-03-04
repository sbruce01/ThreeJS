h:neg hopen `$":",.z.x 0 /connect to tickerplant 
syms:`MSFT.O`IBM.N`GS.N`BA.N`VOD.L /stocks
prices:syms!45.15 191.10 178.50 128.04 341.30 /starting prices 
flag:1 /generate 10% of updates for trade and 90% for quote
getmovement:{[s] rand[0.0001]*prices[s]} /get a random price movement 
/generate trade price
getprice:{[s] prices[s]+:rand[1 -1]*getmovement[s]; prices[s]} 
getbid:{[s] prices[s]-getmovement[s]} /generate bid price
getask:{[s] prices[s]+getmovement[s]} /generate ask price
/timer function
.z.ts:{
  s:first 1?syms;
  $[0<flag mod 10;
    h(".u.upd";`quote;(.z.p;s;getbid'[s];getask'[s];first 1?1000;first 1?1000)); 
    h(".u.upd";`trade;(.z.p;s;getprice'[s];first 1?1000))];
    {[h;x] h(".u.upd";`quote;x)}[h;]each 1000#enlist (.z.p;s;getbid'[s];getask'[s];first 1?1000;first 1?1000);

  flag+:1; }

/trigger timer every 100ms
\t 1