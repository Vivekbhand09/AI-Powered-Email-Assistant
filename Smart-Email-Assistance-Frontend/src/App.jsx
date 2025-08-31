
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import './App.css'
import { useState } from 'react'
import axios from 'axios';

function App() {
  const [emailContent,setEmailContent]=useState('');
    const [tone,setTone]=useState('');
    const [loading,setLoading]=useState(false);
    const [generatedReply,setGeneratedReply]=useState('');

const handleSubmit=async()=>{
    setLoading(true);
    try {
      const response=await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
    })
      setGeneratedReply(typeof response.data==='string' ?
        response.data:JSON.stringify(response.data)
       )
    } catch (error) {
      
    }finally{
      setLoading(false);
    }
};

  return (
    
   <Container maxWidth="md" sx={{py:4}}>
    <Typography variant='h3' component="h1" 
    sx={{ mb: 3, fontSize: { xs: '1.8rem', md: '2.5rem' }, textAlign: 'center' }}>
       Email Reply Generator
    </Typography>

    <Box sx={{mx:3}}>
    <TextField
     fullWidth
     multiline
     rows={6}
     variant='outlined'
     label='Original Email Content'
     value={emailContent || ''}
     onChange={(e)=>setEmailContent(e.target.value)}
     sx={{mb:3}}
            />

      <FormControl fullWidth  sx={{mb:2}}>
  <InputLabel >Tone (Optional)</InputLabel>
  <Select
    
    value={tone || ''}
    label="Tone (Optional)"
    onChange={(e)=>setTone(e.target.value)}
  >
    <MenuItem value="None">None</MenuItem>
    <MenuItem value="Professional">Professional</MenuItem>
    <MenuItem value="Friendly">Friendly</MenuItem>
    <MenuItem value="Casual">Casual</MenuItem>
  </Select>
</FormControl>  

<Button variant="contained" 
onClick={handleSubmit}
 sx={{ width: { xs: '100%', md: 'auto' }, mb: 2 }}
disabled={!emailContent || loading}>
  {loading ? <CircularProgress size={24}/> : "GENERATE REPLY" }
</Button>

    </Box>
    
    <Box sx={{mx:1}}>
    <TextField
     fullWidth
     multiline
     rows={6}
     variant='outlined'
     value={generatedReply || ''}
     inputProps={{readOnly:true}}
     sx={{mb:2}}
            />
            <Button variant='outlined'
            onClick={()=>navigator.clipboard.writeText(generatedReply)}>
            COPY TO CLIPBOARD

            </Button>
            </Box>

   </Container>
  )
}

export default App
