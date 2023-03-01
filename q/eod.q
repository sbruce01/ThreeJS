// Arguments:
// logfile - The name of the TP log file sitting in the OnDiskDB directory

// Load in the sym.q file
system"l tick/",(src:"sym"),".q"

// Take in the log file as an option
.u.opt:.Q.opt[.z.x];



// Create the log out file
upd:{[x;y]
        $[x in `quote`trade;
            x insert y;
            [
                .debug.xy:`x`y!(x;y);                
                f:key flip value x;
                x set flip f!y;
            ]
        ];
    };


-11!hsym `$"OnDiskDB/",first .u.opt[`logfile]

// Write down to disk


((hsym `$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/trade/"); ``time`sym!((17;2;6); (0;0;0); (0;0;0))) set .Q.en[`$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/trade";trade]
((hsym `$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/quote/"); ``time`sym!((17;2;6); (0;0;0); (0;0;0))) set .Q.en[`$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/quote";quote]
((hsym `$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/aggregation/"); ``sym!((17;2;6); (0;0;0))) set .Q.en[`$"OnDiskDB/hdb/",_[3;first .u.opt[`logfile]],"/aggregation";aggregation]
