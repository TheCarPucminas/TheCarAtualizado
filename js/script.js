function salvarPessoa() {
    var xmlhttp = new XMLHttpRequest();

    var form = document.getElementById('form-pessoa');
    var formData = new FormData(form);
    var url = "nome=" + formData.get("nome") +
        "&email=" + formData.get("email") +
        "&cpf=" + formData.get("cpf") +
        "&rg=" + formData.get("rg") +
        "&cnh=" + formData.get("cnh") +
        "&senha=" + formData.get("senha") +
        "&cep=" + formData.get("cep") +
        "&rua=" + formData.get("rua") +
        "&numero=" + formData.get("numero") +
        "&bairro=" + formData.get("bairro") +
        "&cidade=" + formData.get("cidade") +
        "&estado=" + formData.get("estado") +
        "&telefone=" + formData.get("telefone") +
        "&celular=" + formData.get("celular");

    xmlhttp.onreadystatechange = function () {
        var responseJSON = JSON.parse(xmlhttp.responseText);
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status == 201) {
                var id = responseJSON.id;
                localStorage.setItem('id', id);
                window.location.href = "index.html";
            }
        }
        else {
            alert(responseJSON.error);
        }
    }

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/pessoa?" + url, true);
        xmlhttp.send(null);
    }
}

function salvarVeiculo() {
    var xmlhttp = new XMLHttpRequest();

    var form = document.getElementById('form-veiculo');
    var formData = new FormData(form);
    var url = "idProprietario=" + localStorage.getItem('id') +
        "&placa=" + formData.get("placa") +
        "&cor=" + formData.get("cor") +
        "&anoFabricacao=" + formData.get("anoFabricacao") +
        "&anoModelo=" + formData.get("anoModelo") +
        "&chassi=" + formData.get("chassi") +
        "&renavam=" + formData.get("renavam") +
        "&marca=" + formData.get("marca") +
        "&modelo=" + formData.get("modelo") +
        "&numeroPortas=" + formData.get("numeroPortas") +
        "&quilometragem=" + formData.get("quilometragem") +
        "&combustivel=" + formData.get("combustivel");

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/veiculo?" + url, true);
        xmlhttp.send();
        window.location.href = "listaVeiculos.html";
    }
}

function excluirVeiculo() {
    var xmlhttp = new XMLHttpRequest();

    var form = document.getElementById('form-exclusao-veiculo');
    var formData = new FormData(form);
    var url = "placa=" + formData.get("placa");

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/excluir-veiculo?" + url, true);
        xmlhttp.send();
        window.location.href = "listaVeiculos.html";
    }
}

function salvarLogin() {
    deslogar();
    var xmlhttp = new XMLHttpRequest();

    var form = document.getElementById('form-login');
    var formData = new FormData(form);
    var url = "email=" + formData.get("email") +
        "&senha=" + formData.get("senha");
    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/login?" + url, true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status == 200) {
                var responseJSON = JSON.parse(xmlhttp.responseText);
                var id = responseJSON.id;
                var nome = responseJSON.nome;
                localStorage.setItem('id', id);
                localStorage.setItem('nome', nome);
                window.location.href = "perfil.html";
            }
            else {
                alert("LOGIN OU SENHA INVÁLIDOS");
            }
        }
    }
}

function exibeNomeUsuario() {
    if (localStorage.getItem('nome')) {
        document.getElementById('navbarDropdownMenuLink').innerHTML = localStorage.getItem('nome');
    }
}

function verificaLogin() {
    if (!localStorage.getItem('id')) {
        alert("Você não está logado!");
        window.location.href = "index.html";
    }
}

function deslogar() {
    localStorage.removeItem('id');
}

