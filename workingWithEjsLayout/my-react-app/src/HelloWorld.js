import React from 'react';
import Message from './Message';
function HelloWorld() {
    const x = 50;

    const myElement = <h1>{(x) < 10 ? "Hello" : "Goodbye"}</h1>;
    const name = 'Ibrahim'
    if (name) {
        return <>
        <h1>{name}</h1>
        <div>{myElement}</div>
        </>
     }
  
 
  
  else{
    <h1>No name</h1>
  }
 
 
}

export default HelloWorld;
