import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/realtime', async (req,res)=>{
  try{
    const r = await fetch('https://api.openai.com/v1/realtime/sessions',{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:'gpt-4o-realtime-preview',
        voice:'alloy'
      })
    });
    const data = await r.json();
    res.json(data);
  }catch(e){
    res.status(500).json({error:'realtime error'});
  }
});

app.use(express.static('frontend'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log('Server running'));
