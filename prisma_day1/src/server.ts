import {PrismaClient} from '@prisma/client'

const prisma=new PrismaClient()


const allUsers=await prisma.user.findMany({
    where:{
        name:"krish",
        email:
        "alpa"
    }
    
})
await prisma.user.
console.log(allUsers)