// CSV Reader

// Arguments:
// csvFile - The csv file to read from the current directory 
// schema - The schema of the csv file to be upserted
.u.opt:.Q.opt[.z.x];

if[not any (`$.u.opt[`schema]) in `trade`quote`aggregation;0N!"Schema does not exist";exit 0];

// Initialise the handle to TP
.handle.h:hopen hsym `$first .u.opt[`tp];

t:("PSFJ"; enlist",") 0: `$first .u.opt[`csvFile];

/ {neg[.handle.h](".u.upd";`$first .u.opt[`schema];x)}each value each t
neg[.handle.h](".u.upd";`$first .u.opt[`schema];t)