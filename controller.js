const express = require('express');
const cors = require('cors');
const {Sequelize} = require('./models');
const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let cartao = models.Cartao;
let compra = models.Compra;
let promocao = models.Promocao;
let empresa = models.Empresa;

let port = process.env.PORT || 3001;

app.listen(port, (req, res)=>{
    console.log('Servidor está ativo: http://localhost:3001');
});

app.get('/', function(req, res){
    res.send("Welcome");
});

//Inserir um novo cliente

app.post('/cliente', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(cli =>{
        return res.json({
            error: false,
            message: "Cliente foi inserido com sucesso.",
            cli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Inserir um cartão para um cliente

app.post('/cliente/:id/cartao', async(req, res)=>{
    const card = {
        ClienteId: req.params.id,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    };
    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe."
        });
    };

await cartao.create(card)
    .then(cardcli =>{
        return res.json({
            error: false,
            message: "Cartão foi inserido com sucesso.",
            cardcli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Inserir uma compra para um cartão e promoção

app.post('/cartao/:CartaoId/compra/promocao/:PromocaoId', async(req, res)=>{
 
    const buy = {
        CartaoId: req.params.CartaoId,
        PromocaoId: req.params.PromocaoId,
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if(! await cartao.findByPk(req.params.CartaoId)){
        return res.status(400).json({
            error: true,
            message: "Cartão não existe."
        });
    };
    if(! await promocao.findByPk(req.params.PromocaoId)){
        return res.status(400).json({
            error: true, 
            message: "Promoção não existe."
        });
    };
    console.log(buy);
    await compra.create(buy)
        .then(comp =>{
            return res.json({
                error: false,
                message: "Compra foi inserida com sucesso.",
                comp
            });
        }).catch(erro=>{
           // console.log(erro);
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//inserir uma promocao para uma empresa

app.post('/empresa/:id/promocao', async(req,res)=>{
    const promo = {
        EmpresaId: req.params.id,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade
    };

    if(! await empresa.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message:"Empresa não existe."
        });
    };

    await promocao.create(promo)
    .then(promoEmp =>{
        return res.json({
            error:false,
            message: 'Promoção foi inserida com sucesso.',
            promoEmp
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Inserir uma nova empresa

app.post('/empresa', async(req, res)=>{
    await empresa.create(
        req.body
    ).then(emp =>{
        return res.json({
            error: false,
            message: "Empresa foi inserida com sucesso.",
            emp
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});


//Listar todos os clientes

app.get('/clientes', async(req, res)=>{
    await cliente.findAll()
    .then(cli =>{
        return res.json({
            error:false,
            cli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Listar todos os cartões dos clientes

app.get('/cliente-cartaos', async(req, res)=>{
    await cliente.findAll({include : [{all: true}]})
    .then(cli =>{
        return res.json({
            error:false,
            cli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Listar cartões de um cliente

app.get('/clientes/:id/cartaos', async(req, res)=>{
    await cartao.findAll({
        where: {ClienteId: req.params.id}
    }).then(cartaos =>{
        return res.json({
            error:false,
            cartaos
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
         });
     });
});
//Listar um cartao

app.get('/cartao/:id', async(req, res)=>{
    await cartao.findByPk(req.params.id)
    .then(cardcli =>{
        return res.json({
            error:false,
            cardcli
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Listar compras

app.get('/cartao/:CartaoId/compra/promocao/:PromocaoId', async(req, res)=>{
    await compra.findAll(req.params.id)
    .then(compras =>{
        return res.json({
            error:false,
            compras
         });
         
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});


//Listar uma promoção

app.get('/promocao/:id', async(req, res)=>{
    await promocao.findByPk(req.params.id)
    .then(promo =>{
        return res.json({
            error:false,
            promo
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//listar todos as empresas e suas promoções

app.get('/empresas-promocoes', async(req, res)=>{
    await empresa.findAll({include : [{all: true}]})
    .then(emp =>{
        return res.json({
            error:false,
            emp
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});


//Listar uma empresa

app.get('/empresa/:id', async(req, res)=>{
    await empresa.findByPk(req.params.id)
    .then(emp =>{
        return res.json({
            error:false,
            emp
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Atualizar cliente

app.put('/cliente/:id', async(req, res)=>{
    const id = req.params.id;
  
    cliente.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Cliente foi atualizado com sucesso."
          });
        } else {
          res.send({
            message: `Não foi possível atualizar cliente!`
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: "Problema de conexão com a API"
        });
      });
  });
//Atualizar cartão

app.put('/cartao/:id', async(req, res)=>{
    const cardcli = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    }

    if( ! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message:"Cliente não existe."
        });
    };

    await cartao.update(cardcli, {
        where: Sequelize.and({ClienteId: req.body.ClienteId})
    }).then(umcartao =>{
        return res.json({
            error:false,
            message: "Cartao foi alterado com sucesso.",
            umcartao
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Atualizar compra

app.put('/cartao/:CartaoId/compra/promocao/:PromocaoId', async(req, res)=>{
    const compras = {
        CartaoId: req.params.CartaoId,
        PromocaoId: req.params.PromocaoId,
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    }

    if( ! await cartao.findByPk(req.params.CartaoId)){
        return res.status(400).json({
            error: true,
            message:"Cartão não existe."
        });
    };

    if( ! await promocao.findByPk(req.params.PromocaoId)){
        return res.status(400).json({
            error: true,
            message:"Promoção não existe."
        });
    };  
    
    await compra.update(compras,{
        where: Sequelize.and({  
             CartaoId: req.params.CartaoId,
             PromocaoId: req.params.PromocaoId
            }),
          
    }).then(compra =>{
        return res.json({
            error:false,
            message: "Compra foi alterada com sucesso.",
            compra
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
         });
     });
});

//Atualizar promoção

app.put('/promocao/:id', async(req, res)=>{
    const promo = {
        EmpresaId: req.params.EmpresaId,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade
    }

    if( ! await empresa.findByPk(req.body.EmpresaId)){
        return res.status(400).json({
            error: true,
            message:"Empresa não existe."
        });
    };

    await promocao.update(promo, {
        where: Sequelize.and({EmpresaId: req.body.EmpresaId})
    }).then(pro =>{
        return res.json({
            error:false,
            message: "Promoção foi alterada com sucesso.",
            pro
         });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Atualizar empresa

app.put('/empresa/:EmpresaId', async(req, res)=>{
    const id = req.params.EmpresaId;
  
    empresa.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Empresa foi atualizado com sucesso."
          });
        } else {
          res.send({
            message: `Não foi possível atualizar empresa!`
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: "Problema de conexão com a API"
        });
      });
  });

//Excluir cliente

app.delete('/excluir-cliente/:id', async(req, res)=>{

    await cliente.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluído com sucesso.",
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Excluir cartão

app.delete('/excluir-cartao/:id', async(req, res)=>{

    await cartao.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Cartao foi excluído com sucesso.",
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});
 
//Excluir compra

app.delete('/excluir-compra/:CartaoId/:PromocaoId', async(req, res)=>{

    await compra.destroy({
        where: {CartaoId: req.params.CartaoId,
            PromocaoId: req.params.PromocaoId}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Compra foi excluída com sucesso.",
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});
 
//Excluir promocao

app.delete('/excluir-promocao/:id', async(req, res)=>{

    await promocao.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Promocao foi excluída com sucesso.",
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});

//Excluir empresa

app.delete('/excluir-empresa/:id', async(req, res)=>{

    await empresa.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Empresa foi excluída com sucesso.",
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
             message: "Problema de conexão com a API."
         });
     });
});
