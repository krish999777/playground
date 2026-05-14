import prisma from './config/prisma'

const user=await prisma.user2.create({
    data:{

        name:"Krish 2",
        email:"krish2@gmail.com"
    }
})
console.log(user)