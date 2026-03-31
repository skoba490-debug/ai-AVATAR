function setMode(m){
  addMsg("Режим: " + m);
}

function send(){
  const input = document.getElementById('input');
  const text = input.value;
  if(!text) return;
  input.value='';
  addMsg("🧑 " + text);
}
