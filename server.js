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
    return res;
}

server.addService(paisProto.PaisService.service,{

    insert: (call, callback) =>{
        let dadosPais = call.request;
        let data = insertPais(paisDB.length+1,dadosPais.codigo,dadosPais.nome,dadosPais.sigla,dadosPais.moeda)
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