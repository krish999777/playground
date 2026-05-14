import prisma from './config/prisma'

const user=await prisma.user.create({
    data:{
        name:"Krish",
        email:"krish@gmail.com"
    }
})
console.log(user)