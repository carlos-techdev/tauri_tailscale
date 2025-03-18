import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [status, setStatus] = useState("VPN Disconnected");
  // const [time, setTime] = useState("0");
  const [time, setTime] = useState<Date | null>(null);
  const [username, setUsername] = useState("dmytrosokolovskyi80@gmail.com");
  const [password, setPassword] = useState("dmytro");
  const [isConnecting, setIsConnecting] = useState(false);
  const [timeClickCount, setTimeClickCount] = useState(0);

  const getCurrentTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}.${month}.${day}. ${hours}:${minutes}:${seconds}`;
  };

  const connect = async () => {
    if (!username) return alert("Username is required");
    if (!password) return alert("Password is required");
    setIsConnecting(true);
    setTimeClickCount(0);
    try {
      const response = await invoke("connect_vpn", {
        username,
        password,
      });
      setStatus(response as string);
      setTime(new Date());
      setTimeClickCount(timeClickCount + 1);
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      const response = await invoke("disconnect_vpn");
      setStatus(response as string);
      setTime(null);
      setTimeClickCount(0);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="container">
      <h1>TailScale Manager</h1>
      <p>Status: {status}</p>
      <p>Connection Time: {time && getCurrentTime(time)}</p>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button
          onClick={connect}
          disabled={
            isConnecting || status === "Connected to Tailscale successfully"
          }
          className={
            status === "Connected to Tailscale successfully" ? "disabled" : ""
          }
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
        <button
          onClick={disconnect}
          disabled={status !== "Connected to Tailscale successfully"}
          className={
            status !== "Connected to Tailscale successfully" ? "disabled" : ""
          }
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default App;