function pesquisa() {
    var xmlhttp = new XMLHttpRequest();

    var form = document.getElementById('form-pesquisa');
    var formData = new FormData(form);

    var bairro = formData.get("bairro");

    if (formData.get("bairro"))
        var url = "?bairro=" + formData.get("bairro")
        +"&dataInicial="+formData.get("dataInicioAluguel")+"T00:00:00"
        +"&dataFinal="+formData.get("dataFimAluguel")+"T00:00:00";
    else
        var url = "?dataInicial="+formData.get("dataInicioAluguel")+"T00:00:00"
        +"&dataFinal="+formData.get("dataFimAluguel")+"T00:00:00";

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status == 200) {
                    var responseJSON = JSON.parse(xmlhttp.responseText);
    
                    //Informações que vão preencher os campos da tabela
                    var tr = document.createElement('tr');
                    var dados = responseJSON.values[0];
                    var table = document.getElementById('exibeVeiculos');
                    
                    table.innerHTML = ""; 
                    //table.insertRow(1);
                    var i;
                        for (i = 0; i < dados.length; i++) {
                            var row = table.insertRow(i);
                            row.innerHTML = `<td scope="row">${dados[i]['nome']}</td>
                            <td>${ dados[i]['modelo']}</td>
                            <td>${dados[i]['bairro']}</td>
                            <td>${dados[i]['celular']}</td>
                            <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-xl" onClick="preencheModal(${i})">Mais</button></td>`;
                        }
                    
                }
            }
        }

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/pesquisa" + url, true);
        xmlhttp.send();
    }
}

function listarVeiculos() {
    var xmlhttp = new XMLHttpRequest();
    var url = "idProprietario=" + localStorage.getItem('id');

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/consulta-veiculos?" + url, true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.responseText != "") {
                var responseJSON = JSON.parse(xmlhttp.responseText);

                //Preenchendo a tabela com os veículos do usuário logado
                var tr = document.createElement('tr');
                var dados = responseJSON.values[0];
                var i;
                console.log(dados);
                if (responseJSON != null && responseJSON != "") {
                    for (i = 0; i < dados.length; i++) {
                        var table = document.getElementById('exibeVeiculosUsuario');
                        var row = table.insertRow(1);
                        row.innerHTML = "<td>"+dados[i]['marca']+
                                        "</td><td>"+dados[i]['placa']+
                                        "</td><td>"+dados[i]['modelo']+
                                        "</td><td>"+dados[i]['cor']+
                                        "</td><td>"+dados[i]['anoFabricacao']+
                                        "</td><td>"+dados[i]['combustivel']+
                                        "</td><td>"+'<button style="margin-left: 45px;" type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-xl" onClick="preencheModal(${i})">Mais</button>'+
                                        "</td>";
                    }
                }
            }
        }
    }
}

function listarAlugueisLocatario() {
    var xmlhttp = new XMLHttpRequest();
    var url = "idLocatario=" + localStorage.getItem('id');

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/consulta-aluguel-locatario?" + url, true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.responseText != "") {
                var responseJSON = JSON.parse(xmlhttp.responseText);

                //Preenchendo a tabela com os alugueis feitos por quem está logado
                var tr = document.createElement('tr');
                var dados = responseJSON.values[0];
                var i;
                
                if (responseJSON != null && responseJSON != "") {
                    for (i = 0; i < dados.length; i++) {
                        var table = document.getElementById('exibeAluguelLocatario');
                        var row = table.insertRow(1);
                        var devolvido = (dados[i]['devolvido'] == false) ? 'NÃO' : 'SIM';

                        row.innerHTML = "<td>"+dados[i]['Veiculo']['modelo']+
                                        "</td><td>"+dados[i]['Proprietario']['nome']+
                                        "</td><td>"+dados[i]['Proprietario']['celular']+
                                        "</td><td>"+dados[i]['dataEmprestimo']+
                                        "</td><td>"+dados[i]['valor']+
                                        "</td><td>"+devolvido+
                                        "</td>";
                    }
                }
            }
        }
    }
}

function listarAlugueisProprietario() {
    var xmlhttp = new XMLHttpRequest();
    var url = "idProprietario=" + localStorage.getItem('id');

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/consulta-aluguel-proprietario?" + url, true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.responseText != "") {
                var responseJSON = JSON.parse(xmlhttp.responseText);

                //Preenchendo a tabela com os dados de quem alugou os veículos de quem está logado
                var tr = document.createElement('tr');
                var dados = responseJSON.values[0][0];
                var i;

                //console.log(dados['Locatario']['nome']);
                if (responseJSON != null && responseJSON != "") {
                    for (i = 0; i < dados.length; i++) {
                        var table = document.getElementById('exibeAluguelProprietario');
                        var row = table.insertRow(1);
                        var devolvido = (dados[i]['devolvido'] == false) ? 'NÃO' : 'SIM';
//console.log(dados);                        
                        row.innerHTML = "<td>"+dados[i]['Veiculo']['placa']+
                                        "</td><td>"+dados[i]['Locatario']['nome']+
                                        "</td><td>"+dados[i]['Locatario']['celular']+
                                        "</td><td>"+dados[i]['dataEmprestimo']+
                                        "</td><td>"+dados[i]['valor']+
                                        "</td><td>"+devolvido+
                                        "</td>";
                    }
                }
            }
        }
    }
}

