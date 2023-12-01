import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as React from 'react';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import funcionCashBank from './Servicio';
import image1 from './Images/logo.png';
import image2 from './Images/logo.jpg';
import Dashboard from './Dashboard';
import Catalogo from './Catalogo';
import Serie from './Serie';
import Boton from './Boton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './main.css';

function samePageLinkNavigation(event) 
{
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)   
    {return false;}  
  return true;
}

function App() 
{  
  const [value, setValue] = useState(0);
  const [token, setToken] = useState('');
  const [usuario, setUsuario] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  
  const handleChange = (event, newValue) => 
  {  
    if (event.type !== 'click' || (event.type === 'click' && samePageLinkNavigation(event))) 
      {setValue(newValue)}    
  }

  const url = 'https://cashbankapi.servicios.vangentmexico.com.mx/rpc/login';
  
  const handleSubmit = (event) => 
  {    
    event.preventDefault();    
    var {usuarioLogin, passwordLogin} = document.forms[0];
    const userData = {user:usuarioLogin.value, pass:passwordLogin.value};
    setUsuario(userData);   
      
    const request = 
    {      
      cache:'no-cache',
      referrerPolicy: 'no-referrer',
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({email:userData.user, pass:userData.pass}),                
    };
    
    funcionCashBank(url, request, (error, datos) =>
    {
      if(error) 
      {
        console.log(error); 
        setErrorMessages(error);        
        return;        
      }
      else 
      {
        console.log(datos);
        setToken(datos.token);        
        if(datos.token===null||datos.token==='')
          setErrorMessages(datos);
        else
          setErrorMessages('');                
      }      
    });        
  };

  function renderForm()
  {
    return(    
      <div className='app'>            
        <img src={image1} alt='logo' width={500} height={100}></img>
        <div className='form'>             
          <div className='title'>Login</div>
          <form>
            <div className='input-container'>
              <TextField id='usuarioLogin' label='Username' size='small' variant='outlined' type='TextField' required/>       
            </div>
            <div className='input-container'>
              <TextField id='passwordLogin' label='Password' size='small' variant='outlined' type='password' required/>
            </div>
            <div className='button-container'>
              <Boton id='botonLogin' onClick={handleSubmit}>Enviar</Boton>
            </div><br/>
            <div className='error' align='center'>{errorMessages.message}</div>              
          </form>
        </div>
      </div>    
    );
  }

  localStorage.setItem('token',token);
  localStorage.setItem('usuario',usuario.user);

  return(                               
    <div>    
    { token?      
      <>        
        <div id='imagenLogo'><img src={image2} alt='logo' width={230} height={40}/></div>        
        <h6 id='titleUsuario'>
          &emsp;Usuario: <span id='valueUsuario'>{usuario.user}</span> 
          <Boton id='botonForm' style={{'float': 'right'}} onClick={() => {setToken('')}}>Cerrar sesión</Boton>
        </h6>                                                                                             
        <Router>          
          <div>              
            <Box sx={{ bgcolor:'darkblue', width: '100%', color: 'white'}}>              
              <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { background: 'rgb(230, 60, 0)' } }} textColor="inherit" aria-label="full width tabs example">                
                <Tab component={Link} label="Dashboard" to='/dashboard'/>
                <Tab component={Link} label="Estatus" to='/catalogo'/>
                <Tab component={Link} label="Serie" to='/serie'/>                                      
              </Tabs>                
            </Box>
            <Routes>              
            <Route index element={<Dashboard/>}/>
              <Route exact path='dashboard' element={<Dashboard/>}/>
              <Route path='catalogo' element={<Catalogo/>}/>                              
              <Route path='serie' element={<Serie/>}/>                                            
            </Routes>
          </div>
        </Router>
      </>
      :renderForm()
    }    
    </div>
  );
}
export default App;