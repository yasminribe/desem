<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<!--#include virtual="/aplicativos/arquivos.asp"-->
<!--#include virtual="/aplicativos/validacao.asp" -->
<!--#include virtual="/formAutenticacao.asp"-->

<%

Session.Timeout=180

Dim d,  login, loginSenha
set d = ConverteRequestParaDicionario(Request)

if d.item("a") = "login" then
	LoginUsuario
end if

banco.close
set banco = nothing

'FUNCAO QUE REALIZA O LOGIN DO USUARIO
'-----------------------------------------------------------------------'
sub LoginUsuario()
'-----------------------------------------------------------------------'
	dim arrAutenticacao, retornoAuth

    'Indicar o CAMINHO COMPLETO da pagina inicial do sistema - redireciona quando TROCA A SENHA'
	session("autenticacaoRedireciona") = "/Desempregado/index.htm"

	'Indicar o chAplicativo do sistema - pegar da pagina de login antiga'
	chAplicativo = "1024"   

	'valida o usuario utilizando a funcao AutenticarUsuario que esta em /formAutenticacao.asp'
	arrAutenticacao = split(AutenticarUsuario(d.item("login"), d.item("senha"), chAplicativo ), "|")

	if (arrAutenticacao(0) = "ERRO") then
		response.write "[{""msg"":""ERRO"",""msgErro"":""" & arrAutenticacao(1) & """}]"
		response.end
		exit sub
	else	
		
		'VALORES RETORNADOS NO ARRAY arrAutenticacao: '
		'arrAutenticacao(0) - retorna as string "OK" - no caso de sucesso
		'arrAutenticacao(1) - chUsuario 
		'arrAutenticacao(2) - Nome do Usuario
		'arrAutenticacao(3) - Login do Usuario
		'arrAutenticacao(4) - chRegiao do Usuario
		'arrAutenticacao(5) - Ultimo Acesso do Usuario
		'arrAutenticacao(6) - chPerfil do usuario
		'arrAutenticacao(7) - email do usuario

		'CRIAR TODAS AS SESSOES DO LOGIN ANTIGO - MUDAR ABAIXO'
		session("desempregadoChUsuario") = arrAutenticacao(1)
		session("desempregadoLogin") = arrAutenticacao(3)
		session("desempregadoNome") = arrAutenticacao(2)		
		session("desempregadoChPerfil") = arrAutenticacao(6)

		if arrAutenticacao(5) <> "" then
			session("desempregadoUltimoAcesso") = arrAutenticacao(5)
		else 
			session("desempregadoUltimoAcesso") = "Primeiro Acesso"
		end if

		'sessao utilizada na pagina de troca de senha'
        session("trocarSenhaUser") = arrAutenticacao(3)

		SQLUltimoAcesso= " update usuaperfil set ultimoacesso=getdate() " & _
							" where (chusuario=" & arrAutenticacao(1) & ")"& _
							" and chPerfil in (select chperfil from apliperfil where chaplicativo = " & chAplicativo & ")"

		banco.execute (SQLUltimoAcesso)


		if arrAutenticacao(0) = "TROCARSENHA" then
			response.write "[{""msg"":""TROCARSENHA""}]"
			response.end
			exit sub
		else
			response.write "[{""msg"":""OK""}]"
			response.end
			exit sub
		end if	

	end if
'FIM'
end sub









%>