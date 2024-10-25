<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<!--#include virtual="/aplicativos/arquivos.asp"-->
<!--#include virtual="/aplicativos/JSON_2.0.4.asp" -->
<!--#include virtual="/aplicativos/JSON_UTIL_0.1.1.asp" -->
<!--#include virtual="/aplicativos/validacao.asp" -->

<%
Dim d
set d = ConverteRequestParaDicionario(Request)

' Verifica a ação da requisição
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

'---------------------------------------------'
Sub CarregaCep
'---------------------------------------------'

    SQL = "SELECT " & _
          "(tipoLogra) AS tipoLogra, " & _
          "(logradou) AS logradouro, " & _
          "(bairro) AS bairro, " & _
          "(nomelocal) AS municipio, " & _
          "(estado) AS estado " & _
          "FROM cep (NOLOCK) " & _
          "WHERE CEP = '" & d.item("cep") & "'"

    Set tab = banco.Execute(SQL)
    If Not tab.EOF Then
        QueryToJSON(banco, SQL).Flush
    Else
        Response.Write "{""erro"":""CEP não encontrado""}"
    End If

    Response.End
End Sub

'---------------------------------------------
' Função: CarregaMotivo
'---------------------------------------------
Sub CarregaMotivo

    SQL = "SELECT chmotivo, descricao FROM DesempregadoMotivo"

    QueryToJSON(banco, SQL).Flush
    Response.End

End Sub

'---------------------------------------------
' Função: BuscarUsuario
'---------------------------------------------
Sub BuscarUsuario

    SQL = "SELECT chDesempregado, chOperacao, chMotivo, nome, cpf, rg, dataNascimento, " & _
          "telefone, email, cep, endereco, numero, complemento, bairro, cidade, estado, " & _
          "ctps, ctps_s, cnpj, empresa, cepEmp, enderecoEmp, numeroEmp, complementoEmp, " & _
          "bairroEmp, cidadeEmp, estadoEmp, selo, entrega, validade " & _
          "FROM Desempregado WHERE 1=1"

    If Trim(d.item("cpf")) <> "" Then
        SQL = SQL & " AND cpf = '" & Trim(d.item("cpf")) & "'"
    End If

    If Trim(d.item("rg")) <> "" Then
        SQL = SQL & " AND rg = '" & Trim(d.item("rg")) & "'"
    End If

    If Trim(d.item("nome")) <> "" Then
        SQL = SQL & " AND nome LIKE '%" & Trim(d.item("nome")) & "%'"
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
' Função: BuscarUsuario
'---------------------------------------------
Sub BuscarUsuarioTeste

    SQL = "SELECT chDesempregado, chOperacao, chMotivo, nome, cpf, rg, dataNascimento, " & _
          "telefone, email, cep, endereco, numero, complemento, bairro, cidade, estado, " & _
          "ctps, ctps_s, cnpj, empresa, cepEmp, enderecoEmp, numeroEmp, complementoEmp, " & _
          "bairroEmp, cidadeEmp, estadoEmp, selo, entrega, validade " & _
          "FROM Desempregado (nolock) WHERE chDesempregado = " & d.item("chDesempregado") 

    
    QueryToJSON(banco, SQL).Flush
    Response.End

End Sub



%>
