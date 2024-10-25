<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<!--#include file="seguranca.asp"-->
<!--#include virtual="/aplicativos/arquivos.asp"-->
<!--#include virtual="/aplicativos/JSON_2.0.4.asp" -->
<!--#include virtual="/aplicativos/JSON_UTIL_0.1.1.asp" -->
<!--#include virtual="/aplicativos/validacao.asp" -->

<%

Dim d

set d = ConverteRequestParaDicionario(Request)

if request("a") = "ultimoAcesso" then
	GetUltimoAcesso
end if

banco.close
Set banco = nothing


'---------------------------------------------'
sub GetUltimoAcesso
'---------------------------------------------'
	response.write "[{""nome"":""" & session("desempregadoNome") & """,""ultimoAcesso"":""" & session("desempregadoUltimoAcesso") & """}]"
	response.end

end sub




%>