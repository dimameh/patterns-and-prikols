/*
  Imagine that you need to do something with functions inside your class before running them and after running them.
  As example we can take a class that counts how much functions is running right now. It's pretty simple with decorators
  but decorators are still stage 2 proposal (at the moment of creation this file). It's ok, we can decorate all class functions
  by resetting it after declaration using prototype. The problem here is that you will need to do this manually for each function of class
  and when you will add new function you must not forget to add it too. Big problems will come if 
  someone else would try to add some new function without paying attension on this decorations. It will sabotage whole work of the class!

  How to do it once and forget about it at all without fear of breaking such mechanics?

  PROXY! Here is the way to create class that counts amount of it's currently running functions.
*/

class RunningFunctionsCounter {
  private runningFunctions: number;

  constructor() {
    this.runningFunctions = 0;
    const handler = {
      get: function (obj: any, prop: any) {

        if (typeof obj[prop] !== "function") {                  // if we getting non function property from this class, we just returning it 
          return obj[prop];

        } else {                                                // but when we getting function we need to apply some middleware 
          return async function (...args: any) {
            obj.addRunningFunction(prop);                         // incrementing functions count before running function
            const res = await obj[prop].apply(obj, args);     // running function
            obj.removeRunningFunction(prop);                      // decremnenting functions count
            return res;
          }
        }
      }
    }
    return new Proxy(this, handler);
  }

  // decorator's function
  protected addRunningFunction(functionName: string) {
    this.runningFunctions++;
    console.log(`I'm running ${this.runningFunctions} functions. Running ${functionName}.`);
  }
  
  // decorator's function
  protected removeRunningFunction(functionName: string) {
    this.runningFunctions--;
    console.log(`I'm running ${this.runningFunctions} functions. Stopped ${functionName}.`);
  }

  public async someFunction() {
    return new Promise(resolve => {
      setTimeout(resolve, 3000);
    })
  }
  public someFunction2() {
  }
}

// Demo
const runningFunctionsCounter = new RunningFunctionsCounter();

runningFunctionsCounter.someFunction()
setTimeout(() => runningFunctionsCounter.someFunction(), 500)
runningFunctionsCounter.someFunction()
runningFunctionsCounter.someFunction2()

