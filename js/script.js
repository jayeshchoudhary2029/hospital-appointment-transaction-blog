const doctors=["Dr. Sharma","Dr. Mehta","Dr. Khan"];
const times=["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM"];
let state="AVAILABLE";

function fill(){
  ["d1","d2"].forEach(id=>{const s=document.getElementById(id);doctors.forEach(d=>{let o=document.createElement("option");o.textContent=d;o.value=d;s.appendChild(o)})});
  ["t1","t2"].forEach(id=>{const s=document.getElementById(id);times.forEach(t=>{let o=document.createElement("option");o.textContent=t;o.value=t;s.appendChild(o)})});
  document.getElementById("d1").value=document.getElementById("d2").value="Dr. Sharma";
  document.getElementById("t1").value=document.getElementById("t2").value="10:00 AM";
}
function getData(){return {p1:document.getElementById("p1").value||"Patient A",p2:document.getElementById("p2").value||"Patient B",d1:document.getElementById("d1").value,t1:document.getElementById("t1").value,d2:document.getElementById("d2").value,t2:document.getElementById("t2").value}}
function same(s){return s.d1===s.d2&&s.t1===s.t2}
function write(lines,kind=""){const el=document.getElementById("log");el.innerHTML="";lines.forEach(x=>{const p=document.createElement("div");p.textContent=x;p.style.color=kind==="bad"?"#ff9e97":kind==="good"?"#a9e6b0":"#b8e2bd";el.appendChild(p)})}
function updateSlot(text,color){const e=document.getElementById("slotState");e.textContent=text;e.style.color=color||"#198244"}
function runUnsafe(){
 const s=getData();
 if(!same(s)){write(["T1: BEGIN","T1: books "+s.t1,"T1: COMMIT","T2: BEGIN","T2: books "+s.t2,"T2: COMMIT","No conflict because the slots are different."],"good");return}
 state="DOUBLE BOOKING ANOMALY";
 write(["T1: BEGIN TRANSACTION","T1: READ("+s.t1+") → AVAILABLE","T2: BEGIN TRANSACTION","T2: READ("+s.t2+") → AVAILABLE","Both transactions saw AVAILABLE.","T1: WRITE(slot = "+s.p1+")","T2: WRITE(slot = "+s.p2+")","T1: COMMIT","T2: COMMIT","⚠ Both patients believed the same slot was booked."],"bad");
 updateSlot("CONFLICT / DOUBLE BOOKING","#b7352b");
}
function runSafe(){
 const s=getData();
 if(!same(s)){write(["T1: BEGIN → LOCK → WRITE → COMMIT","T2: BEGIN → LOCK different slot → WRITE → COMMIT","Safe: different records are accessed."],"good");updateSlot("2 SLOTS BOOKED","#198244");return}
 write(["T1: BEGIN TRANSACTION","T1: X-LOCK("+s.t1+")","T1: READ → AVAILABLE","T1: WRITE(slot = "+s.p1+")","T1: COMMIT → RELEASE LOCK","T2: BEGIN TRANSACTION","T2: tries X-LOCK → waits for T1","T2: READ → BOOKED","T2: ROLLBACK / REJECT","✓ Double booking prevented. Safe order: T1 → T2"],"good");
 updateSlot("BOOKED BY "+s.p1,"#198244");
}
function resetDemo(){write(["Choose a simulation above…"]);updateSlot("AVAILABLE","#198244")}
fill();
