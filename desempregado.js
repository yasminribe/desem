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

  // Fun��o para buscar o CEP
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
              alert('CEP n�o encontrado');
          }
      }).fail(function () {
          alert('Erro ao buscar o CEP');
      });
  }

  // Carrega o motivo da 2� via
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

  // Valida��o da dispensa
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

      // Verifica se a diferen�a est� entre 60 e 180 dias
      if (diferencaEmDias < 60) {
          var diasRestantes = 60 - diferencaEmDias;
          toastr.error('A data de dispensa deve estar h� pelo menos 60 dias atr�s. Faltam ' + diasRestantes + ' dia(s).');
          campo.addClass('is-invalid');
      } else if (diferencaEmDias > 180) {
          var diasExcedentes = diferencaEmDias - 180;
          toastr.error('A data de dispensa deve estar h� no m�ximo 180 dias atr�s. Data est� ' + diasExcedentes + ' dia(s) al�m do limite.');
          campo.addClass('is-invalid');
      } else {
          campo.removeClass('is-invalid');
      }
  }

  // Fun��o para aplicar m�scaras de entrada nos campos
  function aplicarMascaras() {
      $('#telefone').mask('(99) 99999-9999');
      $('#rg').mask('99.999.999-9');
      $('#cpf').mask('999.999.999-99');
      $('#cnpj').mask('00.000.000/0000-00');
      $('#cep, #cepEmpresa').mask('00000-000');
  }

  // Configura��o do dateRangePicker
  $('#dateRangePicker').daterangepicker({
      locale: {
          format: 'DD/MM/YYYY',
          applyLabel: "Aplicar",
          cancelLabel: "Cancelar",
          customRangeLabel: "Escolha data",
          daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
          monthNames: ["Janeiro", "Fevereiro", "Mar�o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      },
      ranges: {
          'Hoje': [moment().startOf('day'), moment().endOf('day')],
          'Semana': [moment().startOf('week'), moment().endOf('week')],
          'Esse M�s': [moment().startOf('month'), moment().endOf('month')],
      }
  });




// // L�gica para atualizar o cart�o com a validade
// function atualizarCartao(usuario) {
// const validade = new Date(usuario.validade);
// const hoje = new Date();
// const diasRestantes = (validade - hoje) / (1000 * 60 * 60 * 24);
// const validadeStatus = $('#validadeStatus');
// const btnNovoCartao = $('#btnNovoCartao');
// const infoBoxIcon = $('.info-box-icon'); // Seleciona o elemento do �cone

// if (diasRestantes > 0) {
//     validadeStatus.text("Val: " + usuario.validade);
//     infoBoxIcon.removeClass('bg-danger bg-warning').addClass('bg-success'); 
//     btnNovoCartao.html('<i class="fas fa-redo"></i>  2� via Cart�o'); 
// } else {
//     validadeStatus.text("Expirado");
//     infoBoxIcon.removeClass('bg-success bg-warning').addClass('bg-danger'); 
//     btnNovoCartao.html('<i class="fas fa-plus"></i> Novo Cart�o'); 
// }
// }


// // Ap�s o carregamento da p�gina, se os par�metros da URL forem v�lidos, atualize o cart�o
// const params = new URLSearchParams(window.location.search);
// if (params.has('validade')) {
//     const usuario = {
//         validade: params.get('validade')
//     };
//     atualizarCartao(usuario);
// }
});
