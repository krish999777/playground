import {PrismaClient} from '@prisma/client'

const prisma=new PrismaClient()

// const newUser=await prisma.user.create({
//     data:{
//         name:'alpa',
//         email:'alpa@gmail.com',
//         password:"alpa123",
//         role:'student',
//         enrollment:{
//             create:{
//                 course:{
//                     create:{
//                         title:"HTML CSS",
//                         content:'Basic course for HTML and CSS',
//                         price:500,
//                         lessons:{
//                             create:[
//                                 {
//                                     title:"Basic structure of html",
//                                     videoUrl:"basic.mp4",
//                                     orderNumber:1
//                                 },
//                                 {
//                                     title:"Tags",
//                                     videoUrl:"tags.mp4",
//                                     orderNumber:2
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             }
//         }
//     }
// })

// const newCourse=await prisma.course.create({
//     data:{
//         title:'JavaScript',
//         content:'JavaScript is a client side scripting language',
//         price:1000,
//     }
// })

// const newLesson=await prisma.lesson.create({
//     data:{
//         title:'Operators',
//         videoUrl:'operators.mp4',
//         orderNumber:1,
//         courseId:1
//     }
// })

// const newEnrollment=await prisma.enrollment.create({
//     data:{
//         userId:1,
//         courseId:1
//     },
//     include:{
//         course:true,
//         user:true
//     }
// })

// const newReview=await prisma.review.create({
//     data:{
//         content:'This course was very interactive',
//         userId:1,
//         courseId:1
//     },
//     include:{
//         course:true,
//         user:true
//     }
// })

const data=await prisma.user.findMany({
    where:{id:4},
    include:{
        enrollment:{
            include:{
                course:{
                    include:{
                        lessons:true
                    }
                }
            }
        }
    }
})


const allUsers=await prisma.user.findMany({})
console.dir(data,{depth:null})