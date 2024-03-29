package services;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import business.Pessoa;
import collections.ListaPessoa;
import error.ExcecaoGeral;
import org.json.JSONArray;
import org.json.JSONObject;
import org.simpleframework.http.Query;
import org.simpleframework.http.Request;

import business.Aluguel;
import business.Disponibilidade;
import business.Veiculo;
import collections.ListaAlugueis;
import collections.ListaDisponibilidade;
import collections.ListaVeiculo;
import dao.VeiculoDAO;

public class VeiculoService {
	private Veiculo veiculo;
	
	public JSONObject remove(Request request) throws Exception {
		String placa;
		
		Query query = request.getQuery();

	    placa = query.get("placa");
	    


	    try {
			ListaVeiculo listaVeiculo = new ListaVeiculo();
			Veiculo v = listaVeiculo.getVeiculoPlaca(placa);
			listaVeiculo.remove(v);
			return v.toJson();
		} catch (Exception e) {
			throw new ExcecaoGeral("A placa informada nao existe no sistema");
		}
	}
	
	public JSONObject add(Request request) throws Exception {
		int idProprietario;
		String placa;
		String cor;
		int anoFabricacao;
		int anoModelo;
		String chassi;
		String renavam;
		String marca;
		String modelo;
		int numeroPortas;
		int quilometragem;
		String combustivel;

		Query query = request.getQuery();

		try {
			idProprietario = query.getInteger("idProprietario");
		} catch (Exception e) {
			throw new ExcecaoGeral("Voce nao esta autenticado para realizar essa operacao");
		}
	    placa = query.get("placa");
	    cor = query.get("cor");

	    try {
			anoFabricacao = query.getInteger("anoFabricacao");
		} catch (Exception e) {
	    	throw new ExcecaoGeral("O ano de fabricação digitado e invalido");
		}

	    try {
			anoModelo = query.getInteger("anoModelo");
		} catch (Exception e) {
	    	throw new ExcecaoGeral("O ano do modelo informado e invalido");
		}

	    chassi = query.get("chassi");
	    renavam = query.get("renavam");
	    marca = query.get("marca");
	    modelo = query.get("modelo");

	    try {
			numeroPortas = query.getInteger("numeroPortas");
		} catch (Exception e) {
	    	throw new ExcecaoGeral("O numero de portas informado e invalido");
		}

	    try {
			quilometragem = query.getInteger("quilometragem");
		} catch (Exception e) {
	    	throw new ExcecaoGeral("A quilometragem inserida e invalida");
		}

	    combustivel = query.get("combustivel");
	    

	    veiculo = new Veiculo (idProprietario, placa, cor, anoFabricacao, anoModelo, chassi, renavam, marca, modelo, numeroPortas, quilometragem, combustivel);

	    ListaVeiculo listaVeiculos = new ListaVeiculo();
	    listaVeiculos.add(veiculo);
	    
		/*if (pessoa != null) {
			pessoa.add(pessoa);
		}*/

		return veiculo.toJson();

	}

	public JSONObject pesquisa(Request request) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		Query query = request.getQuery();
		String bairro;
	    bairro = query.get("bairro");

	    ListaVeiculo listVeiculo = new ListaVeiculo();
		ListaDisponibilidade listaDisponibilidade = new ListaDisponibilidade();
		List<Veiculo> veiculosDisponiveis = new ArrayList<Veiculo>();
		List<Veiculo> veiculos = new ArrayList<Veiculo>();
		veiculos = listVeiculo.getAll();

		LocalDateTime dataInicial =  LocalDateTime.parse(query.get("dataInicial"),formatter);
		LocalDateTime dataFinal =  LocalDateTime.parse(query.get("dataFinal"),formatter);

		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		if (bairro == null) {
			veiculosDisponiveis = listaDisponibilidade.consultaDisponibilidade(dataInicial, dataFinal);
		}
		else{
			veiculosDisponiveis = listaDisponibilidade.consultaDisponibilidade(dataInicial, dataFinal);
			veiculosDisponiveis.retainAll(listVeiculo.getVeiculosPorBairro(bairro));
		}

		veiculos.retainAll(veiculosDisponiveis);

	    for (Veiculo veiculo : veiculos) {
			Disponibilidade d = listaDisponibilidade.getDisponibilidade(dataInicial, dataFinal, veiculo.getId());

			list.put(veiculo.toJson()
					.put("IdDisponibilidade", d.getId())
					.put("DataInicial", d.getDataInicio())
					.put("DataFinal", d.getDataFinal())
					.put("ValorDaDiaria", d.getValorDaDiaria())
			);
		}

	    object.accumulate("values", list);

