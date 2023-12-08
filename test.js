// async function demo(){
//     let response=await fetch("https://api.chucknorris.io/jokes/random");
//     let result=await response.json()
//     console.log(result)
// }


// get a str and remove all the vowels 
// eg apple: ppl

let a="apple";
 function removeVowl(aString){
    let anArray=aString.split("");
    let result=[]
    for(let i=0;i<anArray.length;i++){
        if(/[aeiouAEIOU]/g.test(anArray[i])){

        }
        else{
            result.push(anArray[i])
        }
    }
    return result.join("");
 }
 console.log(removeVowl(a))