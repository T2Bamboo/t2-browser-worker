import fs from "fs";
import path from "path";
import os from "os";



export function rootDirectory() {
  let currentDir = path.resolve(__dirname);
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (currentDir === parentDir) break;
    currentDir = parentDir;
  }
  return currentDir;
}



export function checkService() {
  const cpuInfo = os.cpus();
  const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

  console.log("CPU Model:", cpuInfo[0].model);
  console.log("CPU Cores:", cpuInfo.length);
  console.log("Total Memory:", totalMemoryGB, "GB");
  console.log("Free Memory:", freeMemoryGB, "GB");

  const minCpuCores = 2;  // Tối thiểu 2 lõi CPU
  const minMemoryGB = 2;  // Tối thiểu 2GB bộ nhớ

  if (cpuInfo.length < minCpuCores) {
      console.log("Warning: Not enough CPU cores. Minimum required is 2.");
  } else {
      console.log("CPU cores are sufficient.");
  }

  if (parseFloat(freeMemoryGB) < minMemoryGB) {
      console.log("Warning: Not enough free memory. Minimum required is 2GB.");
  } else {
      console.log("Free memory is sufficient.");
  }
}





