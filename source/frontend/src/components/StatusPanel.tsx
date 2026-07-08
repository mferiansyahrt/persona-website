import { useEffect, useState } from "react";

export default function StatusPanel() {
  const [clock, setClock] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="metrics">
      <div className="m-head">
        <div className="t"><span className="live" />feri.status</div>
        <div className="clock">{clock}</div>
      </div>
      <div className="m-body">
        <div className="idcard">
          <div className="idrow"><span className="idk">name</span><span className="idv">M. Feriansyah Raihan Taufiq</span></div>
          <div className="idrow"><span className="idk">role</span><span className="idv">AI/ML Engineer <span className="dimv">· multi-agent</span></span></div>
          <div className="idrow"><span className="idk">base</span><span className="idv">Tangerang Selatan, ID</span></div>
          <div className="idrow"><span className="idk">edu</span><span className="idv">M.Sc CS (AI) + B.Sc Physics <span className="dimv">· UI</span></span></div>
        </div>
        <div className="svc-label">domains · services</div>
        <div className="svc"><span className="name"><span className="d" />multi_agent_systems</span><span className="st">online</span></div>
        <div className="svc"><span className="name"><span className="d" />rag_pipelines</span><span className="st">online</span></div>
        <div className="svc"><span className="name"><span className="d" />mcp_tooling</span><span className="st">online</span></div>
        <div className="svc"><span className="name"><span className="d" />computer_vision</span><span className="st">online</span></div>
        <div className="svc"><span className="name"><span className="d warn" />instrumentation</span><span className="st warn">legacy · stable</span></div>
        <div className="avail">
          <div className="avail-row"><span className="ak">open_to_work</span><span className="av yes"><span className="dd" />accepting</span></div>
          <div className="avail-row"><span className="ak">focus</span><span className="av">production-grade AI</span></div>
          <div className="avail-row"><span className="ak">principle</span><span className="av lime">deterministic · degraded-safe</span></div>
        </div>
      </div>
      <div className="m-foot"><span>career uptime <span className="k">4y+</span></span><span>$ cat feri.json</span></div>
    </div>
  );
}
