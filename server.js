const grpc = require('grpc');
// const protoLoader = require('@grpc/proto-loader')
const paisProto = new grpc.load('paises.proto');
const server = new grpc.Server();

const paisDB = [
    {id: 1, codigo: 1058, nome:'Brasil', sigla: 'BR', moeda: 'BRL'},
    {id: 2, codigo: 3867, nome:'Italia', sigla: 'IT', moeda: 'EUR'}
]


function insertPais(id,codigo,nome,sigla,moeda){
    let res = {id: id,codigo: codigo, nome: nome, sigla: sigla, moeda: moeda};

    for(let i=0; i<=paisDB.length-1;i++){
        console.log(paisDB[i].codigo)
        if(paisDB[i].codigo == codigo){
            error = "er";
            return error;
        }
     }
     return res;
}

function deletePais(id){
    let res = {id: id}

    for(let i=0; i<= paisDB.length-1;i++){
        console.log(paisDB[i].id)
        if(paisDB[i].id == id){
            paisDB.splice(i,1)
            return res;
        }
     }
     res = "er";
     return res;
}



server.addService(paisProto.PaisService.service,{

    insert: (call, callback) =>{
        let dadosPais = call.request;
        let data = insertPais(paisDB.length+1,dadosPais.codigo,dadosPais.nome,dadosPais.sigla,dadosPais.moeda)
        if(data != 'er'){
            paisDB.push(data);
            callback(null,data);
        }
        else{
            return callback({
                code: 400,
                message: "Código do país já cadastrado!",
                status: grpc.status.INTERNAL
              })
        }
    },

    list: (_,callback) =>{
        callback(null,paisDB);
    },

    delete: (call, callback) =>{
        let idPais = call.request;
        let data = deletePais(idPais.id)
        if(data != 'er'){
            callback(null,paisDB);
        }
        else{
            return callback({
                code: 400,
                message: "País não encontrado!",
                status: grpc.status.INTERNAL
              })
        }
    },
    

})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at 127.0.0.1:50051 ');
server.start();