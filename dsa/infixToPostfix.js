function infixToPostfix(exp){
    const operators=['^','*','/','+','-']
    const opVal=[1,2,2,3,3]
    let stack=[]
    let postfix=""

    for(let i=0;i<exp.length;i++){
        const item=exp[i]
        if(item==='('||item==='^'||item==='*'||item==='/'||item==='+'||item==='-'||item===')'){
            if(stack.length===0){
                stack.push(item)
                continue
            }
            if(item===')'){
                while(stack.length>0){
                    const item=stack.pop()
                    if(item==='('){
                        break
                    }
                    postfix+=item
                }
                continue
            }
            if(item==='('){
                stack.push(item)
                continue
            }
            const op1=stack[stack.length-1]
            let op1Priority
            let itemPriority
            for(let j=0;j<operators.length;j++){
                if(operators[j]===op1){
                    op1Priority=opVal[j]
                }
                if(operators[j]===item){
                    itemPriority=opVal[j]
                }
            }
            if(op1Priority<=itemPriority&&!(op1Priority===1&&itemPriority===1)){
                stack.pop()
                postfix+=op1
                stack.push(item)
            }else{
                stack.push(item)
            }
        }else{
            postfix+=item
        }
    }
    if(stack.length>0){
        while(stack.length>0){
            postfix+=stack.pop()
        }
    }
    return postfix
}

const exp="A-B*C+D"
const postfix=infixToPostfix(exp)
console.log(postfix)
function evalutatePostfix(exp){

}