import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
export default function Serie()
{   
  
  const catalogoPais = 
  [
    {"pais":"MEX"}, {"pais":"ESP"}, {"pais":"EUA"}
  ]

  const catalogoDivisa = 
  [
    {"divisa":"MXN"}, {"divisa":"EUR"}, {"divisa":"USD"}
  ]

  const catalogoModelo = 
  [
    {"modelo":"H"}, {"modelo":"V"}, {"modelo":"C"}, {"modelo":"U"}
  ]

  const catalogoAnio = 
  [
    {"anio":"2023"}, {"anio":"2024"}, {"anio":"2025"}, {"anio":"2026"}, {"anio":"2027"}, {"anio":"2028"}, {"anio":"2029"}, {"anio":"2030"}, 
    {"anio":"2031"}, {"anio":"2032"}, {"anio":"2033"}, {"anio":"2034"}, {"anio":"2035"}, {"anio":"2036"}, {"anio":"2037"}, {"anio":"2038"}
  ]

  const catalogoConsecutivo = 
  [
    {"consecutivo":"111111"}, {"consecutivo":"222222"}, {"consecutivo":"123456"}, {"consecutivo":"654321"}, {"consecutivo":"001122"}
  ]
  
  const style = 
  {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  function splitNumberUsingForLoop(number) 
  {
    const digits = [];
    const numberString = number.toString();
 
    for (let i = 0; i < numberString.length; i++) 
    {
      const digit = parseInt(numberString[i]);
      digits.push(digit);
    }
 
    return digits;
  }

  const crearDigitoVerificador = (codigo) =>
  {
    var codePais = codigo[0].charCodeAt(0);
    var codeDivisa = codigo[1].charCodeAt(0);
    var codeModelo = codigo[2].charCodeAt(0);
    var sumaAnio = parseInt(codigo[3].substring(0,1))+parseInt(codigo[3].substring(1,2));
    var codeAnio = sumaAnio.toString().charCodeAt(0);
    var consecutivo = splitNumberUsingForLoop(codigo[4]);
    var sumaConsecutivo = consecutivo[0]+ consecutivo[1]+consecutivo[2]+consecutivo[3]+consecutivo[4]+consecutivo[5];
    var stringConsecutivo = sumaConsecutivo.toString();
    var codeConsecutivo = stringConsecutivo.substring(stringConsecutivo.length-1).charCodeAt(0);
    var sumaVerificador = codePais+codeDivisa+codeModelo+codeAnio+codeConsecutivo;
    var stringVerificador = sumaVerificador.toString();
    var digitoVerificador = stringVerificador.substring(stringVerificador.length-1);

    console.log('codePais: '+codePais);
    console.log('codeDivisa: '+codeDivisa);
    console.log('codeModelo: '+codeModelo);
    console.log('codeAnio: '+codeAnio);
    console.log('codeConsecutivo: '+codeConsecutivo);
    console.log('digitoVerificador: '+digitoVerificador);
    return digitoVerificador;
  }

  const guardarSerie = (serie) => 
  {
    console.log(serie);
    alert('Tu numero de serie es: '+serie);
  }
  
  function comboBox(catalogo, campo, select)
  {
    var comboValues = catalogo;    
    var selectList = document.getElementById(select);
    var options = document.querySelectorAll('#'+select+' option');
    options.forEach(o => o.remove());
    console.log(catalogo);
    
    comboValues.forEach(comboValues => {
      var option = document.createElement('option');
      option.setAttribute('value',JSON.stringify(comboValues[campo]).replace("\"","").replace("\"",""));
      option.text = JSON.stringify(comboValues[campo]).replace("\"","").replace("\"","");        
      selectList.appendChild(option);
    });   
  }

  useEffect(() => 
  { 
    if(catalogoPais.length!==0)
      comboBox(catalogoPais,'pais','selectPais');
    if(catalogoDivisa.length!==0)
      comboBox(catalogoDivisa,'divisa','selectDivisa');
    if(catalogoModelo.length!==0)
      comboBox(catalogoModelo,'modelo','selectModelo');
    if(catalogoAnio.length!==0)
      comboBox(catalogoAnio,'anio','selectAnio');
    if(catalogoConsecutivo.length!==0)
      comboBox(catalogoConsecutivo,'consecutivo','selectConsecutivo');    
  });
   
  return(    
      <div>
        <Box sx={{...style}}>
        <form>
          <div><h3 style={{fontWeight:'bold', color:'darkblue', textAlign:'center'}}>SERIE</h3></div><br/>            
          <div style={{fontWeight:'bold', color:'rgb(68, 150, 216)', fontFamily:'consolas', textAlign:'left'}}>
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<label>PAÍS:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</label>
          &emsp;&emsp;&emsp;<select id='selectPais'></select>
          </div><br/>
          <div style={{fontWeight:'bold', color:'rgb(68, 150, 216)', fontFamily:'consolas', textAlign:'left'}}>
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<label>DIVISA:&emsp;&emsp;&emsp;&emsp;</label>
          &emsp;&emsp;&emsp;<select id='selectDivisa'></select>
          </div><br/>            
          <div style={{fontWeight:'bold', color:'rgb(68, 150, 216)', fontFamily:'consolas', textAlign:'left'}}>            
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<label>MODELO:&emsp;&emsp;&emsp;&emsp;</label>
          &emsp;&emsp;&emsp;<select id='selectModelo'></select>
          </div><br/>
          <div style={{fontWeight:'bold', color:'rgb(68, 150, 216)', fontFamily:'consolas', textAlign:'left'}}>            
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<label>AÑO:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</label>
          &emsp;&emsp;&emsp;<select id='selectAnio'></select>
          </div><br/>
          <div style={{fontWeight:'bold', color:'rgb(68, 150, 216)', fontFamily:'consolas', textAlign:'left'}}>            
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<label>CONSECUTIVO:</label>
          &emsp;&emsp;<select id='selectConsecutivo'></select>
          </div><br/>
          <Button id='botonForm' style={{position:'absolute', top:'90%', transform:'translateX(120%) translateY(-50%)'}}
          onClick={() => 
          {           
            var idPais = document.getElementById('selectPais');
            var paisOption = idPais.options[idPais.selectedIndex].value;                      
            var idDivisa = document.getElementById('selectDivisa');
            var divisaOption = idDivisa.options[idDivisa.selectedIndex].value;
            var idModelo = document.getElementById('selectModelo');
            var modeloOption = idModelo.options[idModelo.selectedIndex].value;
            var idAnio = document.getElementById('selectAnio');
            var anioOption = idAnio.options[idAnio.selectedIndex].value.substring(2,4);
            var idConsecutivo = document.getElementById('selectConsecutivo');
            var consecutivoOption = idConsecutivo.options[idConsecutivo.selectedIndex].value;
            const codigo = [paisOption.substring(1,2),divisaOption.substring(1,2),modeloOption,anioOption,consecutivoOption];
            var digitoVerificador = crearDigitoVerificador(codigo);            
            var serie = paisOption+divisaOption+modeloOption+anioOption+consecutivoOption+'-'+digitoVerificador;
            guardarSerie(serie);                        
          }}>Guardar</Button>
        </form>
        </Box>
    </div>    
  ); 
}