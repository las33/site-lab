const express = require('express');
var port = 80;

var bodyParser = require('body-parser');
var equipe_admin_json = require('./equipe/admin.json'); 
var equipe_coordenacao_json = require('./equipe/coordenacao.json');
var equipe_desenvolvimento_json = require('./equipe/desenvolvimento.json');
var depoimentos = require('./depoimentos/depoimentos.json');
//var login_info = require('./login.json');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
var https = require('https');
https.post = require('https-post');

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

console.log('server on ' + port);

app.engine('.html', require('ejs').__express);
app.use("/public", express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	fs.readdir('./noticias', (err, files) => {		
		var noticias = get_noticias(files)	
		res.render('index', {noticias:JSON.stringify(noticias), depoimentos:JSON.stringify(depoimentos)});
	});
})


app.get('/convenio', function(req, res) {
	res.render('convenio');
})

app.get('/laboratorio', function(req, res) {
	res.render('laboratorio', {admin: JSON.stringify(equipe_admin_json['dados']), coordenacao: JSON.stringify(equipe_coordenacao_json['dados']), desenvolvimento: JSON.stringify(equipe_desenvolvimento_json['dados'])});
})

app.get('/noticias', function(req, res) {	
	fs.readdir('./noticias', (err, files) => {		
		var noticias = get_noticias(files)	

		res.render('noticias_list', {noticias:JSON.stringify(noticias)});
	}); 
}) 	
	
app.get('/projetos', function(req, res) {
	res.render('projetos');
})

app.get('/contato', function(req, res) {
	res.render('contato', {enviado: false});
})

app.post('/sendmail', function(req, res) {
		console.log(req.body)
		

		https.post('https://www.google.com/recaptcha/api/siteverify', { secret: '6LcFvZEUAAAAAPVlJwpYnMeygi4Gxtfuram3u_v9', response: req.body['g-recaptcha-response'] }, function(res_google){
			res_google.setEncoding('utf8');
			res_google.on('data', function(validador) {
					console.log(validador);
					var validador = JSON.parse(validador);
					if(validador["success"] === true){
						
						
						const transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: login_info.email,
								pass: login_info.senha
							}
							});
					
							var mailOptions = {
							to: 'contato@okibrasil.cin.ufpe.br',
							subject: '[SITE OKI] - ' + req.body.assunto,
							text: 'ENVIADO POR: ' + req.body.primeiro_nome + " " + req.body.segundo_nome + "\n" +
									 'EMAIL: ' + req.body.email + "\n" +
									 'MENSAGEM:\n' +req.body.mensagem
							};
					
					
							 transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
							});
					
							var mailOptions_wait = {
							to: req.body.email,
							subject: '[Laboratório OKI Brasil CIn-UFPE] - Recebemos o seu email!',
							text: 'Olá, ' + req.body.primeiro_nome + ',\n\n' + 
								 'Em breve entraremos em contato.'
							};
					
					
							transporter.sendMail(mailOptions_wait, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
							});
					
					
					
							res.render('contato', {enviado: true});
					}				
			});
		});	
});

app.get('/noticia', function(req, res) {
	var idnoticia = req.query.idnoticia;

	var noticia = require('./noticias/' + idnoticia + '.ejs');

	var infos = require('./noticias/' + idnoticia + '.json');		
	const fs = require('fs');

	
	fs.copyFile('./noticias/' + idnoticia + '.ejs', './views/noticia_body.ejs', (err) => {
		if (err) throw err;	

		res.render('noticia', {infos: infos});
	});	
	
})


var erro_login = 0

app.get('/adminoki', function(req, res) {
	res.render('login', {erro_login: erro_login});
	erro_login = 0;	
})

app.post('/loginadmin', function(req, res) {

	// https.post('https://www.google.com/recaptcha/api/siteverify', { secret: '6LcFvZEUAAAAAPVlJwpYnMeygi4Gxtfuram3u_v9', response: req.body['g-recaptcha-response'] }, function(res_google){
	// 	res_google.setEncoding('utf8');
	// 	res_google.on('data', function(validador) {
	// 			console.log(validador);
	// 			var validador = JSON.parse(validador);
	// 			if(validador["success"] === true){
					
	// 				if((req.body.user_oki == "admin") && (req.body.password_oki == "site@@ki2019") ){
						res.render('painel_de_controle', {admin: JSON.stringify(equipe_admin_json['dados']), coordenacao: JSON.stringify(equipe_coordenacao_json['dados']), desenvolvimento: JSON.stringify(equipe_desenvolvimento_json['dados'])});



	// 				}else{
	// 					erro_login = 1;
	// 					res.redirect('adminoki');
	// 				}				
	// 			}else{
	// 				erro_login = 2;
	// 				res.redirect('adminoki');
	// 			}				
	// 	});
	// });	


		
})

app.get('/delete_equipe', function(req, res) {
	var id = req.query.id;  
	var setor = req.query.setor
	
})

function get_noticias(files){
		var noticias = []
		
		for (i = 0; i < files.length/2; i++) { 
			var noticia = require('./noticias/' + i + '.json');			
			noticia['path'] = i;
			var parts =noticia['data'].split('/');		
			noticia['data_d'] = new Date(parts[2], parts[1] - 1, parts[0]); 

			noticias.push(noticia)			
				
		}
		noticias.sort(function(a,b){			
			return new Date(b['data_d']) - new Date(a['data_d']);
		});	
		
		return noticias;	
}
