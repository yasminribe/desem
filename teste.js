$(document).ready(function () {
    function aplicarMascaras() {
        $('#telefone').mask('(99) 99999-9999');
        $('#rg').mask('99.999.999-9');
        $('#cpf').mask('999.999.999-99');
        $('#cnpj').mask('00.000.000/0000-00');
        $('#cep, #cepEmpresa').mask('00000-000');
    }

    function buscarDesempregado() {
        var busca = $('#campoBusca').val().trim();
        if (!busca) {
            alert('Por favor, insira um critério de busca (CPF, RG ou Nome).');
            return;
        }

        var isCPF = /^\d{11}$/.test(busca);
        var isRG = /^\d{7,9}$/.test(busca);
        var isNome = /^[A-Za-zÀ-ÿ\s]+$/.test(busca);

        var tipoBusca = isCPF ? 'cpf' : (isRG ? 'rg' : (isNome ? 'nome' : ''));
        if (!tipoBusca) {
            alert('Formato de busca inválido. Use CPF, RG ou Nome.');
            return;
        }

        $.getJSON('desem.asp', {
            a: 'buscarUsuario',
            [tipoBusca]: busca
        })
        .done(function (response) {
            $('#tabelaResultados').empty();
            if (response.encontrado !== false && response.length > 0) {
                $('#totalUsuarios').text(response.length);

                if (response.length === 1) {
                    var usuario = response[0];
                    window.location.href = `solicitarDesempregado.htm?chDesempregado=${usuario.chDesempregado}`;
                } else {
                    $.each(response, function (index, usuario) {
                        $('#tabelaResultados').append(
                            `<tr>
                                <td>${usuario.nome}</td>
                                <td>${usuario.cpf}</td>
                                <td>${usuario.rg}</td>
                                <td>${usuario.empresa}</td>
                                <td>${usuario.validade}</td>
                                <td>
                                    <button class="btn btn-info btn-sm verMaisBtn" data-id="${usuario.chDesempregado}">
                                        <i class="fas fa-eye"></i> 
                                    </button>
                                </td>
                            </tr>`
                        );
                    });

                    $('.verMaisBtn').click(function () {
                        var usuarioId = $(this).data('id');
                        carregarDesempregado(usuarioId);
                    });
                }
            } else {
                $('#totalUsuarios').text(0);
                $('#tabelaResultados').append(`
                    <tr>
                        <td colspan="6" class="text-center">Nenhum usuário encontrado.</td>
                    </tr>
                `);
            }
            $('#campoBusca').val('');
        })
        .fail(function () {
            alert('Erro ao buscar os dados. Tente novamente.');
        });
    }

    $('#btnBuscar').click(function () {
        buscarDesempregado();
    });

    const params = new URLSearchParams(window.location.search);
    const chDesempregado = params.get('chDesempregado');

    if (chDesempregado) {
        carregarDesempregado(chDesempregado);
    }

    function carregarDesempregado(usuarioId) {
        $.getJSON('desem.asp', {
            a: 'carregaDesempregado',
            chDesempregado: usuarioId
        })
        .done(function (response) {
            if (response.length > 0 && response[0].encontrado !== false) {
                var usuario = response[0];

                // Preencher os campos com os dados do usuário
                $('#cpf').val(usuario.cpf || '');
                $('#nome').val(usuario.nome || '');
                $('#rg').val(usuario.rg || '');
                $('#dataNascimento').val(usuario.dataNascimento ? usuario.dataNascimento.split("T")[0] : '');
                $('#telefone').val(usuario.telefone || '');
                $('#email').val(usuario.email || '');
                $('#numeroSelo').val(usuario.selo || '');
                $('#carteiraTrabalho').val(usuario.ctps || '');
                $('#serie').val(usuario.ctps_s || '');
                $('#cep').val(usuario.cep || '');
                $('#endereco').val(usuario.endereco || '');
                $('#numero').val(usuario.numero || '');
                $('#complemento').val(usuario.complemento || '');
                $('#bairro').val(usuario.bairro || '');
                $('#cidade').val(usuario.cidade || '');
                $('#estado').val(usuario.estado || '');
                $('#cnpj').val(usuario.cnpj || '');
                $('#nomeEmpresa').val(usuario.empresa || '');
                $('#dataDispensa').val(usuario.dispensa ? usuario.dispensa.split("T")[0] : '');
                $('#cepEmpresa').val(usuario.cepEmp || '');
                $('#enderecoEmpresa').val(usuario.enderecoEmp || '');
                $('#numeroEmpresa').val(usuario.numeroEmp || '');
                $('#complementoEmpresa').val(usuario.complementoEmp || '');
                $('#bairroEmpresa').val(usuario.bairroEmp || '');
                $('#cidadeEmpresa').val(usuario.cidadeEmp || '');
                $('#estadoEmpresa').val(usuario.estadoEmp || '');

                aplicarMascaras();
                atualizarCartao(usuario);
                carregarHistorico(); 
               
            } else {
                alert('Usuário não encontrado.');
            }
        })
        .fail(function () {
            alert('Erro ao carregar os dados. Tente novamente.');
        });
    }

    function formatarData(data) {
        const partes = data.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function atualizarCartao(usuario) {
        const validade = new Date(usuario.validade);
        const hoje = new Date();
        const diasRestantes = (validade - hoje) / (1000 * 60 * 60 * 24);
  
        const validadeStatus = $('#validadeStatus');
        const btnNovoCartao = $('#btnNovoCartao');
        const infoBoxIcon = $('.info-box-icon');
        const acaoBeneficio = $('#acaoBeneficio').parent();

        if (diasRestantes > 0) {
            validadeStatus.text("Val: " + formatarData(usuario.validade));
            infoBoxIcon.removeClass('bg-danger bg-warning').addClass('bg-success');
            btnNovoCartao.html('<i class="fas fa-redo"></i>  2ª via Cartão').show();
            acaoBeneficio.show();

        } else {
            validadeStatus.text("Expirado");
            infoBoxIcon.removeClass('bg-success bg-warning').addClass('bg-danger');
            btnNovoCartao.html('<i class="fas fa-plus"></i> Novo Cartão').show();
            acaoBeneficio.hide();
        }
    }

    
    
    
});
