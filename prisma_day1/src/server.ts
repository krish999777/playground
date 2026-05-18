import {PrismaClient} from '@prisma/client'

const prisma=new PrismaClient()

// const many=await prisma.user.findMany({
//     where:{books:{some:'atomic habits'}}
// })
const updated=await prisma.user.updateManyAndReturn({
    where:{name:'chirag'},
    data:{books:[]}
})


const allUsers=await prisma.user.findMany({})
console.log(updated)