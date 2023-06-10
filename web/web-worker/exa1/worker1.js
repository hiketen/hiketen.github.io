onmessage = function(e){
   if ( e.data === "start" ) {
      // Do some computation that can last a few seconds...
      // alert the creator of the thread that the job is finished
      done();
    }
};
function done(){
    // Send back the results to the parent page
    postMessage("done");
}
