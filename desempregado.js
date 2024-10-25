$(document).ready(function () {

  carregaMotivo();

  // Eventos de CEP residencial e da empresa
  $('#cep, #cepEmpresa').on('input', function () {
      var cep = $(this).val().replace(/\D/g, '');
      var prefixo = $(this).attr('id') === 'cepEmpresa' ? 'empresa' : '';
      if (cep.length === 8) {
          buscaCep(cep, prefixo);
      }
  });

  // Função para buscar o CEP
  function buscaCep(cep, prefixo) {
      $.getJSON('desempregado.asp', { a: 'carregaCep', cep: cep }, function (resultado) {
          if (resultado && resultado.length > 0) {
              var dados = resultado[0];
              var enderecoCompleto = dados.tipoLogra + ' ' + dados.logradouro;

              if (prefixo === 'empresa') {
                  $('#enderecoEmpresa').val(enderecoCompleto);
                  $('#bairroEmpresa').val(dados.bairro);
                  $('#cidadeEmpresa').val(dados.municipio);
                  $('#estadoEmpresa').val(dados.estado);
              } else {
                  $('#endereco').val(enderecoCompleto);
                  $('#bairro').val(dados.bairro);
                  $('#cidade').val(dados.municipio);
                  $('#estado').val(dados.estado);
              }
          } else {
              alert('CEP não encontrado');
          }
      }).fail(function () {
          alert('Erro ao buscar o CEP');
      });
  }

  // Carrega o motivo da 2° via
  function carregaMotivo() {
      $.getJSON('desempregado.asp', { a: 'carregaMotivo' }, function (data) {
          if (data.erro) {
              alert(data.erro);
          } else {
              $('#acaoBeneficio').empty();
              $('#acaoBeneficio').append(
                  $('<option>', {
                      value: '',
                      text: 'Selecione o motivo',
                      disabled: true,
                      selected: true
                  })
              );
              $.each(data, function (index, motivo) {
                  $('#acaoBeneficio').append(
                      $('<option>', {
                          value: motivo.chmotivo,
                          text: motivo.descricao
                      })
                  );
              });
          }
      }).fail(function () {
          alert('Erro ao carregar os motivos');
      });
  }

  // Validação da dispensa
  var timer;

  $('#dataDispensa').on('input', function () {
      clearTimeout(timer);
      var campo = $(this);

      timer = setTimeout(function () {
          validaDispensa(campo);
      }, 900);
  });

  function validaDispensa(campo) {
      var dataDispensa = new Date(campo.val());
      var dataAtual = new Date();
      var diferencaEmDias = Math.floor((dataAtual - dataDispensa) / (1000 * 60 * 60 * 24));

      // Verifica se a diferença está entre 60 e 180 dias
      if (diferencaEmDias < 60) {
          var diasRestantes = 60 - diferencaEmDias;
          toastr.error('A data de dispensa deve estar há pelo menos 60 dias atrás. Faltam ' + diasRestantes + ' dia(s).');
          campo.addClass('is-invalid');
      } else if (diferencaEmDias > 180) {
          var diasExcedentes = diferencaEmDias - 180;
          toastr.error('A data de dispensa deve estar há no máximo 180 dias atrás. Data está ' + diasExcedentes + ' dia(s) além do limite.');
          campo.addClass('is-invalid');
      } else {
          campo.removeClass('is-invalid');
      }
  }

  // Função para aplicar máscaras de entrada nos campos
  function aplicarMascaras() {
      $('#telefone').mask('(99) 99999-9999');
      $('#rg').mask('99.999.999-9');
      $('#cpf').mask('999.999.999-99');
      $('#cnpj').mask('00.000.000/0000-00');
      $('#cep, #cepEmpresa').mask('00000-000');
  }

  // Configuração do dateRangePicker
  $('#dateRangePicker').daterangepicker({
      locale: {
          format: 'DD/MM/YYYY',
          applyLabel: "Aplicar",
          cancelLabel: "Cancelar",
          customRangeLabel: "Escolha data",
          daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
          monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      },
      ranges: {
          'Hoje': [moment().startOf('day'), moment().endOf('day')],
          'Semana': [moment().startOf('week'), moment().endOf('week')],
          'Esse Mês': [moment().startOf('month'), moment().endOf('month')],
      }
  });




// // Lógica para atualizar o cartão com a validade
// function atualizarCartao(usuario) {
// const validade = new Date(usuario.validade);
// const hoje = new Date();
// const diasRestantes = (validade - hoje) / (1000 * 60 * 60 * 24);
// const validadeStatus = $('#validadeStatus');
// const btnNovoCartao = $('#btnNovoCartao');
// const infoBoxIcon = $('.info-box-icon'); // Seleciona o elemento do ícone

// if (diasRestantes > 0) {
//     validadeStatus.text("Val: " + usuario.validade);
//     infoBoxIcon.removeClass('bg-danger bg-warning').addClass('bg-success'); 
//     btnNovoCartao.html('<i class="fas fa-redo"></i>  2ª via Cartão'); 
// } else {
//     validadeStatus.text("Expirado");
//     infoBoxIcon.removeClass('bg-success bg-warning').addClass('bg-danger'); 
//     btnNovoCartao.html('<i class="fas fa-plus"></i> Novo Cartão'); 
// }
// }


// // Após o carregamento da página, se os parâmetros da URL forem válidos, atualize o cartão
// const params = new URLSearchParams(window.location.search);
// if (params.has('validade')) {
//     const usuario = {
//         validade: params.get('validade')
//     };
//     atualizarCartao(usuario);
// }
});
