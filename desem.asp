<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<!--#include virtual="/aplicativos/arquivos.asp"-->
<!--#include virtual="/aplicativos/JSON_2.0.4.asp" -->
<!--#include virtual="/aplicativos/JSON_UTIL_0.1.1.asp" -->
<!--#include virtual="/aplicativos/validacao.asp" -->

<%
Dim d
set d = ConverteRequestParaDicionario(Request)

' Verifica a a��o da requisi��o
If request("a") = "carregaCep" Then
    CarregaCep
ElseIf request("a") = "carregaMotivo" Then
    CarregaMotivo
ElseIf request("a") = "buscarUsuario" Then
    BuscarUsuario
ElseIf request("a") = "carregaDesempregado" Then
    CarregaDesempregado
ElseIf request("a") = "buscarUsuarioTeste" Then
    BuscarUsuarioTeste
End If

Sub BuscarUsuario()
 
    SQL = "SELECT chDesempregado, nome, cpf, rg, empresa, validade FROM  Desempregado (nolock) WHERE 1=1"
    filtroAplicado = False

    ' Aplica os filtros somente se os campos n�o estiverem vazios
    If Trim(d.item("cpf")) <> "" Then
        SQL = SQL & " AND cpf = '" & Trim(d.item("cpf")) & "'"
        filtroAplicado = True
    End If

    If Trim(d.item("rg")) <> "" Then
        SQL = SQL & " AND rg = '" & Trim(d.item("rg")) & "'"
        filtroAplicado = True
    End If

    If Trim(d.item("nome")) <> "" Then
        SQL = SQL & " AND nome LIKE '%" & Trim(d.item("nome")) & "%'"
        filtroAplicado = True
    End If

    Set tab = banco.Execute(SQL)

    If Not tab.EOF Then
        QueryToJSON(banco, SQL).Flush
    Else
        Response.Write "{""encontrado"":false}"
    End If

    Response.End
End Sub



'---------------------------------------------
' Sub-rotina: ExibirUsuario
'---------------------------------------------
Sub CarregaDesempregado()
    SQL = "SELECT chDesempregado, chOperacao, chMotivo, nome, cpf, rg, dataNascimento, " & _
          "telefone, email, cep, endereco, numero, complemento, bairro, cidade, estado, " & _
          "ctps, ctps_s, cnpj, empresa,dispensa, cepEmp, enderecoEmp, numeroEmp, complementoEmp, " & _
          "bairroEmp, cidadeEmp, estadoEmp, selo, entrega, validade " & _
          "FROM Desempregado (nolock) WHERE chDesempregado = " & d.item("chDesempregado") 

    QueryToJSON(banco, SQL).Flush
    Response.End
End Sub
%>
