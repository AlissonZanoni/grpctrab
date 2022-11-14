const grpc = require('grpc');
// const protoLoader = require('@grpc/proto-loader')
const paisProto = new grpc.load('paises.proto');
const server = new grpc.Server();

const paisDB = [
    {id: 1, nome:'Brasil', sigla: 'BR'},
    {id:2, nome:'Italia', sigla: 'IT'}
]


function insertPais(id,nome,sigla){
    let res = {id: id, nome: nome, sigla: sigla};
    return res;
}

server.addService(paisProto.PaisService.service,{

    insert: (call, callback) =>{
        let dadosPais = call.request;
        let data = insertPais(paisDB.length+1,dadosPais.nome,dadosPais.sigla)
        paisDB.push(data);
        callback(null,data);
    },

    list: (_,callback) =>{
        callback(null,paisDB);
    },

})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at 127.0.0.1:50051 ');
server.start();