		return object;
	}
	
	public JSONObject pesquisaPorBairro(Request request) throws Exception {
		String bairro;
		Query query = request.getQuery();
	    bairro = query.get("bairro");
		ListaVeiculo listVeiculo = new ListaVeiculo();
		List<Veiculo> veiculos = listVeiculo.getAll();
		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Veiculo veiculo : veiculos) {
	 		list.put(veiculo.toJson());
	 		
		}
		
		object.accumulate("values", list);
	    
		return object;
	}
	
	public JSONObject adicionaDisponibilidade (Request request) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		int idVeiculo;
		LocalDateTime dataInicio;
		LocalDateTime dataFinal;
		LocalDateTime date;
		double valorDaDiaria;
		Query query = request.getQuery();
		
		idVeiculo = query.getInteger("idVeiculo");
		dataInicio = LocalDateTime.parse(query.get("dataInicio"),formatter);
		dataFinal = LocalDateTime.parse(query.get("dataFinal"),formatter);
		valorDaDiaria = query.getFloat("valorDaDiaria");
		
		ListaVeiculo listVeiculo = new ListaVeiculo();
		Veiculo veiculo = listVeiculo.getPorId(idVeiculo);
		Disponibilidade disponibilidade = new Disponibilidade(idVeiculo, dataInicio, dataFinal, valorDaDiaria);
	    veiculo.addDisponibilidade(disponibilidade);
	    
	    ListaDisponibilidade listaDisponibilidades = new ListaDisponibilidade();
	    listaDisponibilidades.add(disponibilidade);
	    
		return disponibilidade.toJson();
	}
	
	public JSONObject adicionaAluguel (Request request) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		LocalDateTime dataEmprestimo;
		LocalDateTime dataDevolucao;
		double valorAluguel;
		boolean devolvido;
		boolean pago;
		int idVeiculo;
		int idLocatario;
		Query query = request.getQuery();
		
		dataEmprestimo = LocalDateTime.parse(query.get("dataEmprestimo"),formatter);
		dataDevolucao = LocalDateTime.parse(query.get("dataDevolucao"),formatter);
		valorAluguel = query.getFloat("valorAluguel");
		devolvido = query.getBoolean("devolvido");
		pago = query.getBoolean("pago");
		idVeiculo = query.getInteger("idVeiculo");
		idLocatario = query.getInteger("idLocatario");

		ListaVeiculo listVeiculo = new ListaVeiculo();
		Veiculo veiculo = listVeiculo.getPorId(idVeiculo);
		Aluguel aluguel = new Aluguel(dataEmprestimo, dataDevolucao, valorAluguel, devolvido, pago, idVeiculo, idLocatario);
	    
		ListaAlugueis listaAlugueis = new ListaAlugueis();
	    listaAlugueis.add(aluguel);

	    ListaDisponibilidade disponibilidades = new ListaDisponibilidade();
	    Disponibilidade disponibilidade = disponibilidades.getDisponibilidade(dataEmprestimo, dataDevolucao, idVeiculo);
	    if (disponibilidade != null) {
	    	disponibilidades.remove(disponibilidade);
		}
		return aluguel.toJson();
	}
	
	public JSONObject consultaDisponibilidade (Request request) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		Query query = request.getQuery();
		
		LocalDateTime dataInicial =  LocalDateTime.parse(query.get("dataInicial"),formatter);
		LocalDateTime dataFinal =  LocalDateTime.parse(query.get("dataFinal"),formatter);
		
		ListaDisponibilidade listaDisponibilidade = new ListaDisponibilidade();
		List<Veiculo> veiculosDisponiveis = new ArrayList<Veiculo>();
		veiculosDisponiveis = listaDisponibilidade.consultaDisponibilidade(dataInicial, dataFinal);
		
		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Veiculo veiculo : veiculosDisponiveis) {
	 		list.put(veiculo.toJson());	
		}
		
		object.accumulate("values", list);
	    
		return object;
	}
	
	public JSONObject consultaAluguelVeiculo (Request request) throws Exception {
		Query query = request.getQuery();
		
		int idVeiculo = query.getInteger("idVeiculo");
		
		ListaAlugueis listaAlugueis = new ListaAlugueis();
		List<Aluguel> alugueisCadastrados = new ArrayList<Aluguel>();
		
		alugueisCadastrados = listaAlugueis.getAlugueisPorVeiculo(idVeiculo);
		
		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Aluguel aluguel : alugueisCadastrados) {
	 		list.put(aluguel.toJson());	
		}
		
		object.accumulate("values", list);
	    
		return object;
	}

	public JSONObject consultaAluguelProprietario (Request request) throws Exception {
		Query query = request.getQuery();

		int idProprietario = query.getInteger("idProprietario");

		ListaAlugueis listaAlugueis = new ListaAlugueis();
		List<Aluguel> alugueis = new ArrayList<Aluguel>();

		ListaVeiculo listaVeiculo = new ListaVeiculo();
		List<Veiculo> veiculos = listaVeiculo.getVeiculosPorProprietario(idProprietario);

		ListaPessoa listaPessoas = new ListaPessoa();
		Pessoa p;

		JSONObject object = new JSONObject();
		JSONArray geral = new JSONArray();
		JSONArray listAlugueis = new JSONArray();

		for (Veiculo v : veiculos) {
			alugueis = listaAlugueis.getAlugueisPorVeiculo(v.getId());
			for (Aluguel a : alugueis) {
				p = listaPessoas.get(a.getIdLocatario());
				listAlugueis.put(a.toJson().put("Locatario", p.toJson()).put("Veiculo", v.toJson()));
			}
			geral.put(listAlugueis);
			object.accumulate("values", geral);
			geral = new JSONArray();
			listAlugueis = new JSONArray();
		}
		return object;
	}
	
	public JSONObject consultaAluguelLocatario (Request request) throws Exception {
		Query query = request.getQuery();
		
		int idLocatario = query.getInteger("idLocatario");
		
		ListaAlugueis listaAlugueis = new ListaAlugueis();
		List<Aluguel> alugueisCadastrados = new ArrayList<Aluguel>();

		ListaVeiculo listaVeiculos = new ListaVeiculo();
		Veiculo v = null;

		ListaPessoa listaPessoas = new ListaPessoa();
		Pessoa p = null;

		alugueisCadastrados = listaAlugueis.getAlugueisPorLocatario(idLocatario);

		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Aluguel aluguel : alugueisCadastrados) {
			v = listaVeiculos.getPorId(aluguel.getIdVeiculo());
			p = listaPessoas.get(v.getIdProprietario());
			list.put(aluguel.toJson()
					.put("Veiculo", v.toJson())
					.put("Proprietario", p.toJson()));
		}
		
		object.accumulate("values", list);
	    
		return object;
	}

	public JSONObject consultaVeiculos (Request request) throws Exception {
		Query query = request.getQuery();

		int idProprietario = query.getInteger("idProprietario");
		ListaVeiculo listaVeiculo = new ListaVeiculo();
		List<Veiculo> veiculos = listaVeiculo.getVeiculosPorProprietario(idProprietario);

		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Veiculo veiculo : veiculos) {
			list.put(veiculo.toJson());
		}

		object.accumulate("values", list);

		return object;
	}

	public JSONObject alteraDisponibilidade(Request request) throws Exception {
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		Query query = request.getQuery();

		int idDisponibilidade = query.getInteger("idDisponibilidade");
		LocalDateTime dataInicial =  LocalDateTime.parse(query.get("dataInicial"),formatter);
		LocalDateTime dataFinal =  LocalDateTime.parse(query.get("dataFinal"),formatter);
		double valor = query.getFloat("valorDaDiaria");

		ListaDisponibilidade listaDisponibilidade = new ListaDisponibilidade();
		Disponibilidade d = listaDisponibilidade.getPorId(idDisponibilidade);
		d.setDataInicio(dataInicial);
		d.setDataFinal(dataFinal);
		d.setValorDaDiaria(valor);
		if (!listaDisponibilidade.update(d))
			throw new ExcecaoGeral("Algo deu errado na hora de fazer o update");


		return d.toJson();
	}

	public JSONObject excluiDisponibilidade(Request request) throws Exception {
		Query query = request.getQuery();

		int idDisponibilidade = query.getInteger("idDisponibilidade");

		ListaDisponibilidade listaDisponibilidade = new ListaDisponibilidade();
		Disponibilidade d = listaDisponibilidade.getPorId(idDisponibilidade);
		listaDisponibilidade.remove(d);

		return d.toJson();
	}

	public JSONObject consultaDisponibilidadePorProprietario(Request request) throws Exception {
		Query query = request.getQuery();

		int idProprietario = query.getInteger("idProprietario");

		ListaVeiculo listaVeiculo = new ListaVeiculo();
		List<Veiculo> veiculos = listaVeiculo.getVeiculosPorProprietario(idProprietario);
		ListaDisponibilidade listaDisponibilidade = new ListaDisponibilidade();
		List<Disponibilidade> disponibilidades;
		JSONObject object = new JSONObject();
		JSONArray list = new JSONArray();

		for (Veiculo v : veiculos) {

			disponibilidades = listaDisponibilidade.getdisponibilidadesPorVeiculo(v.getId());
			for (Disponibilidade d : disponibilidades) {
				list.put(d.toJson());
			}
			object.accumulate(v.getPlaca(), list);

			list = new JSONArray();
		}

		return object;
	}
}
