import type { Connection } from './types'

export const connections: Connection[] = [

{
id:"creator",
name:"Elev8 AI Creator Studio",
type:"application",
url:"localhost",
environment:"development",
status:"healthy",
lastChecked:"Just Now",
responseTime:12,
description:"AI Production Platform"
},

{
id:"command",
name:"Elev8 Command Center",
type:"application",
url:"localhost",
environment:"development",
status:"healthy",
lastChecked:"Just Now",
responseTime:9,
description:"Institutional Headquarters"
},

{
id:"os",
name:"Elev8 OS",
type:"application",
url:"Pending",
environment:"development",
status:"warning",
lastChecked:"Pending",
responseTime:0,
description:"Enterprise Platform"
}

]
