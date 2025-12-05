import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistroScreen({ navigation }) {
  // Estados principais
  const [pontoBase, setPontoBase] = useState('');
  const [classificacaoGeral, setClassificacaoGeral] = useState('');
  const [data, setData] = useState('');
  const [numeroAviso, setNumeroAviso] = useState('');
  
  // Dropdowns principais
  const [ome, setOme] = useState('');
  const [secao, setSecao] = useState('');
  const [numeroOrdem, setNumeroOrdem] = useState('');
  const [tipoViatura, setTipoViatura] = useState('');
  
  // Tipos e ocorrências DINÂMICAS
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState('');
  
  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalOptions, setModalOptions] = useState([]);
  const [modalCallback, setModalCallback] = useState(() => {});

  // OPÇÕES FIXAS
  const opcoesFixas = {
    ome: ['GBXLT', 'GBZPH', 'GBMHF', 'GBAPH'],
    secao: ['SBXH', 'SBPL', 'SBTR', 'SBOPS'],
    numeroOrdem: ['704', '8610', '9347', '3610', '3016'],
    tipoViatura: ['VTR', 'AMB', 'SOC', 'INC', 'RES'],
    tiposOcorrencia: [
      'Emergência',
      'Queimadura', 
      'Acidente de trânsito',
      'Incidente com Animal',
      'Queda',
      'Trauma'
    ],
  };

  // OPÇÕES DINÂMICAS POR TIPO (da sua imagem)
  const opcoesPorTipo = {
    'Emergência': ['Clínicas diversas','Cardíaca', 'Obstétrica', 'Psiquiátrica','respiratorio'],
    'Queimadura': ['Elétrica/choque', 'Química', 'Térmica', 'Biológica', 'Radioativa'],
    'Acidente de trânsito': ['Atropelamento', 'Capotamento', 'Colisão/Abalroamento', 'Choque'],
    'Incidente com Animal': ['Aquático', 'Inseto', 'com peçonha', 'sem peçonha'],
    'Queda': ['Moto', 'Bicicleta', 'Animal', 'Nível Acima de 2m', 'Nível Abaixo de 2m', 'Própria Altura'],
    'Trauma': ['Por obj. Perfurocortante', 'Por obj. Contundente', 'Vitima de agressão', 'Acidentes diversos', 'Outro'],
  };

  // MÁSCARA DE DATA (DD/MM/AAAA HH:mm)
  const formatarData = (texto) => {
    // Remove tudo que não é número
    let numeros = texto.replace(/\D/g, '');
    
    // Limita o tamanho
    if (numeros.length > 12) {
      numeros = numeros.substring(0, 12);
    }
    
    // Aplica a máscara
    let formatado = '';
    
    if (numeros.length > 0) {
      formatado = numeros.substring(0, 2); // DD
    }
    if (numeros.length > 2) {
      formatado += '/' + numeros.substring(2, 4); // MM
    }
    if (numeros.length > 4) {
      formatado += '/' + numeros.substring(4, 8); // AAAA
    }
    if (numeros.length > 8) {
      formatado += ' ' + numeros.substring(8, 10); // HH
    }
    if (numeros.length > 10) {
      formatado += ':' + numeros.substring(10, 12); // mm
    }
    
    return formatado;
  };

  const handleDataChange = (texto) => {
    const formatado = formatarData(texto);
    setData(formatado);
  };

  // Quando tipo de ocorrência muda, limpa a ocorrência selecionada
  useEffect(() => {
    if (tipoOcorrencia) {
      setOcorrenciaSelecionada('');
    }
  }, [tipoOcorrencia]);

  // Abrir modal
  const abrirDropdown = (tipo, callback) => {
    setModalType(tipo);
    
    if (tipo === 'ocorrencia' && tipoOcorrencia) {
      setModalOptions(opcoesPorTipo[tipoOcorrencia] || []);
    } else {
      setModalOptions(opcoesFixas[tipo] || []);
    }
    
    setModalCallback(() => callback);
    setModalVisible(true);
  };

  // Salvar registro
  const salvarRegistro = async () => {
    if (!pontoBase) {
      Alert.alert('Atenção', 'Preencha o Ponto Base');
      return;
    }

    const registro = {
      id: Date.now(),
      pontoBase,
      ome,
      secao,
      viatura: {
        numeroOrdem,
        tipoViatura,
      },
      ocorrencia: {
        classificacaoGeral,
        data,
        numeroAviso,
        tipoOcorrencia,
        ocorrencia: ocorrenciaSelecionada,
      },
      dataRegistro: new Date().toLocaleString(),
    };

    try {
      const registros = JSON.parse(await AsyncStorage.getItem('registros') || '[]');
      registros.push(registro);
      await AsyncStorage.setItem('registros', JSON.stringify(registros));
      
     // 🔥 NOVA LÓGICA DE NAVEGAÇÃO 🔥
if (tipoOcorrencia === 'Queimadura') {
  // Navega para tela específica de Queimadura
  navigation.navigate('Queimadura', { 
    registroBase: registro 
  });
} else {
  // Para outros tipos, mostra alerta normal
  Alert.alert('✅ Sucesso', 'Registro salvo!', [
    { text: 'Novo', onPress: limparFormulario },
    { text: 'Ver Registros', onPress: () => navigation.navigate('Lista') }
  ]);
}
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  // Limpar formulário
  const limparFormulario = () => {
    setPontoBase('');
    setOme('');
    setSecao('');
    setNumeroOrdem('');
    setTipoViatura('');
    setClassificacaoGeral('');
    setData('');
    setNumeroAviso('');
    setTipoOcorrencia('');
    setOcorrenciaSelecionada('');
  };

  // Componente Dropdown
  const Dropdown = ({ label, value, onPress, placeholder, disabled }) => (
    <View style={styles.dropdownContainer}>
      {label && <Text style={styles.dropdownLabel}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.dropdownButton, disabled && styles.dropdownDisabled]} 
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* TÍTULO PRINCIPAL */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Registro</Text>
        </View>

        {/* SEÇÃO 1: PONTO BASE */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Ponto Base:</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            value={pontoBase}
            onChangeText={setPontoBase}
            placeholderTextColor="#888"
          />

          <Dropdown
            label='OME_°GB:'
            value={ome}
            onPress={() => abrirDropdown('ome', setOme)}
            placeholder="Selecione"
          />

          <Dropdown
            label='Seção_°SB:'
            value={secao}
            onPress={() => abrirDropdown('secao', setSecao)}
            placeholder="Selecione"
          />
        </View>

        {/* DIVISOR */}
        <View style={styles.divisor} />

        {/* SEÇÃO 2: VIATURA RESPONSÁVEL */}
        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Viatura Responsável</Text>
          
          <Text style={styles.label}>N° de ordem:</Text>
          
          <Dropdown
            value={numeroOrdem}
            onPress={() => abrirDropdown('numeroOrdem', setNumeroOrdem)}
            placeholder="Escolha"
          />

          <View style={styles.linha}>
            <View style={styles.coluna}>
              <Text style={styles.label}>Tipo:</Text>
            </View>
            <View style={styles.coluna}>
              <Dropdown
                value={tipoViatura}
                onPress={() => abrirDropdown('tipoViatura', setTipoViatura)}
                placeholder="Selecione"
              />
            </View>
          </View>
        </View>

        {/* DIVISOR */}
        <View style={styles.divisor} />

        {/* SEÇÃO 3: TIPO DE OCORRÊNCIA */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Tipo de ocorrência</Text>
          
          <Text style={styles.label}>Classificação geral:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            value={classificacaoGeral}
            onChangeText={setClassificacaoGeral}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Data:</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA HH:mm"
            value={data}
            onChangeText={handleDataChange}
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={16}
          />

          <Text style={styles.label}>Nº do Aviso:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            value={numeroAviso}
            onChangeText={setNumeroAviso}
            placeholderTextColor="#888"
          />

          <Text style={styles.subtitulo}>Grupos:</Text>
          
          <Text style={styles.label}>Tipo de ocorrência:</Text>
          <Dropdown
            value={tipoOcorrencia}
            onPress={() => abrirDropdown('tiposOcorrencia', setTipoOcorrencia)}
            placeholder="Selecione o tipo"
          />

          <Text style={styles.label}>Ocorrência:</Text>
          <Dropdown
            value={ocorrenciaSelecionada}
            onPress={() => abrirDropdown('ocorrencia', setOcorrenciaSelecionada)}
            placeholder={tipoOcorrencia ? "Selecione a ocorrência" : "Selecione primeiro o tipo"}
            disabled={!tipoOcorrencia}
          />
        </View>

        {/* BOTÕES */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarRegistro}>
            <Text style={styles.botaoTexto}>💾 SALVAR REGISTRO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botaoVer} onPress={() => navigation.navigate('Lista')}>
            <Text style={styles.botaoTexto}>📄 VER REGISTROS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botaoLimpar} onPress={limparFormulario}>
            <Text style={styles.botaoTexto}>🗑️ LIMPAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE SELEÇÃO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {modalType === 'tiposOcorrencia' ? 'Selecione o Tipo' : 
               modalType === 'ocorrencia' ? `Ocorrências - ${tipoOcorrencia}` : 
               'Selecione'}
            </Text>
            
            <FlatList
              data={modalOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOpcao}
                  onPress={() => {
                    modalCallback(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalTexto}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.modalFechar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalFecharTexto}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollView: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  secao: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F5F9FF',
    marginBottom: 10,
    color: '#0D47A1',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 5,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#64B5F6',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#E3F2FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#0D47A1',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#64B5F6',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#2196F3',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  coluna: {
    flex: 1,
  },
  divisor: {
    height: 2,
    backgroundColor: '#BBDEFB',
    marginVertical: 20,
  },
  botoesContainer: {
    marginTop: 20,
  },
  botaoSalvar: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoVer: {
    backgroundColor: '#42A5F5',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoLimpar: {
    backgroundColor: '#E57373',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#2196F3',
    color: 'white',
  },
  modalOpcao: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTexto: {
    fontSize: 16,
    color: '#333',
  },
  modalFechar: {
    padding: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  modalFecharTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const salvarRegistro = async () => {
  if (!pontoBase) {
    Alert.alert('Atenção', 'Preencha o Ponto Base');
    return;
  }

  const registro = {
    id: Date.now(),
    pontoBase,
    ome,
    secao,
    viatura: {
      numeroOrdem,
      tipoViatura,
    },
    ocorrencia: {
      classificacaoGeral,
      data,
      numeroAviso,
      tipoOcorrencia,
      ocorrencia: ocorrenciaSelecionada,
    },
    dataRegistro: new Date().toLocaleString(),
  };

  try {
    const registros = JSON.parse(await AsyncStorage.getItem('registros') || '[]');
    registros.push(registro);
    await AsyncStorage.setItem('registros', JSON.stringify(registros));
    
    // 🔥 AQUI ESTÁ A MUDANÇA! 🔥
    if (tipoOcorrencia === 'Queimadura') {
      // Navega para tela específica de Queimadura
      navigation.navigate('Queimadura', { 
        registroBase: registro 
      });
    } else {
      // Para outros tipos, mostra alerta normal
      Alert.alert('✅ Sucesso', 'Registro salvo!', [
        { text: 'Novo', onPress: limparFormulario },
        { text: 'Ver Registros', onPress: () => navigation.navigate('Lista') }
      ]);
    }
    
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar');
  }
};