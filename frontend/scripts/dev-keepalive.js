const { spawn } = require("child_process");

function start() {
  console.log("🚀 Starting React dev server with keep-alive wrapper...");
  
  const p = spawn("npm", ["run", "start:raw"], {
    stdio: "inherit",
    shell: true,
  });

  p.on("exit", (code) => {
    console.log(`\n🛑 React dev server exited with code ${code}`);

    // If CRA crashes immediately (common when configs break or disk is full)
    if (code === 1 || code === null) {
      console.log("⚠️ React dev server crashed. Keeping process alive...");
      console.log("💡 Check the error above. Press Ctrl+C to stop this wrapper.\n");
      
      // Don't restart automatically - just keep terminal open so you can see the error
      console.log("Terminal will remain open. You can manually restart by running 'npm start' again.");
      
      // Keep process alive
      setInterval(() => {}, 1000);
    }
  });

  p.on("error", (err) => {
    console.error("❌ Failed to start React dev server:", err);
    console.log("Terminal will remain open. Press Ctrl+C to exit.");
    
    // Keep process alive
    setInterval(() => {}, 1000);
  });
}

start();