function preencheModal(i) {
    var xmlhttp = new XMLHttpRequest();
    var form = document.getElementById('form-pesquisa');
    var formData = new FormData(form);

    if (xmlhttp) {
        xmlhttp.open('get', "http://localhost:8080/pesquisa", true);
        xmlhttp.send();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.responseText != "") {
                var responseJSON = JSON.parse(xmlhttp.responseText);

                //Informações que vão preencher os campos da tabela

                var dados = responseJSON.values[0];
                document.getElementById('infoAluguel').innerHTML = `<fieldset disabled><form>
                <div class="form-group row">
                  
                <div class="col-4">
                <label for="disabledTextInput">Nome</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['nome']}">
                </div>
                 
                <div class="col-4">
                <label for="disabledTextInput">Email</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['email']}">
                </div>

                <div class="col-4">
                <label for="disabledTextInput">Telefone</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['celular']}">
                </div>
                </div>

                <div class="form-group row">
                <div class="col-2">
                <label for="disabledTextInput">Placa</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['placa']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Ano Modelo</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['anoModelo']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Ano Fabricação</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['anoFabri']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Marca</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['marca']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Modelo</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['modelo']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Combustível</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['combustivel']}">
                </div>
                </div>

                <div class="form-group row">
                <div class="col-2">
                <label for="disabledTextInput">Número portas</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['numeroPortas']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">CEP</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['cep']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Bairro</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['bairro']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Cidade</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['cidade']}">
                </div>
                <div class="col-2">
                <label for="disabledTextInput">Estado</label>
                <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" value= "${dados[i]['estado']}">
                </div>
              </form></fieldset>`
            }
        }
    }
    //document.getElementById('name').innerHTML = dados[i]['nome'];
    /* document.getElementById('demo1').innerHTML = db[indice].genero;
     document.getElementById('demo2').innerHTML = db[indice].temporadas;
     document.getElementById('demo3').innerHTML = db[indice].personagem;
     document.getElementById('demo4').innerHTML = db[indice].publico;
     document.getElementById('demo5').src = db[indice].imagem;
     document.getElementById('demo6').innerHTML = db[indice].sinopse;*/
}
//************************ CONJUNTO DE FUNÇÕES PARA IDENTIFICAR O ENDEREÇO ************************
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('email').value = ("");
    document.getElementById('nome').value = ("");
    document.getElementById('cpf').value = ("");
    document.getElementById('rg').value = ("");
    document.getElementById('cnh').value = ("");
    document.getElementById('senha').value = ("");
    document.getElementById('cep').value = ("");
    document.getElementById('rua').value = ("");
    document.getElementById('numero').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('estado').value = ("");
    document.getElementById('telefone').value = ("");
    document.getElementById('celular').value = ("");

}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        console.log(conteudo.bairro + conteudo.logradouro + conteudo.localidade);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');
    console.log(cep);
    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";

            //Cria um elemento javascript.
            var script = document.createElement('script');
            console.log(script);
            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};
//************************ AS FUNÇÕES DE IDENTIFICAÇÃO DE ENDEREÇO TERMINAM AQUI ************************

//************************ VALIDAÇÃO DE EMAIL ************************
function validaEmail(envelope) {
    usuario = envelope.value.substring(0, envelope.value.indexOf("@"));
    dominio = envelope.value.substring(envelope.value.indexOf("@") + 1, envelope.value.length);

    if ((usuario.length >= 1) &&
        (dominio.length >= 3) &&
        (usuario.search("@") == -1) &&
        (dominio.search("@") == -1) &&
        (usuario.search(" ") == -1) &&
        (dominio.search(" ") == -1) &&
        (dominio.search(".") != -1) &&
        (dominio.indexOf(".") >= 1) &&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {
        document.getElementById("resposta").innerHTML = "E-mail válido";
        alert("E-mail valido");
    }
    else {
        document.getElementById("resposta").innerHTML = "<font color='green'>E-mail inválido </font>";
        alert("E-mail invalido");
    }
}