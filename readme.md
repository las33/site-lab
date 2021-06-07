# Site Laboratório (NCR/OKI)-CinUFPE

## Demo

https://site-lab.herokuapp.com/

Site de apresentacao do prejeto NCR - Cin UFPE. Desenvolvido utilizando Node.js, Express.js e Materialize.css.

### Dependências

Node.js

### Instalação
```sh
$ npm install 
```
### Execução
```sh
$ npm start 
```

### Adicionar ou remover funcionários na tela do laboratório

São 3 arquivos, um para cada função:

 Função   | Diretório 
| ------  | ------ 
| Administração | [equipe/admin.json](equipe/admin.json)  
| Coordenação | [equipe/coordenacao.json](equipe/coordenacao.json)
| Desenvolvimento |  [equipe/desenvolvimento.json](equipe/desenvolvimento.json) 

Cada json é um lista com objetos que seguem o seguinte formato:
```json
{
 "nome":"Nome do funcionário",
 "cargo":"Cargo",
 "grupo":"Automação Comercial",
 "imagem": "images/equipe/login.jpg",
 "email":"",
 "telefone":"numero do ramal"
}
```
As fotos de cada funcionário estão no diretório [public/images/equipe](public/images/equipe)

### Publicando noticias

Todas as noticias estão no diretório [noticias](noticias).
Elas seguem uma sequencia que deve ser respeitada.
Cada noticia é formada de dois arquivos, um .ejs e outro .json.

O arquivo .json segue o seguinte formato:
```json
{"data": "15/08/2017",
"titulo": "Vagas para Estagiários",
"resumo": "Breve resumo"}
```
O arquivo ejs possui o escopo puro da noticia com tags html.