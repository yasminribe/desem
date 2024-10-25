## Preenchimento Autom�tico de Endere�o com CEP

Este projeto utiliza jQuery para preencher automaticamente os campos de endere�o, bairro, cidade e estado com base no CEP digitado pelo usu�rio. Abaixo est� uma explica��o detalhada do funcionamento do c�digo e dos retornos esperados.

### Fun��o `removerMascara`

Remove todos os caracteres n�o num�ricos do CEP digitado pelo usu�rio. Isso garante que o CEP seja enviado ao servidor sem formata��o, apenas com os n�meros.

### Fun��o `preencherCampos`

Recebe o CEP e os seletores dos campos de endere�o, bairro, cidade e estado. A fun��o realiza os seguintes passos:
1. Remove a m�scara do CEP.
2. Faz uma requisi��o AJAX para o endpoint `desempregado.asp?CarregaCep` com o CEP como par�metro.
3. Se a requisi��o for bem-sucedida e retornar dados:
   - Concatena `tipoLogra` e `logradouro` para formar o endere�o completo e preenche o campo de endere�o.
   - Preenche os campos de bairro, cidade e estado com os dados retornados.
4. Se n�o encontrar o CEP, exibe um alerta informando que o CEP n�o foi encontrado.
5. Se houver um erro na requisi��o, exibe um alerta informando sobre o erro.

### Eventos `blur` nos campos de CEP

Quando o campo de CEP perde o foco (evento `blur`), a fun��o `preencherCampos` � chamada para buscar e preencher os dados nos campos correspondentes.

### Retornos Esperados

- **CEP V�lido**:
  - Os campos de endere�o, bairro, cidade e estado s�o preenchidos automaticamente com os dados retornados pelo servidor.
  - O campo de endere�o � preenchido com a concatena��o de `tipoLogra` e `logradouro`.

- **CEP N�o Encontrado**:
  - Um alerta � exibido informando que o CEP n�o foi encontrado.

- **Erro na Requisi��o**:
  - Um alerta � exibido informando que houve um erro ao buscar o CEP.
  - O console do navegador exibe detalhes do erro para ajudar na depura��o.


