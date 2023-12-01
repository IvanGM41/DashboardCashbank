export default function funcionCashBank (url, request, callback) 
{           
    fetch(url, request)
    .then(response => response.json())
    .then(datos => {callback(undefined,datos)})
    .catch(error => {callback(error,undefined)})    
}

export function funcionCashBank_2 (url, request, callback) 
{           
    fetch(url, request)
    .then(response => response)
    .then(datos => {callback(undefined,datos)})
    .catch(error => {callback(error,undefined)})    
}