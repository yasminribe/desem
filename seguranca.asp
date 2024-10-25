<!--#include virtual="/aplicativos/arquivos.asp"-->
<%

if session("desempregadoChUsuario") = "" then
    response.redirect "login.htm"
    response.end
end if


'Pegando o nome da pagina acessada pelo usuario para verificar se o perfil dele permite o acesso'
arrPath = Split(Request.ServerVariables("SCRIPT_NAME"), "/")
fileName = arrPath(UBound(arrPath))
fileName = replace(filename, "asp", "htm")  'no caso de arquivo asp, subistitui por htm, pois no perfil so tem arquivos htm'

'verifica se o usuario tem permissao para acessar a pagina, senao manda ele para o login.htm'
'desconsidera as paginas padroes como index, header, footer, sidebar '
if filename <> "" and fileName <> "index.htm" and fileName <> "index.asp" and fileName <> "header.htm" and fileName <> "header.asp" and fileName <> "sidebar.htm" and fileName <> "sidebar.asp" and fileName <> "footer.htm" and fileName <> "footer.asp" then

    sql = " select link from usuaperfil up (nolock) " & _
		  " inner join apliperfil ap (nolock) on ap.chPerfil = up.chperfil " & _
		  " inner join aplicaOpcao ao (nolock) on ao.chAplicaMenu = ap.chAplicativo " & _
		  " inner join apliPerfilFuncao apf (nolock) on apf.chPerfil = ap.chPerfil and apf.chAplicaOpcao = ao.chAplicaOpcao " & _
		  " where chusuario = '" & session("desempregadoChUsuario") & "' " & _
		  "       and up.chPerfil = '" & session("desempregadoChPerfil") & "'" & _
		  "       and (link = '" & fileName & "') " 

    set tab = banco.execute(sql)

    if tab.eof then
		response.redirect "login.htm"
		response.end    	
    end if

end if


%>