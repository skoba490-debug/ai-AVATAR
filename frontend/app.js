const chat = document.getElementById('chat');

function addMsg(t){
  const d=document.createElement('div');
  d.className='msg';
  d.innerText=t;
  chat.appendChild(d);
}

async function startVoice(){
  const tokenRes = await fetch('/api/realtime',{method:'POST'});
  const session = await tokenRes.json();

  const pc = new RTCPeerConnection();
  const audio = document.createElement('audio');
  audio.autoplay = true;

  pc.ontrack = e=> audio.srcObject = e.streams[0];

  const stream = await navigator.mediaDevices.getUserMedia({audio:true});
  stream.getTracks().forEach(t=>pc.addTrack(t,stream));

  const dc = pc.createDataChannel('oai');

  dc.onmessage = e=>{
    const data = JSON.parse(e.data);
    if(data.type==='response.output_text.delta'){
      addMsg(data.delta);
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const res = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`,{
    method:'POST',
    body:offer.sdp,
    headers:{
      'Authorization':`Bearer ${session.client_secret.value}`,
      'Content-Type':'application/sdp'
    }
  });

  const answer = { type:'answer', sdp: await res.text() };
  await pc.setRemoteDescription(answer);
}
