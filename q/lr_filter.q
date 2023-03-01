// Arguments:
// logout - The name of the new TP log file to be created in the current directory
// logfile - The name of the TP log file sitting in the OnDiskDB directory

// Take in the log file as an option
.u.opt:.Q.opt[.z.x];

// Create the log out file
(hsym  `$first .u.opt[`logout]) set ();
.handle.h:hopen hsym  `$first .u.opt[`logout];

// Define the update function to filter on quote/trade tables and IBM.N, then write to log file
upd:{[t;x]
        if[t in `quote`trade;
            if[`IBM.N = first x 1;
                .handle.h enlist (`upd;t;x);
            ];
        ];
    };

-11!hsym `$"OnDiskDB/",first .u.opt[`logfile];

hclose .handle.h;