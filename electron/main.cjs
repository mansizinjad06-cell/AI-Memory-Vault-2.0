const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");

let backendProcess = null;

// =========================
// CHECK BACKEND
// =========================

function checkBackend() {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(1000);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.once("error", () => {
      resolve(false);
    });

    socket.connect(5000, "127.0.0.1");
  });
}

// =========================
// WAIT FOR BACKEND
// =========================

async function waitForBackend() {
  for (let i = 0; i < 30; i++) {
    const running = await checkBackend();

    if (running) {
      console.log("Backend is ready.");
      return true;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );
  }

  console.log(
    "Backend did not start within the expected time."
  );

  return false;
}

// =========================
// START BACKEND
// =========================

function startBackend() {
  let backendPath;
  let backendFolder;

  if (app.isPackaged) {
    backendFolder = path.join(
      process.resourcesPath,
      "backend"
    );

    backendPath = path.join(
      backendFolder,
      "server.js"
    );
  } else {
    backendFolder = path.join(
      __dirname,
      "../backend"
    );

    backendPath = path.join(
      backendFolder,
      "server.js"
    );
  }

  console.log("Backend path:", backendPath);

  backendProcess = spawn(
    process.execPath,
    [backendPath],
    {
      cwd: backendFolder,

      env: {
        ...process.env,

        // Important:
        // Run Electron's executable as Node.js
        ELECTRON_RUN_AS_NODE: "1",
      },

      stdio: "inherit",
      windowsHide: true,
    }
  );

  backendProcess.on("error", (error) => {
    console.log(
      "Backend start error:",
      error.message
    );
  });

  backendProcess.on("exit", (code) => {
    console.log(
      "Backend stopped with code:",
      code
    );

    backendProcess = null;
  });
}

// =========================
// CREATE WINDOW
// =========================

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,

    minWidth: 1000,
    minHeight: 700,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (!app.isPackaged) {
    win.loadURL(
      "http://localhost:5173"
    );
  } else {
    win.loadFile(
      path.join(
        __dirname,
        "../frontend/dist/index.html"
      )
    );
  }
}

// =========================
// APP START
// =========================

app.whenReady().then(async () => {
  startBackend();

  await waitForBackend();

  createWindow();

  app.on("activate", () => {
    if (
      BrowserWindow.getAllWindows()
        .length === 0
    ) {
      createWindow();
    }
  });
});

// =========================
// APP CLOSE
// =========================

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

// =========================
// SAFETY
// =========================

app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
});