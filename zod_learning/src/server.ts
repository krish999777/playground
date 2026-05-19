import * as z from 'zod'
const roleEnum=z.enum(['junior','mid','senior'])
const signupSchema=z.object({
    name:z.string(),
    email:z.email(),
    password:z.string().min(6)
})
const loginSchema=z.object({
    email:z.email(),
    password:z.string()
})
const experienceSchema=z.object({
    company:z.string(),
    role:roleEnum,
    years:z.number().min(1)
})
const educationSchema=z.object({
    school:z.string(),
    degree:z.string(),
    years:z.number().min(1)
})
const resumeSchema=z.object({
    title:z.string(),
    summary:z.string(),
    experience:z.array(experienceSchema),
    education:z.array(educationSchema),
    skills:z.array(z.string()),
    linkedinUrl:z.url().optional(),
    portfolioUrl:z.url().optional()
})
type ResumeType=z.infer<typeof resumeSchema>


const testResume:ResumeType={
    title:'Krish',
    summary:'MERN stack developer, full stack',
    experience:[
        {
            company:'DeepCytes',
            role:'junior',
            years:1
        },
        {
            company:"Napptix",
            role:'mid',
            years:2
        }
    ],
    education:[
        {
            school:'Childrens Academy',
            degree:'ICSE',
            years:10
        },
        {
            school:'Shri Bhagubhai Mafatlal Polytechnic',
            degree:'IT',
            years:2
        }
    ],
    skills:['MERN stack','Full stack development','Python','C','C++'],
    linkedinUrl:'https://linkedin.com'
}
type SignupType=z.infer<typeof signupSchema>

const testSignup:SignupType={
    name:'krish',
    email:'krish@gmail.com',
    password:'aqefqioefjqeioj'
}
// const result=signupSchema.safeParse(testSignup)
const result=resumeSchema.safeParse(testResume)
console.log(result.success)