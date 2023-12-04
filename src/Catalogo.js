import * as React from 'react';
import {useState, useEffect} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import funcionCashBank from './Servicio';
import { funcionCashBank_2 } from './Servicio';
import Boton from './Boton';
import clsx from 'clsx';
import './App.css'
import MapSection from './Mapa';

const style = 
{
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Catalogo() 
{      
  let url = '';
   
  const [caja, setCaja] = useState([]);   
  const [open, setOpen] = useState(false);
  const [catalogo, setCatalogo] = useState([]);
  const tk = localStorage.getItem('token'); 
  const [location] = useState([]);
    
  const handleOpen = (e) => {
    setCaja(e); setOpen(true);
    var geoLocal = e[cajon_geo_loc];
    var arregloGeoLocal = geoLocal.split(',');
    const location = {lat:arregloGeoLocal[0], lng:arregloGeoLocal[1], address:''}
    localStorage.setItem(location);
  };
  const handleClose = (caja) => {    
    funcionBusqueda(caja['nombre_cashbank'],tk);
    setCaja([]);
    setOpen(false);    
  };

  function formatoFecha(fecha, formato) 
  {
    const mapeo = 
    {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yyyy: fecha.getFullYear()
    }  
    return formato.replace(/dd|mm|yyyy/gi, matched => mapeo[matched]);
  }

  const funcionBusqueda = function (nomCaja, tk) 
  {                              
    if(nomCaja==='')      
      url = 'https://cashbankapi.servicios.vangentmexico.com.mx/view_cajones_catalogo?order=nombre.asc';
    else
      url = 'https://cashbankapi.servicios.vangentmexico.com.mx/view_cajones_catalogo?nombre=eq.'+nomCaja;
                
    const request = 
    {      
      cache:'no-cache',
      referrerPolicy: 'no-referrer',
      method:'GET', 
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk}
    };
        
    funcionCashBank (url, request, (error, datos) =>
    {
      if(error) 
      {
        console.log(error);                 
        return;        
      }
      else 
      {
        console.log(datos);
        setCatalogo(datos);
        if(nomCaja==='')
          comboBox(datos);             
      }      
    });
         
  }

  const funcionActualizar = function (caja, estatus, motivo, urlGeo) 
  {    
    var id = caja['id'];
    var hoy = new Date();
    var fecha = formatoFecha(hoy,"yyyy-mm-dd");    
    var estado = estatus;
    var razon = motivo;
                      
    url = 'https://cashbankapi.servicios.vangentmexico.com.mx/cajones_catalogo?id=eq.'+id;
                
    const request = 
    {      
      cache:'no-cache',
      referrerPolicy: 'no-referrer',
      method:'PUT', 
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+tk}, 
      body:JSON.stringify({id:id, estatus:estado, date_upd:fecha, motivo_estatus:razon, url_geo_loc:urlGeo})
    };
    
    funcionCashBank_2 (url, request, (error, datos) =>
    {
      if(error) 
      {
        console.log(error);                 
        return;        
      }
      else 
      {
        console.log(datos);
        return;                                   
      }      
    });      
  }

  const columns = 
  [     
    {field:'estado', headerName:'ESTATUS', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1,      
      cellClassName: (params) => 
      {
        if (params.value == null) {return '';}
  
        return clsx('super-app', 
        {
          activo: params.value==='ACT',
          suspendido: params.value==='SUS',
          cancelado:  params.value==='CAN',
          baja: params.value==='BJA',
          nuevo: params.value==='NVO',
        });
      },
    },
    {field:'nombre', headerName:'CAJA', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},                
    {field:'fecha_alta', headerName:'ALTA', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'fecha_actualizacion', headerName:'SINCRONIZACIÓN', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'cajon_geo_loc', headerName:'GEO-LOCALIZACIÓN', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'cajon_country', headerName:'COUNTRY', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'cajon_region', headerName:'REGIÓN', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'cajon_ip_pub', headerName:'IP-PÚBLICA', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1},
    {field:'cajon_postal', headerName:'C. POSTAL', align:'left', headerAlign:'left', headerClassName:'super-app-theme--header', flex:1}
  ];

  function comboBox(catalogo)
  {
    var comboValues = catalogo;    
    var selectList = document.getElementById('idNomCaja');
    var options = document.querySelectorAll('#idNomCaja option');
    options.forEach(o => o.remove());
    
    comboValues.forEach(comboValues => {
      var option = document.createElement('option');
      option.setAttribute('value',JSON.stringify(comboValues['nombre']).replace("\"","").replace("\"",""));
      option.text = JSON.stringify(comboValues['nombre']).replace("\"","").replace("\"","");        
      selectList.appendChild(option);
    });   
  }

  function DataGridTitle() 
  {
    return(
      <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", color:'darkblue'}}>
        <h3>ESTATUS</h3>
      </Box>
    )
  }

  useEffect(() => 
  { 
    if(catalogo.length===0)
      funcionBusqueda('',tk);
  });
 
  return(                                           
    <div id='divCatalogo' className='App'>                          
      <div id='divBusqueda'>        
        <form id='formBusqueda'>                   
          <Box sx={{height:50, display:'flex', alignItems:'baseline', '& > :not(style)':{ m:1 }}}>                                                                                                          
          <label id='titleCaja'>&ensp;Caja:</label> 
            <select id='idNomCaja' onChange={(e) => 
            {
              e.preventDefault();
              var select = document.getElementById('idNomCaja');
              var selectedOption = select.options[select.selectedIndex];                      
              const dato = selectedOption.value.replace("\"","").replace("\"","");                                     
              funcionBusqueda(dato,tk);                      
            }}>              
            </select>
            <Boton id='botonForm' onClick = {() => {
              const form = document.getElementById('formBusqueda');
              form.onsubmit = (e) => {
                e.preventDefault();                    
                funcionBusqueda('',tk);}}}>Buscar
            </Boton>                                                      
          </Box>                       
        </form>
      </div>
      <div id='divDataGridCatalogo'>        
        <Box sx={{ 
        '& .super-app-theme--header':{fontSize:'small', backgroundColor:'steelblue', color:'white'},        
        '& .super-app.activo':{backgroundColor: 'rgba(157, 255, 118, 0.49)', color: '#1a3e72', fontWeight: '600'},
        '& .super-app.suspendido':{backgroundColor: 'rgba(224, 183, 60, 0.55)', color: '#1a3e72', fontWeight: '600'},
        '& .super-app.cancelado':{backgroundColor: '#d47483', color: '#1a3e72', fontWeight: '600'},
        '& .super-app.baja':{backgroundColor: 'rgba(241, 245, 80, 0.829)', color: '#1a3e72', fontWeight: '600'},
        '& .super-app.nuevo':{backgroundColor: 'lightgrey', color: '#1a3e72', fontWeight: '600'}                
        }}>            
          <DataGrid id='dataGridCatalogo' rows={catalogo} columns={columns} getRowId={(row) => row.id}            
            slots={{toolbar: DataGridTitle}}          
            rowHeight={40}
            columnHeaderHeight={30}                  
            initialState={{pagination:{paginationModel:{pageSize:10}}}}
            pageSizeOptions={[10]}
            onRowClick={ (e) => {handleOpen(e.row);}}                                                     
          />              
        </Box>                                                   
      </div>                
      <div>
      { open?
        <>        
        <Modal 
          open={open}
          onClose={handleClose}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'                               
        >
        <Box sx={{ ...style, width: '58%', height:'90%', bgcolor:'lavender'}}>                  
          <h6 id='title'>Caja: <span id='value'>{caja['nombre']}</span></h6>        
          <h6 id='title'>Estatus actual: <span id='value'>{caja['estado']}</span></h6>        
          <p id='menu'>Selecciona el nuevo estatus:</p>                           
          <input type='radio' id='nvo' name='radio' disabled={caja['estado']==='CAN'||caja['estado']==='ACT'||caja['estado']==='BJA'||caja['estado']==='SUS'?true:false} defaultChecked = {caja['estado']==='NVO'?true:false}/>
          <label forhtml='nvo'>&emsp;Nuevo (NVO)</label><br/>
          <input type='radio' id='act' name='radio' disabled={caja['estado']==='CAN'?true:false} defaultChecked = {caja['estado']==='ACT'?true:false}/>
          <label forhtml='act'>&emsp;Activo (ACT)</label><br/>    
          <input type='radio' id='bja' name='radio' disabled={caja['estado']==='CAN'?true:false} defaultChecked = {caja['estado']==='BJA'?true:false}/>
          <label forhtml='bja'>&emsp;Baja (BJA)</label><br/>                    
          <input type='radio' id='sus' name='radio' disabled={caja['estado']==='CAN'?true:false} defaultChecked = {caja['estado']==='SUS'?true:false}/>                
          <label forhtml='sus'>&emsp;Suspendido (SUS)</label><br/>
          <input type='radio' id='can' name='radio' disabled={caja['estado']==='CAN'?true:false} defaultChecked = {caja['estado']==='CAN'?true:false}/>
          <label forhtml='can'>&emsp;Cancelado (CAN)</label><br/><br/>                                     
          <h6 id='menu'>Motivo de actualización:</h6>
          <textarea id='motivo' rows="5" cols="25" defaultValue={caja['motivo_estatus']} disabled={caja['estado']==='CAN'?true:false}/><br/><br/>
          <h6 id='url'>URL_Geo_Loc:</h6>               
          <input type='text' id='urlText' style={{width:'33%'}} defaultValue={caja['url_geo_loc']} disabled={caja['estado']==='CAN'?true:false}></input>
          <div style={{width:'450px', transform:'translateX(65%) translateY(-75%)'}}>
            <MapSection location={location} zoomLevel={17} /> 
          </div>
          <Button style={{position:'absolute', top:'100%', transform:'translateX(20%) translateY(-500%)'}}
            onClick={() => 
            {
                var estatus='';
                if(document.getElementById('nvo').checked)
                  estatus='NVO';
                else if(document.getElementById('act').checked)
                  estatus='ACT';
                else if(document.getElementById('bja').checked)
                  estatus='BJA';
                else if(document.getElementById('sus').checked)
                  estatus='SUS';
                else if(document.getElementById('can').checked)
                  estatus='CAN';
  
                const motivo = document.getElementById('motivo').value;
                const url = document.getElementById('urlText').value;
                                
                if(caja['estado']===estatus)
                  alert("Selecciona un nuevo estatus");                
                else
                {                                                                      
                  funcionActualizar(caja,estatus,motivo,url);
                  alert('Estatus anterior: '+caja['estado']+' Estatus actualizado a: '+estatus)
                  funcionBusqueda(caja['nombre_cashbank'],tk);                                                                   
                  handleClose(caja);
                }
              }} disabled={caja['estado']==='CAN'?true:false}>Actualizar
            </Button>
          <Button style={{position:'absolute', top:'100%', transform:'translateX(220%) translateY(-500%)'}} onClick={handleClose}>Cerrar</Button>                                               
        </Box>
        </Modal>
        </>
        :<></>
      }
      </div>
    </div>           
  ); 
}