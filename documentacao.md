## Preenchimento Automático de Endereço com CEP

Este projeto utiliza jQuery para preencher automaticamente os campos de endereço, bairro, cidade e estado com base no CEP digitado pelo usuário. Abaixo está uma explicação detalhada do funcionamento do código e dos retornos esperados.

### Função `removerMascara`

Remove todos os caracteres não numéricos do CEP digitado pelo usuário. Isso garante que o CEP seja enviado ao servidor sem formatação, apenas com os números.

### Função `preencherCampos`

Recebe o CEP e os seletores dos campos de endereço, bairro, cidade e estado. A função realiza os seguintes passos:
1. Remove a máscara do CEP.
2. Faz uma requisição AJAX para o endpoint `desempregado.asp?CarregaCep` com o CEP como parâmetro.
3. Se a requisição for bem-sucedida e retornar dados:
   - Concatena `tipoLogra` e `logradouro` para formar o endereço completo e preenche o campo de endereço.
   - Preenche os campos de bairro, cidade e estado com os dados retornados.
4. Se não encontrar o CEP, exibe um alerta informando que o CEP não foi encontrado.
5. Se houver um erro na requisição, exibe um alerta informando sobre o erro.

### Eventos `blur` nos campos de CEP

Quando o campo de CEP perde o foco (evento `blur`), a função `preencherCampos` é chamada para buscar e preencher os dados nos campos correspondentes.

### Retornos Esperados

- **CEP Válido**:
  - Os campos de endereço, bairro, cidade e estado são preenchidos automaticamente com os dados retornados pelo servidor.
  - O campo de endereço é preenchido com a concatenação de `tipoLogra` e `logradouro`.

- **CEP Não Encontrado**:
  - Um alerta é exibido informando que o CEP não foi encontrado.

- **Erro na Requisição**:
  - Um alerta é exibido informando que houve um erro ao buscar o CEP.
  - O console do navegador exibe detalhes do erro para ajudar na depuração.


