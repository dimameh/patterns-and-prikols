/*
  Imagine that your class works with async functions. This class also interacts with other objects and their async functions.
  So as result you have this 
  func { 
    func
    func {
      func {
        func
        func
      }
      func {
        func
      }
    }
    func {
      func
    }
  }
  big tree of async functions that awaiting for each other results. How to fast and safe stop them all at one moment and
  not get ruined any processes? Here is one cool solution that allows to run async functions with stopper. In some cases it can be used with ProxyDecorators
  to be fully independent from developer, but sometimes there are situations when for safety awaiting function needs to return something anyway just to not crash anything.
  It can be fixed with conditions but it makes it depend from developer. Wrapping async functions to awaitWithStop wrapper is also such dependency but its
  much more faster and easier to wrap function than create a condition for it.

  Basically this awaitWithStop wrapper will make an accordion-like finishing of all functions that are in example below when stop flag will be turned on.
*/


export abstract class RpaAsyncEntity {
  protected isStopped: boolean  // stopper flag

  constructor() {
    this.isStopped = true       // it must be true while it's not running anything
  }

  /**
   * Provides interface for handling async functions with possibility of stopping.
   * All awaits must be wrapped with this function
   * @param func async functions that needs stopper
   * @param returnOnStop function will immediately return this value if stopper turned on
   * @returns result of async function or returnOnStop value if presented
   */
  protected awaitWithStop = (func: Function, returnOnStop?: any) => {
    if (this.isStopped) {                         // if everything is stopped when async function just started,
      return () => returnOnStop
    }
    let isFinished = false                        // flag of finishing awaiting function to stop checking interval
  
    const stopWaiter = new Promise(resolve => {   // promise that awaits finish of async function or stopper signal
      const intervalId = setInterval(() => {
        if (this.isStopped) {                     // if stopper turned on, resolving returnOnStop value
          clearInterval(intervalId)
          resolve(returnOnStop)
        }
        if (isFinished) {                         // if async function finished before stopper, just cleaning interval
          clearInterval(intervalId)
        }
      }, 100)
    })
  
    return async (...functionArgs: any[]) => {
      const functionPromise = new Promise(async (resolve) => {  // Promise that will turn on isFinished flag for stopWaiter when async function will be finished 
        resolve(await func(...functionArgs))
        isFinished = true
      });
      try {
        return Promise.race([stopWaiter, functionPromise])      // race that awaits result of async function from functionPromise or returnOnStop value from stopWaiter
      } catch (err) {
        return returnOnStop
      }
    }
  }
}