import * as React from 'react';
import {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import funcionCashBank from './Servicio';
import Boton from './Boton';

export default function Dashboard()
{    
  let url = '';
  const tk = localStorage.getItem('token');  
  const [cajas, setCajas] = useState([]);
  
  const funcionBusqueda = function (numSerie, tk) 
  {             
    if(cajas.length>0)
      document.getElementById('formDetalle').reset();
    
    if(numSerie==='')      
      url = 'https://cashbankapi.servicios.vangentmexico.com.mx/view_cajon_diario_simple?order=numero_serie.asc';      
    else if(numSerie.length>=0)
      url = 'https://cashbankapi.servicios.vangentmexico.com.mx/view_cajon_diario_simple?numero_serie=eq.'+numSerie;
        
    const request = 
    {      
      cache:'no-cache',
      referrerPolicy: 'no-referrer',
      method:'GET', 
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk}
    };
        
    funcionCashBank(url, request, (error, datos) =>
    {
      if(error) 
      {
        console.log(error);                
        return;        
      }
      else 
      {                
        if(numSerie==='')  
          comboBox(datos);       
        for(var i=0;i<datos.length;i++)
        {
          datos[i]['id'] = i+1;
          datos[i]['ultima_sincronizacion'] = new Date(datos[i]['ultima_sincronizacion']).toLocaleString();          
          datos[i]['saldo_cofres'] = formatoMexico(datos[i]['saldo_cofres']);       
          datos[i]['saldo_dispensadores'] = formatoMexico(datos[i]['saldo_dispensadores']);          
          datos[i]['saldos_dispensadores'] = formatoMexico(datos[i]['saldos_dispensadores']);                       
        }               
        console.log(datos); 
        setCajas(datos);                                
      }      
    });     
  }

  const funcionSelectCaja = function (caja) 
  {        
    const sensorPlaca = document.getElementById('sensorPlaca');
    const vsensorPlaca = JSON.stringify(caja['sensor_placa']);
    const sensorSismico = document.getElementById('sensorSismico');
    const vsensorSismico = JSON.stringify(caja['sensor_sismico']);
    const sensorPuerta = document.getElementById('sensorPuerta');
    const vsensorPuerta = JSON.stringify(caja['sensor_puerta']);
    const sensorCofre = document.getElementById('sensorCofre');
    const vsensorCofre = JSON.stringify(caja['sensor_cofre']);
    const sensorTemperatura = document.getElementById('sensorTemperatura');
    const vsensorTemperatura = JSON.stringify(caja['sensor_temperatura']);
    const sensorPuertaValor = document.getElementById('sensorPuertaValor');
    const sensorCofreValor = document.getElementById('sensorCofreValor');
    const sensorTemperaturaValor = document.getElementById('sensorTemperaturaValor');
    const cajonGeoLoc = document.getElementById('cajonGeoLoc');
    const pais = document.getElementById('pais');
    const cajonRegion = document.getElementById('cajonRegion');
    const cajonIPPub = document.getElementById('cajonIPPub');
    const cajonPostal = document.getElementById('cajonPostal');   
    const jsonDetalleCoins = document.getElementById('jsonDetalleCoins');
    const jsonDetalleNotes = document.getElementById('jsonDetalleNotes');
    
    sensorPuertaValor.value = JSON.stringify(caja['sensor_puerta_valor']).replace("\"","").replace("\"","");
    sensorCofreValor.value = JSON.stringify(caja['sensor_cofre_valor']).replace("\"","").replace("\"","");
    sensorTemperaturaValor.value = JSON.stringify(caja['sensor_temperatura_valor']).replace("\"","").replace("\"","");
    cajonGeoLoc.value = JSON.stringify(caja['cajon_geo_loc']).replace("\"","").replace("\"","");
    pais.value = JSON.stringify(caja['pais']).replace("\"","").replace("\"","");
    cajonRegion.value = JSON.stringify(caja['cajon_region']).replace("\"","").replace("\"","");
    cajonIPPub.value = JSON.stringify(caja['cajon_ip_pub']).replace("\"","").replace("\"","");
    cajonPostal.value = JSON.stringify(caja['cajon_postal']).replace("\"","").replace("\"","");
    jsonDetalleCoins.value = JSON.stringify(caja['json_detalle_coins']).replace("\"","").replace("\"","");
    jsonDetalleNotes.value = JSON.stringify(caja['json_detalle_notes']).replace("\"","").replace("\"","");
    
    if(vsensorPlaca==='true')
      sensorPlaca.checked = true;
    else
      sensorPlaca.checked = false;
          
    if(vsensorSismico==='true')
      sensorSismico.checked = true;
    else
      sensorSismico.checked = false;

    if(vsensorPuerta==='true')
      sensorPuerta.checked = true;
    else
      sensorPuerta.checked = false;
    
    if(vsensorCofre==='true')
      sensorCofre.checked = true;
    else
      sensorCofre.checked = false;

    if(vsensorTemperatura==='true')
      sensorTemperatura.checked = true;
    else
      sensorTemperatura.checked = false; 
  }

  const columns = 
  [     
    {field:'numero_serie', headerName:'CAJA', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},        
    {field:'nombre', headerName:'NOMBRE', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'empresa', headerName:'EMPRESA', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},        
    {field:'estatus', headerName:'ESTATUS', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'ultima_sincronizacion', headerName:'SINCRONIZACIÓN', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},            
    {field:'saldo_dispensadores', headerName:'DISPENSADORES', align:'right', headerAlign:'right', headerClassName:'super-app-theme--header', flex:1},
    {field:'saldo_cofres', headerName:'COFRES', align:'right', headerAlign:'right', headerClassName:'super-app-theme--header', flex:1},
    {field:'saldos_dispensadores', headerName:'SALDO-TOTAL', align:'right', headerAlign:'right', headerClassName:'super-app-theme--header', flex:1}        
  ];

  function comboBox(cajas)
  {
    var comboValues = cajas;    
    var selectList = document.getElementById('idNumSerie');
    var options = document.querySelectorAll('#idNumSerie option');
    options.forEach(o => o.remove());
    
    comboValues.forEach(comboValues => 
    {
      var option = document.createElement('option');
      option.setAttribute('value',JSON.stringify(comboValues['numero_serie']).replace("\"","").replace("\"",""));
      option.text = JSON.stringify(comboValues['numero_serie']).replace("\"","").replace("\"","");        
      selectList.appendChild(option);
    });   
  }

  const formatoMexico = (number) => 
  {
    var num = number/100;
    number = num;
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    return number.toString().replace(exp,rep);
  }

  function DataGridTitle() 
  {
    return(
      <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", color:'darkblue'}}>
        <h3>DASHBOARD</h3>
      </Box>
    )
  }

  useEffect(() => 
  { 
    if(cajas.length===0)
      funcionBusqueda('',tk);          
  });

  return(
    <div id='divDashboard'>                                         
      <div id='divBusqueda'>
        <form id='formBusqueda'>                         
          <Box sx={{height:50, display:'flex', alignItems:'baseline', '& > :not(style)':{ m:1 }}}>
          <label id='titleCaja'>&ensp;Caja:</label>                    
            <select id='idNumSerie' onChange={() => 
            {
              var select = document.getElementById('idNumSerie');
              var selectedOption = select.options[select.selectedIndex];                      
              const dato = selectedOption.value.replace("\"","").replace("\"","");                                     
              funcionBusqueda(dato,tk);                      
            }}>
            </select>
            <Boton id='botonForm' onClick = { () => {
              const form = document.getElementById('formBusqueda');
              form.onsubmit = (e) => {
                e.preventDefault();
                funcionBusqueda('',tk);}}}>Buscar
            </Boton>                                                                                                                         
          </Box>                       
        </form>
      </div>          
      <div id='divDataGrid'>      
        <Box sx={{'& .super-app-theme--header':{fontSize:'small', backgroundColor:'steelblue', color:'white'}}}>  
          <DataGrid id='idDataGrid' rows={cajas} columns={columns} getRowId={(row) => row.id }
            slots={{toolbar: DataGridTitle}}          
            rowHeight={40} 
            columnHeaderHeight={30}
            initialState={{pagination:{paginationModel:{pageSize:5}}}}
            pageSizeOptions={[5]}                    
            onRowClick={(e) => {funcionSelectCaja(e.row)}}
          />                     
        </Box>                  
        <form id='formDetalle'>
          &ensp;<label htmlFor='sensorPlaca'>Sensor-Placa</label>&ensp;
          <input id='sensorPlaca' type='checkbox' onClick={(e)=>{e.preventDefault()}}/>&emsp;&emsp;         
          <label htmlFor='sensorSismico'>Sensor-Sismico</label>&ensp;
          <input id='sensorSismico' type='checkbox' onClick={(e)=>{e.preventDefault()}}/>&emsp;&emsp;          
          <label htmlFor='sensorPuerta'>Sensor-Puerta</label>&ensp;
          <input id='sensorPuerta' type='checkbox' onClick={(e)=>{e.preventDefault()}}/>&emsp;&emsp;           
          <label htmlFor='sensorCofre'>Sensor-Cofre</label>&ensp;
          <input id='sensorCofre' type='checkbox' onClick={(e)=>{e.preventDefault()}}/>&emsp;&emsp;        
          <label htmlFor='sensorTemperatura'>Sensor-Temperatura</label>&ensp;
          <input id='sensorTemperatura' type='checkbox' onClick={(e)=>{e.preventDefault()}}/><br/>            
          <Box sx={{display:'flex', alignItems:'center','& > :not(style)':{ m:1 }}}>                                                                           
            <TextField id='sensorPuertaValor' label='PUERTA' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='sensorCofreValor' label='COFRE' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='sensorTemperaturaValor' label='TEMPERATURA' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;                    
            <TextField id='cajonGeoLoc' label='GEO-LOCALIZACIÓN' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='pais' label='PAÍS' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='cajonRegion' label='REGIÓN' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='cajonIPPub' label='IP-PÚBLICA' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
            <TextField id='cajonPostal' label='C. POSTAL' variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>&ensp;
          </Box>
          <Box sx={{display:'flex', alignItems:'center', '& > :not(style)':{ m:1 }}}>
            <TextField fullWidth id='jsonDetalleCoins' label='DETALLE-MONEDAS' variant='filled' InputLabelProps={{ shrink: true}} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>
          </Box>                                                             
          <Box sx={{display:'flex', alignItems:'center', '& > :not(style)':{ m:1 }}}>
            <TextField fullWidth id='jsonDetalleNotes' label='DETALLE-BILLETES'variant='filled' InputLabelProps={{ shrink: true }} inputProps={{style: {fontSize: 11}}} onKeyDown={(e)=>{e.preventDefault()}}/>                   
          </Box>                                                                                       
        </form>          
      </div>                            
    </div> 
  );  
}